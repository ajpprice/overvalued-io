"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoFull } from "@/components/design/LogoFull";

type NavKey = "STOCKS" | "BAGS" | "THESES" | "WATCHLIST" | "LEADERBOARD";

const HREF: Record<NavKey, string> = {
  STOCKS: "/",
  BAGS: "/bags",
  THESES: "/submit",
  WATCHLIST: "/",
  LEADERBOARD: "/leaderboard",
};

export default function Header() {
  const pathname = usePathname() ?? "/";
  let active: NavKey = "STOCKS";
  if (pathname.startsWith("/bags")) active = "BAGS";
  else if (pathname.startsWith("/leaderboard")) active = "LEADERBOARD";
  else if (pathname.startsWith("/submit")) active = "THESES";

  const links: NavKey[] = ["STOCKS", "BAGS", "THESES", "WATCHLIST", "LEADERBOARD"];

  return (
    <div className="ov-nav">
      <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
        <Link href="/" style={{ display: "inline-block" }}>
          <LogoFull scale={0.9} />
        </Link>
        <div style={{ display: "flex", gap: 28 }}>
          {links.map((l) => (
            <Link
              key={l}
              href={HREF[l]}
              className={`ov-nav-link ${active === l ? "active" : ""}`}
            >
              {l}
            </Link>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <Link href="/login">
          <button className="ov-btn ov-btn-primary">SIGN IN</button>
        </Link>
      </div>
    </div>
  );
}
