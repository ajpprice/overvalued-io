import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SubmitForm from "./SubmitForm";

export const dynamic = "force-dynamic";

export default async function SubmitPage() {
  const supabase = createClient();
  if (!supabase) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="headline text-3xl font-bold mb-4">Submit a Thesis</h1>
        <p className="text-muted">Supabase is not configured. Add env vars to enable submissions.</p>
      </div>
    );
  }
  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    redirect("/login?next=/submit");
  }

  const { data: stocks } = await supabase.from("stocks").select("ticker,name").order("ticker");

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="headline text-4xl font-bold mb-2">Submit a Bear Thesis</h1>
      <p className="text-muted text-sm mb-8">Make your case. Markdown is supported in the body.</p>
      <SubmitForm stocks={(stocks ?? []) as { ticker: string; name: string }[]} />
    </div>
  );
}
