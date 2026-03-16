import * as React from "react";

import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "min-h-28 w-full rounded-[1.4rem] border border-[var(--border)] bg-white/80 px-4 py-3 text-sm text-ink shadow-sm outline-none focus:border-moss",
          className
        )}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";
