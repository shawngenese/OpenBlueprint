import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { LoginForm } from "@/components/auth/login-form";
import { OAuthButtons } from "@/components/auth/oauth-buttons";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, ArrowLeft } from "lucide-react";

export const metadata = { title: "Sign in — AI Project Consultant" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ callbackUrl?: string }> }) {
  const { callbackUrl } = await searchParams;
  const session = await auth();
  if (session?.user) redirect(callbackUrl || "/dashboard");

  const cb = callbackUrl || "/dashboard";

  return (
    <div className="min-h-screen bg-zinc-50/50 dark:bg-black flex flex-col">
      <header className="mx-auto w-full max-w-6xl p-6 flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-2 font-heading font-semibold tracking-tight">
          <Sparkles className="size-5" /> Project Consultant
        </Link>
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Home
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="flex w-full max-w-4xl gap-8 items-center justify-center flex-col lg:flex-row">
          <div className="hidden lg:flex flex-col gap-4 max-w-md">
            <div className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-muted-foreground">
              <Sparkles className="size-3.5" /> Secure workspace
            </div>
            <h1 className="font-heading text-3xl font-semibold tracking-tight leading-tight">
              Turn rough ideas into structured blueprints.
            </h1>
            <p className="text-sm leading-6 text-muted-foreground">
              Sign in to create projects, generate 20-section specs with gpt-4o-mini, and export polished PDFs. Your workspace is protected by Auth.js.
            </p>
            <Card className="bg-white border-dashed">
              <CardContent className="p-4 text-xs leading-5 text-muted-foreground">
                <span className="font-medium text-foreground">Protected routes:</span> /dashboard and /project/* require authentication. Middleware redirects unauthenticated users to /login.
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col gap-4 w-full max-w-sm">
            <LoginForm />
            <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
              <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
            </div>
            <OAuthButtons callbackUrl={cb} />
            <p className="text-center text-xs text-muted-foreground">
              By signing in you agree to our terms. OAuth requires GOOGLE_CLIENT_ID / GITHUB_ID env vars.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
