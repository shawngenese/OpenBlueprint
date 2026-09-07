import Link from "next/link";
import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-semibold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
            >
              <span className="inline-flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Sparkles className="size-4" aria-hidden />
              </span>
              Project Consultant
            </Link>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              Monolith First — Next.js 15 + Prisma + Auth.js + <span className="font-mono">gpt-4o-mini</span> + Zod +
              @react-pdf/renderer. Blueprints as Section records, not blobs.
            </p>
            <p className="mt-3 text-xs text-muted-foreground">© {new Date().getFullYear()} Project Consultant</p>
          </div>

          <nav aria-label="Footer" className="flex gap-8 text-xs">
            <div className="flex flex-col gap-2">
              <span className="font-medium tracking-widest uppercase text-muted-foreground">Product</span>
              <Link
                href="/project/new"
                className="text-muted-foreground hover:text-foreground transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
              >
                New project
              </Link>
              <Link
                href="/dashboard"
                className="text-muted-foreground hover:text-foreground transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
              >
                Dashboard
              </Link>
              <Link
                href="#sections"
                className="text-muted-foreground hover:text-foreground transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
              >
                20 sections
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-medium tracking-widest uppercase text-muted-foreground">Account</span>
              <Link
                href="/login"
                className="text-muted-foreground hover:text-foreground transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="text-muted-foreground hover:text-foreground transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
              >
                Create account
              </Link>
              <Link
                href="#how-it-works"
                className="text-muted-foreground hover:text-foreground transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
              >
                How it works
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </footer>
  );
}
