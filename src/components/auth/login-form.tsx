'use client';

import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Mail, Lock } from "lucide-react";

export function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [error, setError] = useState<string | null>(searchParams.get("error"));
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (res?.error) {
        setError("Invalid email or password");
      } else if (res?.ok) {
        window.location.href = callbackUrl;
      } else {
        setError("Something went wrong");
      }
    });
  };

  return (
    <Card className="w-full max-w-sm shadow-lg">
      <CardHeader className="space-y-1 p-6 pb-4">
        <CardTitle className="text-xl tracking-tight">Sign in</CardTitle>
        <CardDescription>Use credentials or OAuth to continue to your workspace.</CardDescription>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9"
                required
                disabled={isPending}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9"
                required
                minLength={8}
                disabled={isPending}
              />
            </div>
          </div>

          {error && <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2 text-sm text-destructive">{error}</div>}

          <Button type="submit" disabled={isPending} className="rounded-full gap-2">
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            No account? <a href="/register" className="underline underline-offset-4 hover:text-foreground">Create one</a>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
