import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const ALLOWED_BROKERS = new Set(["kraken", "ig", "saxo", "etoro"]);

export async function POST(req: NextRequest) {
  let ticker: string | null = null;
  let broker: string | null = null;
  try {
    const body = await req.json();
    ticker = typeof body?.ticker === "string" ? body.ticker.toUpperCase() : null;
    broker = typeof body?.broker === "string" ? body.broker.toLowerCase() : null;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  if (!ticker || !broker || !ALLOWED_BROKERS.has(broker)) {
    return NextResponse.json({ ok: false, error: "ticker and broker required" }, { status: 400 });
  }

  const supabase = createClient();
  if (!supabase) {
    return NextResponse.json({ ok: true, logged: false });
  }
  const { data: u } = await supabase.auth.getUser();
  await supabase.from("affiliate_clicks").insert({
    user_id: u.user?.id ?? null,
    ticker,
    broker,
  });
  return NextResponse.json({ ok: true, logged: true });
}
