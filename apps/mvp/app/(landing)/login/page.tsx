"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/actions/auth";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/use-auth-store";

export default function LoginPage() {
  const router = useRouter();
  const [state, action, isPending] = useActionState(login, null);
  const setAuth = useAuthStore((s) => s.setAuth);

  // Synchronize Zustand state with server session if login success
  useEffect(() => {
    if (state && state.success && state.user && state.token) {
      setAuth(state.user, state.token, state.tenantId || undefined);
      // Redirect to workflows after successful login
      router.push("/workflows");
    }
  }, [state, setAuth, router]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-sm space-y-6 rounded-lg border bg-background p-6 shadow-sm">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight">Welcome Back</h1>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to sign in
          </p>
        </div>

        <form action={action} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              placeholder="user@example.com"
              type="email"
              required
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              placeholder="••••••••"
              type="password"
              required
              disabled={isPending}
            />
          </div>

          {state?.msg && (
            <div className="rounded bg-destructive/10 p-2 text-xs font-medium text-destructive">
              {state.msg}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        <div className="text-center text-xs text-muted-foreground pt-4 border-t">
          <p>Test: test@example.com / password123</p>
        </div>
      </div>
    </div>
  );
}
