import * as React from "react";

import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "h-12 w-full rounded-2xl border border-[var(--border)] bg-white/80 px-4 text-sm text-ink shadow-sm outline-none ring-0 transition placeholder:text-slate focus:border-moss",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
