import { Database, Shield, FileDown, Braces, Sparkles } from "lucide-react";

const STACK = [
  { label: "Next.js 15", sub: "App Router", icon: Sparkles },
  { label: "Prisma + pg", sub: "PostgreSQL", icon: Database },
  { label: "Auth.js", sub: "Google · GitHub · Creds", icon: Shield },
  { label: "gpt-4o-mini", sub: "via Vercel ai SDK", icon: Sparkles },
  { label: "Zod", sub: "Shared validation", icon: Braces },
  { label: "@react-pdf", sub: "PDF renderer", icon: FileDown },
  { label: "shadcn/ui", sub: "Tailwind · Inter", icon: Database },
] as const;

export function StackStrip() {
  return (
    <section id="stack" aria-labelledby="stack-heading" className="border-t border-border">
      <div className="py-8">
        <h2 id="stack-heading" className="sr-only">
          Tech stack
        </h2>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-muted-foreground font-medium tracking-widest uppercase">Stack</span>
          <span className="h-3 w-px bg-border" aria-hidden />
          {STACK.map((s) => (
            <span
              key={s.label}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium hover:border-primary/30 transition-colors duration-150"
            >
              <s.icon className="size-3.5 text-muted-foreground" aria-hidden />
              <span className="text-foreground">{s.label}</span>
              <span className="text-muted-foreground hidden sm:inline">· {s.sub}</span>
            </span>
          ))}
          <span className="ml-auto text-xs text-muted-foreground">Monolith First — no microservices</span>
        </div>
      </div>
    </section>
  );
}
