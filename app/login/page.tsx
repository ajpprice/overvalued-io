import LoginForm from "./LoginForm";
import { isSupabaseConfigured } from "@/lib/env";

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto px-6 py-20">
      <h1 className="headline text-4xl font-bold mb-2">Sign in</h1>
      <p className="text-muted text-sm mb-8">Enter your email and we'll send a magic link.</p>
      {isSupabaseConfigured() ? (
        <LoginForm />
      ) : (
        <div className="border border-border bg-panel p-5 text-sm text-muted">
          Supabase is not configured. Add env vars to enable sign-in.
        </div>
      )}
    </div>
  );
}
