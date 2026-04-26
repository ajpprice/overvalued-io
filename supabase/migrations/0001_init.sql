-- overvalued.io initial schema
create extension if not exists "pgcrypto";

-- ============ tables ============

create table if not exists public.stocks (
  ticker        text primary key,
  name          text not null,
  bear_score    numeric not null default 0,
  total_theses  int not null default 0,
  total_votes   int not null default 0,
  updated_at    timestamptz not null default now()
);

create table if not exists public.profiles (
  id                 uuid primary key references auth.users(id) on delete cascade,
  reputation         int not null default 0,
  theses_submitted   int not null default 0,
  vote_accuracy      numeric not null default 0,
  created_at         timestamptz not null default now()
);

create table if not exists public.theses (
  id            uuid primary key default gen_random_uuid(),
  ticker        text not null references public.stocks(ticker) on delete cascade,
  title         text not null,
  body          text not null,
  key_risks     text[] not null default '{}',
  target_price  numeric,
  time_horizon  text,
  author_id     uuid not null references auth.users(id) on delete cascade,
  upvotes       int not null default 0,
  downvotes     int not null default 0,
  created_at    timestamptz not null default now()
);

create index if not exists theses_ticker_idx on public.theses(ticker);
create index if not exists theses_created_idx on public.theses(created_at desc);

create table if not exists public.votes (
  user_id     uuid not null references auth.users(id) on delete cascade,
  thesis_id   uuid not null references public.theses(id) on delete cascade,
  direction   smallint not null check (direction in (-1, 1)),
  created_at  timestamptz not null default now(),
  primary key (user_id, thesis_id)
);

create table if not exists public.affiliate_clicks (
  id          bigserial primary key,
  user_id     uuid references auth.users(id) on delete set null,
  ticker      text not null,
  clicked_at  timestamptz not null default now(),
  converted   boolean not null default false
);

-- ============ functions ============

create or replace function public.compute_bear_score(p_upvotes int, p_downvotes int, p_total_votes int)
returns numeric
language plpgsql
immutable
as $$
begin
  return ((p_upvotes - p_downvotes)::numeric / (p_upvotes + p_downvotes + 1)::numeric)
         * ln((p_total_votes + 1)::numeric);
end;
$$;

create or replace function public.recalc_thesis_and_stock(p_thesis_id uuid)
returns void
language plpgsql
as $$
declare
  v_up int;
  v_down int;
  v_ticker text;
  v_total int;
  v_score numeric;
begin
  select
    coalesce(sum(case when direction = 1 then 1 else 0 end), 0),
    coalesce(sum(case when direction = -1 then 1 else 0 end), 0)
  into v_up, v_down
  from public.votes
  where thesis_id = p_thesis_id;

  update public.theses
     set upvotes = v_up, downvotes = v_down
   where id = p_thesis_id
   returning ticker into v_ticker;

  if v_ticker is null then return; end if;

  select coalesce(sum(upvotes + downvotes), 0)
    into v_total
    from public.theses
   where ticker = v_ticker;

  select coalesce(avg(public.compute_bear_score(upvotes, downvotes, upvotes + downvotes)), 0) * 50 + 50
    into v_score
    from public.theses
   where ticker = v_ticker;

  -- normalize to a 0-100ish range; clamp
  if v_score is null then v_score := 0; end if;

  update public.stocks
     set total_votes = v_total,
         bear_score = greatest(0, least(100, v_score)),
         updated_at = now()
   where ticker = v_ticker;
end;
$$;

create or replace function public.on_vote_change()
returns trigger
language plpgsql
as $$
begin
  if (tg_op = 'DELETE') then
    perform public.recalc_thesis_and_stock(old.thesis_id);
    return old;
  else
    perform public.recalc_thesis_and_stock(new.thesis_id);
    return new;
  end if;
end;
$$;

drop trigger if exists trg_votes_change on public.votes;
create trigger trg_votes_change
after insert or update or delete on public.votes
for each row execute function public.on_vote_change();

create or replace function public.on_thesis_insert()
returns trigger
language plpgsql
as $$
begin
  update public.stocks set total_theses = total_theses + 1, updated_at = now() where ticker = new.ticker;
  insert into public.profiles(id, theses_submitted)
    values (new.author_id, 1)
    on conflict (id) do update set theses_submitted = public.profiles.theses_submitted + 1;
  return new;
end;
$$;

drop trigger if exists trg_thesis_insert on public.theses;
create trigger trg_thesis_insert
after insert on public.theses
for each row execute function public.on_thesis_insert();

-- create a profile row whenever a new auth user appears
create or replace function public.on_auth_user_created()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles(id) values (new.id) on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists trg_auth_user_created on auth.users;
create trigger trg_auth_user_created
after insert on auth.users
for each row execute function public.on_auth_user_created();

-- ============ RLS ============

alter table public.stocks enable row level security;
alter table public.theses enable row level security;
alter table public.votes enable row level security;
alter table public.profiles enable row level security;
alter table public.affiliate_clicks enable row level security;

-- stocks: public read
drop policy if exists stocks_select on public.stocks;
create policy stocks_select on public.stocks for select using (true);

-- profiles: public read
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles for select using (true);

-- theses: public read, authenticated insert (must be author)
drop policy if exists theses_select on public.theses;
create policy theses_select on public.theses for select using (true);

drop policy if exists theses_insert on public.theses;
create policy theses_insert on public.theses
  for insert to authenticated
  with check (author_id = auth.uid());

-- votes: public read; authenticated insert/update/delete own rows
drop policy if exists votes_select on public.votes;
create policy votes_select on public.votes for select using (true);

drop policy if exists votes_insert on public.votes;
create policy votes_insert on public.votes
  for insert to authenticated
  with check (user_id = auth.uid());

drop policy if exists votes_update on public.votes;
create policy votes_update on public.votes
  for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists votes_delete on public.votes;
create policy votes_delete on public.votes
  for delete to authenticated
  using (user_id = auth.uid());

-- affiliate_clicks: anyone can insert, only service role can read
drop policy if exists clicks_insert on public.affiliate_clicks;
create policy clicks_insert on public.affiliate_clicks
  for insert to anon, authenticated
  with check (true);
-- (no select policy => only service role bypassing RLS can read)
