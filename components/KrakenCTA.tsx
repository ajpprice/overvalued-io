"use client";

import { krakenLink, krakenButtonText, hasXStock } from "@/lib/kraken";

export default function KrakenCTA({ ticker }: { ticker: string }) {
  const url = krakenLink(ticker);
  const text = krakenButtonText(ticker);

  function onClick(e: React.MouseEvent) {
    e.preventDefault();
    // fire-and-forget log
    try {
      fetch("/api/affiliate-click", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ticker }),
        keepalive: true,
      });
    } catch {}
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <a
      href={url}
      onClick={onClick}
      className="inline-block bg-bear text-bg font-bold uppercase tracking-wider px-6 py-4 rounded-none hover:bg-red-500 transition-colors"
    >
      {text}
      {!hasXStock(ticker) && (
        <div className="text-[10px] font-normal normal-case mt-1 opacity-80">
          No xStocks listing for {ticker} — generic referral
        </div>
      )}
    </a>
  );
}
