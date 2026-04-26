import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function Header() {
  const supabase = createClient();
  let email: string | null = null;
  if (supabase) {
    const { data } = await supabase.auth.getUser();
    email = data.user?.email ?? null;
  }
  return (
    <header className="border-b border-border px-6 py-4">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Link href="/" className="headline text-xl font-bold tracking-tight">
          overvalued<span className="text-bear">.io</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/submit" className="hover:text-bear transition-colors">Submit Thesis</Link>
          {email ? (
            <span className="text-muted ticker text-xs">{email}</span>
          ) : (
            <Link href="/login" className="hover:text-bear transition-colors">Sign in</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
