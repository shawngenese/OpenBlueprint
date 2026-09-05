'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="min-h-screen bg-zinc-50/50 dark:bg-black">
      <main className="mx-auto max-w-3xl p-6 sm:p-8 lg:p-10">
        <Card className="border-destructive/30">
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <AlertTriangle className="size-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold">Failed to load project</h3>
              <p className="text-sm text-muted-foreground">{error.message || "Unexpected error."}</p>
            </div>
            <Button onClick={reset} variant="outline" className="rounded-full">
              Try again
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
