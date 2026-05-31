"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function VoteButtons({
  thesisId,
  initialUp,
  initialDown,
}: {
  thesisId: string;
  initialUp: number;
  initialDown: number;
}) {
  const router = useRouter();
  const [up, setUp] = useState(initialUp);
  const [down, setDown] = useState(initialDown);
  const [busy, setBusy] = useState(false);

  async function vote(direction: 1 | -1) {
    const supabase = createClient();
    if (!supabase) {
      alert("Supabase not configured.");
      return;
    }
    setBusy(true);
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      router.push("/login");
      setBusy(false);
      return;
    }
    const { error } = await supabase
      .from("votes")
      .upsert(
        { user_id: userData.user.id, thesis_id: thesisId, direction },
        { onConflict: "user_id,thesis_id" }
      );
    if (!error) {
      if (direction === 1) setUp((n) => n + 1);
      else setDown((n) => n + 1);
      router.refresh();
    } else {
      alert(error.message);
    }
    setBusy(false);
  }

  return (
    <div style={{ display: "inline-flex", gap: 8 }}>
      <button
        onClick={() => vote(1)}
        disabled={busy}
        className="ov-btn ov-btn-dark"
        style={{ padding: "8px 12px" }}
      >
        ▲ {up}
      </button>
      <button
        onClick={() => vote(-1)}
        disabled={busy}
        className="ov-btn ov-btn-dark"
        style={{ padding: "8px 12px" }}
      >
        ▼ {down}
      </button>
    </div>
  );
}
