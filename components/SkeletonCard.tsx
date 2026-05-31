import * as React from "react";

export default function SkeletonCard() {
  return (
    <div className="ov-card animate-pulse" style={{ padding: 18 }}>
      <div style={{ height: 22, background: "var(--ov-hairline-2)", marginBottom: 12, width: "60%" }} />
      <div style={{ height: 12, background: "var(--ov-hairline)", marginBottom: 8, width: "90%" }} />
      <div style={{ height: 12, background: "var(--ov-hairline)", marginBottom: 16, width: "80%" }} />
      <div style={{ height: 36, background: "var(--ov-hairline-2)" }} />
    </div>
  );
}
