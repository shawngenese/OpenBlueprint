'use client';

import { useState, useEffect, useRef } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Pencil, Save, Check, Loader2, Sparkles, RefreshCw } from "lucide-react";
import { cn } from "cn";

type Section = {
  id: string;
  key: string;
  title: string;
  content: string;
  order: number;
};

export function SectionItem({ section, defaultOpen = true }: { section: Section; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(section.content);
  const [status, setStatus] = useState<"idle" | "typing" | "saving" | "saved" | "error">("idle");
  const [isRegenerating, setIsRegenerating] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Keep local value in sync if prop changes externally (e.g., regenerate)
  useEffect(() => {
    setValue(section.content);
  }, [section.content]);

  // 1-second debounce auto-save while editing
  useEffect(() => {
    if (!editing) return;
    if (value === section.content) {
      setStatus("idle");
      return;
    }

    setStatus("typing");

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      setStatus("saving");
      try {
        const res = await fetch(`/api/sections/${section.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: value }),
        });
        if (!res.ok) throw new Error("Save failed");
        setStatus("saved");
        setTimeout(() => setStatus("idle"), 1500);
      } catch {
        setStatus("error");
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [value, editing, section.id, section.content]);

  const toggleEdit = () => {
    if (editing && value !== section.content) {
      // flush pending save immediately on exit
      if (timerRef.current) clearTimeout(timerRef.current);
      setStatus("saving");
      fetch(`/api/sections/${section.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: value }),
      })
        .then((r) => {
          if (!r.ok) throw new Error();
          setStatus("saved");
          setTimeout(() => setStatus("idle"), 1500);
        })
        .catch(() => setStatus("error"));
    }
    setEditing((e) => !e);
  };

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    setStatus("saving");
    try {
      const res = await fetch(`/api/sections/${section.id}/regenerate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (!res.ok) throw new Error("Regenerate failed");
      const data = await res.json();
      setValue(data.content);
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 1500);
      if (!open) setOpen(true);
    } catch {
      setStatus("error");
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <Card className="overflow-hidden border-zinc-200 dark:border-zinc-800">
      <CardHeader
        className="p-4 sm:p-5 flex flex-row items-center justify-between gap-3 cursor-pointer select-none bg-zinc-50/50 dark:bg-zinc-900/30 hover:bg-zinc-50 transition-colors"
        onClick={() => setOpen((o) => !o)}
      >
        <div className="flex items-center gap-2 min-w-0">
          <Badge variant="outline" className="rounded-full font-mono text-xs shrink-0">
            {section.key}
          </Badge>
          <span className="font-medium text-sm truncate">{section.title}</span>
          <span className="hidden sm:inline-flex items-center gap-1 text-xs text-muted-foreground">
            #{section.order + 1}
          </span>
        </div>
        <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
          <span className="hidden sm:inline-flex items-center gap-1 text-xs text-muted-foreground mr-2">
            {status === "typing" && "Typing…"}
            {status === "saving" && (
              <>
                <Loader2 className="size-3 animate-spin" /> Saving…
              </>
            )}
            {status === "saved" && (
              <>
                <Check className="size-3 text-emerald-600" /> Saved
              </>
            )}
            {status === "error" && <span className="text-destructive">Error</span>}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRegenerate}
            disabled={isRegenerating || editing}
            className="rounded-full gap-1 h-7"
            aria-label="Regenerate section"
            title="Regenerate this section with AI (updates only this key)"
          >
            {isRegenerating ? <Loader2 className="size-3.5 animate-spin" /> : <RefreshCw className="size-3.5" />}
            <span className="hidden sm:inline">Regen</span>
          </Button>
          <Button
            variant={editing ? "default" : "ghost"}
            size="sm"
            onClick={toggleEdit}
            className="rounded-full gap-1.5 h-7"
            aria-label={editing ? "Done editing" : "Edit section"}
          >
            {editing ? <Save className="size-3.5" /> : <Pencil className="size-3.5" />}
            {editing ? "Done" : "Edit"}
          </Button>
          <Button variant="ghost" size="icon-sm" className="rounded-full" aria-label="Toggle section" onClick={() => setOpen((o) => !o)}>
            <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} />
          </Button>
        </div>
      </CardHeader>

      {open && (
        <CardContent className="p-4 sm:p-6 pt-0">
          {editing ? (
            <div className="flex flex-col gap-2">
              <Textarea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                rows={10}
                className="min-h-[180px] font-mono text-sm leading-6"
                placeholder="Write markdown…"
                autoFocus
              />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Sparkles className="size-3" /> Markdown supported • Auto-saves 1s after typing
                </span>
                <span className={cn(status === "saving" && "text-foreground")}>
                  {value.length} chars
                </span>
              </div>
            </div>
          ) : (
            <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap leading-6 text-[13px] prose-p:my-2 prose-headings:font-semibold">
              {value}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
