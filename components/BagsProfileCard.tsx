import * as React from "react";
import Link from "next/link";
import Avatar from "./Avatar";

export interface BagsProfileCardProps {
  slug: string;
  name: string;
  profileType: "vc" | "podcaster" | "politician";
  bagsScore: number;
  trackRecordSummary?: string | null;
  avatarUrl?: string | null;
}

const TYPE_LABEL: Record<string, string> = {
  vc: "VC",
  podcaster: "PODCASTER",
  politician: "POLITICIAN",
};

export default function BagsProfileCard(props: BagsProfileCardProps) {
  return (
    <Link href={`/bags/${props.slug}`} className="ov-fade-in" style={{ display: "block" }}>
      <div className="ov-card" style={{ padding: 18, height: "100%" }}>
        <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
          <Avatar name={props.name} src={props.avatarUrl ?? undefined} size={56} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="font-display" style={{ fontSize: 22, color: "#fff", letterSpacing: "-0.005em", lineHeight: 1.05 }}>
              {props.name.toUpperCase()}
            </div>
            <div style={{ marginTop: 6, display: "flex", gap: 8, alignItems: "center" }}>
              <span className="ov-tag cat-bags">{TYPE_LABEL[props.profileType] ?? props.profileType.toUpperCase()}</span>
            </div>
          </div>
          <div
            style={{
              display: "inline-flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "6px 10px",
              border: "1px solid var(--ov-cat-bags)",
              color: "var(--ov-cat-bags)",
            }}
          >
            <span className="font-mono" style={{ fontSize: 8, letterSpacing: "0.22em" }}>BAGS</span>
            <span className="font-display" style={{ fontSize: 22, letterSpacing: "-0.02em" }}>{Math.round(props.bagsScore)}</span>
          </div>
        </div>

        {props.trackRecordSummary && (
          <div
            className="font-mono"
            style={{ marginTop: 14, fontSize: 11, color: "var(--ov-fg-dim)", lineHeight: 1.6, letterSpacing: "0.02em" }}
          >
            {props.trackRecordSummary}
          </div>
        )}
      </div>
    </Link>
  );
}
