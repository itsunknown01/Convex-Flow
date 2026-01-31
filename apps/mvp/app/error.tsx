"use client";

import { useEffect } from "react";
import { Button } from "@workspace/ui/components/button";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to an external service in production
    console.error("[GlobalErrorBoundary]", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="h-20 w-20 bg-destructive/10 rounded-full flex items-center justify-center mb-8 border border-destructive/20">
        <AlertTriangle className="h-10 w-10 text-destructive" />
      </div>
      <h1 className="text-3xl font-bold text-foreground mb-2">
        Something went wrong
      </h1>
      <p className="text-muted-foreground max-w-md mb-8">
        An unexpected error occurred. This incident has been logged. Please try
        again.
      </p>
      {error.digest && (
        <p className="text-[10px] font-mono text-muted-foreground mb-6 bg-muted px-3 py-1 rounded-full">
          Error ID: {error.digest}
        </p>
      )}
      <div className="flex items-center gap-4">
        <Button onClick={reset} variant="default">
          <RefreshCcw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">
            <Home className="h-4 w-4 mr-2" />
            Go Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
