import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { auth } from "@/lib/auth";
import { cn } from "cn";
import { buttonVariants } from "@/components/ui/button";

async function FinalCTAButtons() {
  const session = await auth();
  if (session?.user) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <Link
          href="/dashboard"
          className={cn(
            buttonVariants({ variant: "secondary", size: "lg" }),
            "h-11 min-h-11 rounded-full px-6 bg-background text-foreground hover:bg-background/90 focus-visible:ring-2 focus-visible:ring-ring"
          )}
        >
          Go to dashboard
        </Link>
        <Link
          href="/project/new"
          className={cn(
            buttonVariants({ size: "lg" }),
            "h-11 min-h-11 rounded-full px-6 shadow-sm focus-visible:ring-2 focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90"
          )}
        >
          New project <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
    );
  }
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Link
        href="/login"
        className={cn(
          buttonVariants({ variant: "secondary", size: "lg" }),
          "h-11 min-h-11 rounded-full px-6 bg-background text-foreground hover:bg-background/90 focus-visible:ring-2 focus-visible:ring-ring"
        )}
      >
        Sign in
      </Link>
      <Link
        href="/register"
        className={cn(
          buttonVariants({ size: "lg" }),
          "h-11 min-h-11 rounded-full px-6 shadow-sm focus-visible:ring-2 focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90"
        )}
      >
        Start blueprint <ArrowRight className="size-4" aria-hidden />
      </Link>
    </div>
  );
}

function FinalCTAButtonsFallback() {
  return (
    <div className="flex items-center gap-2">
      <div className="h-11 w-[110px] animate-pulse rounded-full bg-white/20" aria-hidden />
      <div className="h-11 w-[150px] animate-pulse rounded-full bg-white/20" aria-hidden />
      <span className="sr-only">Loading actions</span>
    </div>
  );
}

// CTA band — Video center + CTA right/bottom pattern (landing.csv)
// Auth-aware per lib/auth.ts, 10-char hint from createProjectSchema (lib/validators.ts:20)
export function FinalCTA() {
  return (
    <section id="cta" aria-labelledby="cta-heading" className="border-t border-border">
      <div className="py-10 sm:py-12">
        <div className="rounded-2xl bg-foreground text-background p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-[60ch]">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80">
                <Sparkles className="size-3.5" aria-hidden /> Start with 10 characters
              </div>
              <h2 id="cta-heading" className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight text-white">
                Ready to turn a rough idea into a blueprint?
              </h2>
              <p className="mt-2 text-sm leading-6 text-white/70">
                <span className="font-mono text-xs text-white">createProjectSchema</span> —{" "}
                <span className="font-medium text-white">rawIdea min 10</span> · max 5000ch. Title 2–100ch. From there:
                ≤5 clarifier questions, then 20 validated sections you can edit and export.
              </p>
            </div>
            <Suspense fallback={<FinalCTAButtonsFallback />}>
              <FinalCTAButtons />
            </Suspense>
          </div>
          <p className="mt-6 text-center lg:text-right text-xs leading-5 text-white/60">
            No LLM re-call when switching Executive / Technical / Complete — local filter only.
          </p>
        </div>
      </div>
    </section>
  );
}
