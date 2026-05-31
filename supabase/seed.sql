-- overvalued.io seed
-- Note: theses require an author_id from auth.users. We mint a synthetic seed user
-- so the seed runs in a fresh local Supabase. Safe to re-run via on conflict guards.

insert into auth.users (id, email, instance_id, aud, role, encrypted_password,
                       email_confirmed_at, created_at, updated_at)
values ('00000000-0000-0000-0000-000000000001',
        'seed@overvalued.io',
        '00000000-0000-0000-0000-000000000000',
        'authenticated', 'authenticated', '',
        now(), now(), now())
on conflict (id) do nothing;

insert into public.profiles(id, reputation, theses_submitted)
values ('00000000-0000-0000-0000-000000000001', 420, 0)
on conflict (id) do nothing;

-- ============ stocks ============
insert into public.stocks(ticker, name, exchange, category, current_price, valuation_discount_pct, short_interest_pct, trustpilot_score, reddit_sentiment) values
  ('TSLA', 'Tesla, Inc.',                 'NASDAQ', 'valuation',        180.00,  45,  18,  2.1,  -0.4),
  ('META', 'Meta Platforms, Inc.',        'NASDAQ', 'valuation',        540.00,  20,   2,  1.9,  -0.2),
  ('COIN', 'Coinbase Global, Inc.',       'NASDAQ', 'structural_decay', 220.00,  35,  12,  2.4,  -0.1),
  ('GME',  'GameStop Corp.',              'NYSE',   'never_profitable',  18.00,  60,  21,  2.8,   0.1),
  ('MSTR', 'MicroStrategy Incorporated',  'NASDAQ', 'valuation',       1500.00,  50,  15,  3.0,   0.0),
  ('BOO',  'Boohoo Group plc',            'LSE',    'brand_decay',        0.30,  30,   8,  1.6,  -0.5),
  ('PTON', 'Peloton Interactive, Inc.',   'NASDAQ', 'brand_decay',        4.50,  25,  19,  2.0,  -0.3)
on conflict (ticker) do nothing;

-- ============ bags_profiles ============
insert into public.bags_profiles(slug, name, profile_type, description, bags_score, track_record_summary) values
  ('chamath-palihapitiya', 'Chamath Palihapitiya', 'vc',         'SPAC king turned SPAC graveyard caretaker.',           92, 'Pumped 4 SPACs to retail. Combined drawdown 78%.'),
  ('jim-cramer',           'Jim Cramer',           'podcaster',  'CNBC Mad Money host. Inverse-Cramer ETF exists for a reason.', 88, 'Top-ticked META at $370 before 75% drawdown.'),
  ('cathie-wood',          'Cathie Wood',          'vc',         'ARK Invest. Innovation, deep convictions, deeper drawdowns.',  85, 'ARKK -75% from 2021 peak. Still buying.'),
  ('elizabeth-warren',     'Elizabeth Warren',     'politician', 'US Senator. Reliably wrong on banks.',                          70, 'Crusaded against SVB regulation rollback then bailed it out.')
on conflict (slug) do nothing;

-- ============ bags_picks ============
insert into public.bags_picks(bags_profile_id, ticker_or_name, pick_date, pick_price, current_price, return_pct, notes)
select id, 'TSLA',  '2023-01-15', 120.00, 180.00,  50.0,  'Endorsed on All-In.'              from public.bags_profiles where slug='chamath-palihapitiya'
union all
select id, 'COIN',  '2024-03-10', 260.00, 220.00, -15.4,  'SPAC-adjacent crypto exposure.'   from public.bags_profiles where slug='chamath-palihapitiya'
union all
select id, 'META',  '2022-11-04', 90.00,  540.00, 500.0,  'Sold the bottom on-air.'          from public.bags_profiles where slug='jim-cramer'
union all
select id, 'MSTR',  '2024-11-22', 400.00, 1500.0, 275.0,  'Mad Money buy-buy-buy.'           from public.bags_profiles where slug='jim-cramer'
union all
select id, 'PTON',  '2021-01-08', 160.00, 4.50,  -97.2,  'ARKK top-5 holding 2021.'         from public.bags_profiles where slug='cathie-wood'
union all
select id, 'TSLA',  '2020-12-22', 220.00, 180.00, -18.2,  'Long-term ARK conviction.'        from public.bags_profiles where slug='cathie-wood'
union all
select id, 'BOO',   '2020-06-15', 4.00,   0.30,  -92.5,   'Praised in floor speech.'         from public.bags_profiles where slug='elizabeth-warren';

-- ============ theses ============
insert into public.theses(ticker, title, body, key_risks, target_price, time_horizon, author_id) values

-- TSLA
('TSLA', 'Auto margins are collapsing while the cult holds the multiple',
 E'Tesla trades like a software company while operating like a discount automaker. Gross margins have compressed for six straight quarters, China demand is rolling over, and the long-promised robotaxi keeps slipping a year every year. Strip out regulatory credits and the auto business is barely profitable.\n\nThe stock is priced for a future that requires Tesla to dominate AI, robotics, energy, and self-driving simultaneously. Pick one.',
 ARRAY['Robotaxi launch surprise','Energy storage growth','Musk pump tweet'],
 140, '6-12 months', '00000000-0000-0000-0000-000000000001'),

('TSLA', 'BYD is eating their lunch in every market that matters',
 E'BYD is shipping cheaper, better-equipped vehicles globally and Tesla''s response is a "refreshed" Model Y. The Cybertruck is a recall machine. The $25k car is vapor. Tesla''s moat was first-mover EV — that moat closed two years ago.',
 ARRAY['Tariffs on Chinese EVs','FSD breakthrough'],
 160, '12 months', '00000000-0000-0000-0000-000000000001'),

('TSLA', 'Compensation overhang and Texas reincorporation = governance circus',
 E'The $56B pay package saga signals one thing to institutional investors: Musk runs this company for Musk. With xAI siphoning attention and capital, Tesla shareholders are funding a side project they don''t own.',
 ARRAY['Pay package settled','Musk refocus'],
 180, '3-6 months', '00000000-0000-0000-0000-000000000001'),

-- META
('META', 'Reality Labs is a $20B/year hole nobody wants to talk about',
 E'Meta has burned over $50B on Reality Labs with no consumer adoption. The Quest line is treading water and the Ray-Ban story is a rounding error. When ad growth normalizes, this loss line becomes very visible to the market.',
 ARRAY['Llama monetization','Ad cycle re-acceleration'],
 380, '12 months', '00000000-0000-0000-0000-000000000001'),

('META', 'TikTok ban tailwind is already in the price',
 E'Every analyst model assumes Reels captures the entire TikTok US user base at TikTok-level engagement. That''s not how substitution works. If the ban gets delayed or reversed, this thesis unwinds violently.',
 ARRAY['Permanent TikTok ban','Reels monetization parity'],
 420, '6 months', '00000000-0000-0000-0000-000000000001'),

('META', 'Capex is exploding faster than ad revenue',
 E'$40B+ in capex for "AI infrastructure" with no clear ROI mechanism. Zuck has a track record of expensive pivots (metaverse, anyone?). Free cash flow yield is going to disappoint.',
 ARRAY['AI ad targeting wins','GPU price drops'],
 450, '12-18 months', '00000000-0000-0000-0000-000000000001'),

-- COIN
('COIN', 'It''s a leveraged bet on BTC with a regulator on its back',
 E'Coinbase makes money two ways: trading fees during mania and interest on USDC reserves. Both are cyclical. Strip out the bull-market quarters and operating margins are negative. The SEC is not going away.',
 ARRAY['Crypto-friendly admin','Spot ETH ETF flows'],
 140, '6-12 months', '00000000-0000-0000-0000-000000000001'),

('COIN', 'Fee compression is inevitable as Robinhood and others undercut',
 E'Retail trading fees of 1%+ are absurd in 2026. Robinhood charges effectively zero. The only reason Coinbase still gets it is brand inertia among newer crypto buyers. That breaks the moment HOOD''s crypto UX matches.',
 ARRAY['Stablecoin regulation moat','Institutional custody growth'],
 160, '12 months', '00000000-0000-0000-0000-000000000001'),

('COIN', 'USDC interest income is a rate-cut casualty',
 E'A huge chunk of Coinbase''s "diversified" revenue is just interest on USDC reserves. Every 25bps cut hits the bottom line directly. The market hasn''t modeled the rate path into 2026 properly.',
 ARRAY['Higher-for-longer rates','USDC supply growth'],
 150, '6 months', '00000000-0000-0000-0000-000000000001'),

-- GME
('GME', 'Cash pile aside, the actual business is still dying',
 E'Same-store sales down again. They closed hundreds of stores. Ryan Cohen has done nothing with the cash except buy more cash (and a little BTC). At some point a melting ice cube with treasuries on top is just treasuries — at a 5x premium.',
 ARRAY['Cohen acquisition catalyst','Meme squeeze 3.0'],
 12, '12 months', '00000000-0000-0000-0000-000000000001'),

('GME', 'Every ATM offering dilutes the apes who refuse to sell',
 E'They keep printing shares into strength. Float has expanded materially since 2021. The "infinity squeeze" math gets worse with every issuance, and management knows it.',
 ARRAY['Buyback announcement','Short interest spike'],
 10, '6 months', '00000000-0000-0000-0000-000000000001'),

('GME', 'Retail attention has moved on — to crypto, to AI, to anything else',
 E'The DRS counts have plateaued. WSB volume on $GME threads is a fraction of 2021. Without retail mania, this is a no-growth retailer trading at 5x book.',
 ARRAY['New meme cycle','Influencer pump'],
 11, '6-12 months', '00000000-0000-0000-0000-000000000001'),

-- MSTR
('MSTR', 'It''s a closed-end BTC fund trading at a 2x premium to NAV',
 E'Investors can buy spot BTC ETFs at 0.20% expense ratios. MicroStrategy charges them a 100%+ premium for the privilege of leveraged BTC exposure. That premium has historically mean-reverted hard. It will again.',
 ARRAY['BTC ATH','Premium expansion via index inclusion'],
 900, '6-12 months', '00000000-0000-0000-0000-000000000001'),

('MSTR', 'The convertible debt stack is a margin call waiting to happen',
 E'Saylor keeps issuing convertibles to buy more BTC. In a 50% drawdown — historically routine for BTC — the debt becomes the story. Forced selling at the bottom is the textbook leveraged-fund death spiral.',
 ARRAY['BTC stays above $80k','Refi window stays open'],
 700, '12 months', '00000000-0000-0000-0000-000000000001'),

('MSTR', 'The legacy software business is a rounding error and slowly bleeding',
 E'Nobody talks about it because BTC is the whole pitch, but the actual operating business is shrinking. When the BTC narrative cools off, you''re left with a declining BI vendor priced at meme valuations.',
 ARRAY['AI BI pivot succeeds','Software spin-off'],
 1100, '12-18 months', '00000000-0000-0000-0000-000000000001');
