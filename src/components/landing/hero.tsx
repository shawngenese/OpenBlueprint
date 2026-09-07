import { Suspense } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { auth } from "@/lib/auth";
import { cn } from "cn";
import { buttonVariants } from "@/components/ui/button";

// Server streaming child — keeps Hero static shell instant per AGENTS.md nextjs-app-router
async function HeroAuthActions() {
  const session = await auth();
  if (session?.user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/dashboard"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "h-11 min-h-11 min-w-11 px-3 font-medium focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          )}
        >
          Dashboard
        </Link>
        <Link
          href="/project/new"
          className={cn(buttonVariants({ size: "lg" }), "h-11 min-h-11 rounded-full px-5 font-medium shadow-sm")}
        >
          Start blueprint
        </Link>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2">
      <Link
        href="/login"
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "h-11 min-h-11 min-w-11 px-3 font-medium focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        )}
      >
        Sign in
      </Link>
      <Link
        href="/project/new"
        className={cn(buttonVariants({ size: "lg" }), "h-11 min-h-11 rounded-full px-5 font-medium shadow-sm")}
      >
        Start blueprint
      </Link>
    </div>
  );
}



// Hero: left 6-col editorial on 12-col grid — Inter 600 32pt -0.5 H1, 16px/1.5 <80ch, single teal accent
// Follows AGENTS.md: Monolith First, Code Style server component under /components
export function Hero() {
  return (
    <div className="col-span-12 lg:col-span-7 flex flex-col gap-6">
      <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
        <span className="size-1.5 rounded-full bg-primary animate-pulse" aria-hidden />
        Section records, not chat blobs — AGENTS.md rule 2
      </div>
      <h1 className="font-semibold tracking-tight text-[30px] leading-[1.1] sm:text-[36px] lg:text-[42px]">
        From rough idea to
        <br />
        <span className="text-primary">technical blueprint</span> — 20 sections, editable.
      </h1>
      <p className="max-w-[60ch] text-[15px] leading-7 text-muted-foreground">
        We ask at most 5 clarifying questions, then generate a Zod-validated 20-section blueprint you can edit,
        regenerate per-section, and export as PDF. Executive / Technical / Complete views filter locally — never re-call
        the LLM.
      </p>
      <div className="flex flex-wrap items-center gap-3 pt-1">
        <Suspense
          fallback={
            <span className="inline-flex h-11 min-h-11 items-center gap-2 rounded-full bg-muted px-5 text-sm">
              <Loader2 className="size-4 animate-spin" aria-hidden /> Loading
            </span>
          }
        >
          <HeroAuthActions />
        </Suspense>
        <Link
          href="#sections"
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "h-11 min-h-11 rounded-full px-6 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          )}
        >
          See 20 sections
        </Link>
      </div>
      <p className="text-xs leading-5 text-muted-foreground">
        Free — max 2 generations/day (<span className="font-medium text-foreground">GenerationLog</span>). No credit
        card. Views filter without LLM.
      </p>
    </div>
  );
}
