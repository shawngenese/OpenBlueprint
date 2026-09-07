import { Suspense } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { auth } from "@/lib/auth";
import { cn } from "cn";
import { buttonVariants } from "@/components/ui/button";

// Server streaming child — keeps Nav shell instant (nextjs streaming guideline)
async function NavAuthActions() {
  const session = await auth();
  if (session?.user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/dashboard"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "h-11 min-h-11 min-w-11 px-3 font-medium focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          )}
        >
          Dashboard
        </Link>
        <Link
          href="/project/new"
          className={cn(
            buttonVariants({ size: "lg" }),
            "h-11 min-h-11 rounded-full px-5 font-medium shadow-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          )}
        >
          Start blueprint <ArrowRight className="size-3.5" aria-hidden />
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
          "h-11 min-h-11 min-w-11 px-3 font-medium focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        )}
      >
        Sign in
      </Link>
      <Link
        href="/project/new"
        className={cn(
          buttonVariants({ size: "lg" }),
          "h-11 min-h-11 rounded-full px-5 font-medium shadow-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        )}
      >
        Start blueprint <ArrowRight className="size-3.5" aria-hidden />
      </Link>
    </div>
  );
}

function NavAuthFallback() {
  return (
    <div className="flex items-center gap-2" aria-hidden>
      <div className="h-11 w-[92px] animate-pulse rounded-full bg-muted" />
      <div className="h-11 w-[152px] animate-pulse rounded-full bg-muted" />
      <span className="sr-only">Loading account actions</span>
    </div>
  );
}

export function Nav() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-6">
        <Link
          href="/"
          aria-label="Project Consultant — Home"
          className="inline-flex items-center gap-2 rounded-md px-1 -ml-1 font-semibold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <span className="inline-flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="size-4" aria-hidden />
          </span>
          <span className="hidden sm:inline">Project Consultant</span>
          <span className="sm:hidden">PC</span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          <Link
            href="#how-it-works"
            className="rounded-full px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            How it works
          </Link>
          <Link
            href="#sections"
            className="rounded-full px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            20 sections
          </Link>
          <Link
            href="#export"
            className="rounded-full px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Export
          </Link>
        </nav>

        {/* ≥44×44px targets + 8px gap (gap-2) per spec — h-11 ensures 44px */}
        <Suspense fallback={<NavAuthFallback />}>
          <NavAuthActions />
        </Suspense>
      </div>
    </header>
  );
}
