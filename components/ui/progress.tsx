import * as React from "react";
import { cn } from "@/lib/utils";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  variant?: "default" | "warning";
}

export function Progress({ className, value = 0, variant = "default", ...props }: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, value));
  
  return (
    <div
      className={cn("relative h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700/50", className)}
      {...props}
    >
      <div
        className={cn(
          "h-full w-full flex-1 transition-all duration-500 rounded-full",
          variant === "warning"
            ? "bg-gradient-to-r from-amber-400 to-amber-500"
            : "bg-gradient-to-r from-emerald-500 to-emerald-600"
        )}
        style={{ transform: `translateX(-${100 - percentage}%)` }}
      />
    </div>
  );
}
