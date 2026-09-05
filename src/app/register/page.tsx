import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { RegisterForm } from "@/components/auth/register-form";
import { Sparkles, ArrowLeft } from "lucide-react";

export const metadata = { title: "Create account — AI Project Consultant" };

export default async function RegisterPage() {
  const session = await auth();
  if (session?.user) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-zinc-50/50 dark:bg-black flex flex-col">
      <header className="mx-auto w-full max-w-6xl p-6 flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-2 font-heading font-semibold tracking-tight">
          <Sparkles className="size-5" /> Project Consultant
        </Link>
        <Link href="/login" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Sign in
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center p-6">
        <RegisterForm />
      </main>
    </div>
  );
}
