"use client";

import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-screen max-w-xl items-center px-6">
      <div className="glass-panel w-full rounded-[2rem] p-8 text-center">
        <p className="section-title">Something failed safely</p>
        <h1 className="mt-3 text-3xl font-semibold text-ink">We hit an unexpected UI error</h1>
        <p className="mt-3 text-sm text-slate">{error.message}</p>
        <Button className="mt-6" onClick={reset}>
          Try again
        </Button>
      </div>
    </div>
  );
}
