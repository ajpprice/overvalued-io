-- overvalued.io v2 schema
-- Pre-launch rebuild: replaces v1 tables with extended signal columns,
-- bags profiles, multi-broker affiliate tracking, component bear-score storage,
-- and resolution metadata for the future leaderboard.

create extension if not exists "pgcrypto";

-- Drop legacy / previous-iteration objects (safe in pre-launch).
drop trigger if exists trg_votes_change on public.votes;
drop trigger if exists trg_thesis_insert on public.theses;
drop trigger if exists trg_stock_signal_change on public.stocks;
drop trigger if exists trg_auth_user_created on auth.users;

drop function if exists public.on_vote_change() cascade;
drop function if exists public.on_thesis_insert() cascade;
drop function if exists public.on_stock_signal_change() cascade;
drop function if exists public.on_auth_user_created() cascade;
drop function if exists public.recalc_stock_bear_score(text) cascade;
drop function if exists public.recalc_stock_bear_score(uuid) cascade;
drop function if exists public.compute_bear_score(numeric, numeric, numeric, numeric) cascade;
drop function if exists public.compute_community_score(int, int, int) cascade;
drop function if exists public.wilson_lower_bound(int, int) cascade;

drop table if exists public.affiliate_clicks cascade;
drop table if exists public.votes cascade;
drop table if exists public.theses cascade;
drop table if exists public.bags_picks cascade;
drop table if exists public.bags_profiles cascade;
drop table if exists public.profiles cascade;
drop table if exists public.stocks cascade;

-- ============ stocks ============
create table public.stocks (
  ticker                      text primary key,
  name                        text not null,
  exchange                    text not null,
  current_price               numeric,
  bear_score                  numeric not null default 0,
  bear_score_community        numeric not null default 0,
  bear_score_valuation        numeric not null default 0,
  bear_score_short_interest   numeric not null default 0,
  bear_score_sentiment        numeric not null default 0,
  valuation_discount_pct      numeric,
  short_interest_pct          numeric,
  insider_selling_3m_usd      bigint,
  trustpilot_score            numeric,
  reddit_sentiment            numeric,
  total_theses                int not null default 0,
  total_votes                 int not null default 0,
  category                    text not null
    check (category in ('valuation','consumer_hate','brand_decay','bags','structural_decay','never_profitable','undervalued')),
  created_at                  timestamptz not null default now(),
  updated_at                  timestamptz not null default now()
);
create index stocks_bear_score_idx on public.stocks(bear_score desc);
create index stocks_category_idx on public.stocks(category);

-- ============ profiles ============
create table public.profiles (
  id                 uuid primary key references auth.users(id) on delete cascade,
  username           text,
  reputation         int not null default 0,
  theses_submitted   int not null default 0,
  vote_accuracy      numeric not null default 0,
  created_at         timestamptz not null default now()
);

-- ============ theses ============
create table public.theses (
  id                uuid primary key default gen_random_uuid(),
  ticker            text not null references public.stocks(ticker) on delete cascade,
  title             text not null,
  body              text not null,
  key_risks         text[] not null default '{}',
  target_price      numeric,
  time_horizon      text,
  author_id         uuid not null references auth.users(id) on delete cascade,
  upvotes           int not null default 0,
  downvotes         int not null default 0,
  resolved_at       timestamptz,
  resolved_outcome  text not null default 'unresolved'
    check (resolved_outcome in ('correct','incorrect','unresolved')),
  created_at        timestamptz not null default now()
);
create index theses_ticker_idx on public.theses(ticker);
create index theses_created_idx on public.theses(created_at desc);

-- ============ votes ============
create table public.votes (
  user_id     uuid not null references auth.users(id) on delete cascade,
  thesis_id   uuid not null references public.theses(id) on delete cascade,
  direction   smallint not null check (direction in (-1, 1)),
  created_at  timestamptz not null default now(),
  primary key (user_id, thesis_id)
);

-- ============ bags_profiles ============
create table public.bags_profiles (
  id                     uuid primary key default gen_random_uuid(),
  slug                   text unique not null,
  name                   text not null,
  profile_type           text not null check (profile_type in ('vc','podcaster','politician')),
  description            text,
  bags_score             numeric not null default 0,
  track_record_summary   text,
  avatar_url             text,
  created_at             timestamptz not null default now()
);

-- ============ bags_picks ============
create table public.bags_picks (
  id               uuid primary key default gen_random_uuid(),
  bags_profile_id  uuid not null references public.bags_profiles(id) on delete cascade,
  ticker_or_name   text not null,
  pick_date        date,
  pick_price       numeric,
  current_price    numeric,
  return_pct       numeric,
  source_url       text,
  notes            text,
  created_at       timestamptz not null default now()
);
create index bags_picks_profile_idx on public.bags_picks(bags_profile_id);
create index bags_picks_date_idx on public.bags_picks(pick_date desc);

-- ============ affiliate_clicks ============
create table public.affiliate_clicks (
  id          bigserial primary key,
  user_id     uuid references auth.users(id) on delete set null,
  ticker      text,
  broker      text not null check (broker in ('kraken','ig','saxo','etoro')),
  clicked_at  timestamptz not null default now(),
  converted   boolean not null default false
);
create index affiliate_clicks_broker_idx on public.affiliate_clicks(broker);

-- ============================================================
-- Bear Score v2 — weighted composite of four 0-100 components.
--   community     40%  Wilson-style score from upvote/downvote net.
--   valuation     25%  valuation_discount_pct, clamped 0-100.
--   short_interest 15% short_interest_pct * 4, clamped to 100.
--   sentiment     20%  Trustpilot (50%) + Reddit (50%), inverted.
-- ============================================================

create or replace function public.compute_community_score(p_up int, p_down int, p_total_votes int)
returns numeric
language plpgsql
immutable
as $$
declare
  s numeric;
begin
  if (p_up + p_down) <= 0 then
    return 50;
  end if;
  -- ((up - down) / (up + down + 1)) * ln(total_votes + 1)
  s := ((p_up - p_down)::numeric / (p_up + p_down + 1)::numeric) * ln(p_total_votes + 1);
  -- normalize: score * 50 + 50, clamped 0-100
  return least(100, greatest(0, s * 50 + 50));
end;
$$;

create or replace function public.compute_bear_score(
  p_community numeric,
  p_valuation numeric,
  p_short_interest numeric,
  p_sentiment numeric
) returns numeric
language plpgsql
immutable
as $$
begin
  return least(100, greatest(0,
      coalesce(p_community,0)      * 0.40
    + coalesce(p_valuation,0)      * 0.25
    + coalesce(p_short_interest,0) * 0.15
    + coalesce(p_sentiment,0)      * 0.20
  ));
end;
$$;

create or replace function public.recalc_stock_bear_score(p_ticker text)
returns void
language plpgsql
as $$
declare
  v_up int;
  v_down int;
  v_total_votes int;
  v_total_th int;
  v_community numeric;
  v_valuation numeric;
  v_short numeric;
  v_sentiment numeric;
  v_trustpilot numeric;
  v_reddit numeric;
  v_disc numeric;
  v_si numeric;
  v_score numeric;
begin
  select
    coalesce(sum(upvotes), 0),
    coalesce(sum(downvotes), 0),
    count(*)
  into v_up, v_down, v_total_th
  from public.theses
  where ticker = p_ticker;

  v_total_votes := v_up + v_down;
  v_community := public.compute_community_score(v_up, v_down, v_total_votes);

  select valuation_discount_pct, short_interest_pct, trustpilot_score, reddit_sentiment
  into v_disc, v_si, v_trustpilot, v_reddit
  from public.stocks
  where ticker = p_ticker;

  v_valuation := least(100, greatest(0, coalesce(v_disc, 0)));
  v_short := least(100, greatest(0, coalesce(v_si, 0) * 4));

  if v_trustpilot is null and v_reddit is null then
    v_sentiment := 0;
  else
    v_sentiment :=
      ((5 - coalesce(v_trustpilot, 3)) / 4.0 * 100 * 0.5)
      + ((1 - coalesce(v_reddit, 0)) / 2.0 * 100 * 0.5);
    v_sentiment := least(100, greatest(0, v_sentiment));
  end if;

  v_score := public.compute_bear_score(v_community, v_valuation, v_short, v_sentiment);

  update public.stocks
     set bear_score                = v_score,
         bear_score_community      = v_community,
         bear_score_valuation      = v_valuation,
         bear_score_short_interest = v_short,
         bear_score_sentiment      = v_sentiment,
         total_theses              = v_total_th,
         total_votes               = v_total_votes,
         updated_at                = now()
   where ticker = p_ticker;
end;
$$;

create or replace function public.on_vote_change()
returns trigger
language plpgsql
as $$
declare
  v_thesis_id uuid;
  v_ticker text;
  v_up int;
  v_down int;
begin
  if (tg_op = 'DELETE') then
    v_thesis_id := old.thesis_id;
  else
    v_thesis_id := new.thesis_id;
  end if;

  select
    coalesce(sum(case when direction =  1 then 1 else 0 end), 0),
    coalesce(sum(case when direction = -1 then 1 else 0 end), 0)
  into v_up, v_down
  from public.votes
  where thesis_id = v_thesis_id;

  update public.theses
     set upvotes = v_up, downvotes = v_down
   where id = v_thesis_id
   returning ticker into v_ticker;

  if v_ticker is not null then
    perform public.recalc_stock_bear_score(v_ticker);
  end if;

  if (tg_op = 'DELETE') then return old; else return new; end if;
end;
$$;

create trigger trg_votes_change
after insert or update or delete on public.votes
for each row execute function public.on_vote_change();

create or replace function public.on_thesis_insert()
returns trigger
language plpgsql
as $$
begin
  insert into public.profiles(id, theses_submitted)
    values (new.author_id, 1)
    on conflict (id) do update set theses_submitted = public.profiles.theses_submitted + 1;
  perform public.recalc_stock_bear_score(new.ticker);
  return new;
end;
$$;

create trigger trg_thesis_insert
after insert on public.theses
for each row execute function public.on_thesis_insert();

create or replace function public.on_stock_signal_change()
returns trigger
language plpgsql
as $$
begin
  if new.valuation_discount_pct is distinct from old.valuation_discount_pct
     or new.short_interest_pct is distinct from old.short_interest_pct
     or new.trustpilot_score is distinct from old.trustpilot_score
     or new.reddit_sentiment is distinct from old.reddit_sentiment then
    perform public.recalc_stock_bear_score(new.ticker);
  end if;
  return null;
end;
$$;

create trigger trg_stock_signal_change
after update on public.stocks
for each row execute function public.on_stock_signal_change();

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

create trigger trg_auth_user_created
after insert on auth.users
for each row execute function public.on_auth_user_created();

-- ============ RLS ============
alter table public.stocks enable row level security;
alter table public.theses enable row level security;
alter table public.votes enable row level security;
alter table public.profiles enable row level security;
alter table public.affiliate_clicks enable row level security;
alter table public.bags_profiles enable row level security;
alter table public.bags_picks enable row level security;

create policy stocks_select on public.stocks for select using (true);
create policy profiles_select on public.profiles for select using (true);
create policy bags_profiles_select on public.bags_profiles for select using (true);
create policy bags_picks_select on public.bags_picks for select using (true);

create policy theses_select on public.theses for select using (true);
create policy theses_insert on public.theses
  for insert to authenticated
  with check (author_id = auth.uid());

create policy votes_select on public.votes for select using (true);
create policy votes_insert on public.votes
  for insert to authenticated with check (user_id = auth.uid());
create policy votes_update on public.votes
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy votes_delete on public.votes
  for delete to authenticated using (user_id = auth.uid());

create policy clicks_insert on public.affiliate_clicks
  for insert to anon, authenticated with check (true);
