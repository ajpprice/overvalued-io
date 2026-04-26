# overvalued.io

Community stock review and short execution platform. Bearish theses on the most overvalued public companies. Vote, debate, short.

## Stack
- Next.js 14 (App Router) + TypeScript
- Supabase (auth, postgres, RLS, triggers) via `@supabase/ssr`
- Tailwind CSS
- Finnhub for live quotes
- Vercel deployment target

## Setup

```bash
git clone <repo> overvalued-io
cd overvalued-io
npm install
cp .env.local.example .env.local   # fill in real values
supabase db reset                  # applies migrations + seed
npm run dev
```

The app boots even without env vars — pages render with placeholders and warn via a banner. Configure as you go:

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add FINNHUB_API_KEY
vercel env add KRAKEN_AFFILIATE_ID
```

## Pages
- `/` — Most Overvalued leaderboard, ranked by Bear Score
- `/stock/[ticker]` — stock page with live quote, theses, "Short It on Kraken" CTA
- `/submit` — post a bear thesis (auth required)
- `/login` — magic-link sign in
- `/auth/callback` — Supabase OAuth/OTP redirect handler

## Bear Score
`(upvotes - downvotes) / (upvotes + downvotes + 1) * ln(total_votes + 1)` — computed in plpgsql trigger on every vote, then normalized to a 0-100 stock-level score averaged across all theses.

## Monetization
"Short It on Kraken" CTA on every stock page, deep-linked to xStocks (e.g. `TSLAx`) with the affiliate referral. Click logs to `affiliate_clicks` (fire-and-forget).

## Disclaimer
Overvalued.io is a community opinion platform. Nothing here is financial advice. Not FCA authorised.
