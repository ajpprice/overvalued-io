import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  let ticker: string | null = null;
  try {
    const body = await req.json();
    ticker = typeof body?.ticker === "string" ? body.ticker.toUpperCase() : null;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  if (!ticker) return NextResponse.json({ ok: false }, { status: 400 });

  const supabase = createClient();
  if (!supabase) {
    // No-op when Supabase isn't configured — still return success so the CTA proceeds.
    return NextResponse.json({ ok: true, logged: false });
  }
  const { data: u } = await supabase.auth.getUser();
  await supabase.from("affiliate_clicks").insert({
    user_id: u.user?.id ?? null,
    ticker,
  });
  return NextResponse.json({ ok: true, logged: true });
}
