'use client';

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { registerUser } from "@/lib/actions/register";
import { Loader2 } from "lucide-react";

export function RegisterForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = (await registerUser(fd)) as unknown as { error?: unknown; success?: boolean };
      if (res?.error) {
        if (typeof res.error === "string") setError(res.error as string);
        else setFieldErrors(res.error as Record<string, string[]>);
      } else if (res?.success) {
        router.push("/login?registered=1");
      }
    });
  };

  return (
    <Card className="w-full max-w-sm shadow-lg">
      <CardHeader className="p-6 pb-4 space-y-1">
        <CardTitle className="text-xl tracking-tight">Create account</CardTitle>
        <CardDescription>Credentials sign-up — stored with bcrypt, ready for sign-in.</CardDescription>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" placeholder="Ada Lovelace" required disabled={isPending} />
            {fieldErrors.name && <p className="text-xs text-destructive">{fieldErrors.name[0]}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="you@example.com" required disabled={isPending} />
            {fieldErrors.email && <p className="text-xs text-destructive">{fieldErrors.email[0]}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" placeholder="••••••••" required minLength={8} disabled={isPending} />
            {fieldErrors.password && <p className="text-xs text-destructive">{fieldErrors.password[0]}</p>}
          </div>

          {error && <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2 text-sm text-destructive">{error}</div>}

          <Button type="submit" disabled={isPending} className="rounded-full gap-2">
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Creating...
              </>
            ) : (
              "Create account"
            )}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Already have an account? <a href="/login" className="underline underline-offset-4 hover:text-foreground">Sign in</a>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
