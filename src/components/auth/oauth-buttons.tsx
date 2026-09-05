'use client';

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Globe, GitBranch } from "lucide-react";

export function OAuthButtons({ callbackUrl = "/dashboard" }: { callbackUrl?: string }) {
  return (
    <div className="flex flex-col gap-2">
      <Button
        variant="outline"
        className="rounded-full gap-2 w-full"
        onClick={() => signIn("google", { callbackUrl })}
        type="button"
      >
        <Globe className="size-4" /> Continue with Google
      </Button>
      <Button
        variant="outline"
        className="rounded-full gap-2 w-full"
        onClick={() => signIn("github", { callbackUrl })}
        type="button"
      >
        <GitBranch className="size-4" /> Continue with GitHub
      </Button>
    </div>
  );
}
