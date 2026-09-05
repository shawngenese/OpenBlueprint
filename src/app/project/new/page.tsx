import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { NewIdeaForm } from "@/components/project/new-idea-form";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "New Project — AI Project Consultant",
};

export default async function NewProjectPage() {
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/login?callbackUrl=/project/new");
  }

  return (
    <div className="min-h-screen bg-zinc-50/50 dark:bg-black">
      <main className="mx-auto max-w-2xl p-6 sm:p-8 lg:p-10 space-y-8">
        <div className="flex flex-col gap-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
          >
            <ArrowLeft className="size-4" /> Back to dashboard
          </Link>
          <div className="space-y-2">
            <h1 className="font-heading text-3xl sm:text-4xl font-semibold tracking-tight">Start a new project</h1>
            <p className="text-sm text-muted-foreground leading-6">
              Rough is fine. We&apos;ll structure it into 20 sections — from overview to risks — and keep each section editable with per-section regeneration.
            </p>
          </div>
        </div>

        <NewIdeaForm />

        <p className="text-center text-xs text-muted-foreground">
          Your idea is stored as a <span className="font-medium text-foreground">Project</span> with a <span className="font-medium text-foreground">Blueprint → 20 Sections</span> (AGENTS.md: Data Structure). Views filter locally, never re-call the LLM.
        </p>
      </main>
    </div>
  );
}
