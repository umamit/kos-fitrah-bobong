import React from "react";
import Image from "next/image";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminHeader({ period, onPeriodChange, onLock }: {
  period: string;
  onPeriodChange: (val: string) => void;
  onLock: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-border bg-card/85 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image src="/assets/logo-symbol.png?v=3.0.0" alt="Logo" width={28} height={28} className="h-7 w-auto" />
          <h1 className="font-extrabold text-base sm:text-lg tracking-tight">Pembukuan Kos Fitrah</h1>
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary bg-primary-light px-2.5 py-0.5 rounded-full border border-primary/20">9 Kamar</span>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="month"
            value={period}
            onChange={(e) => onPeriodChange(e.target.value)}
            className="h-9 px-3 rounded-md border border-border bg-background text-xs font-semibold text-foreground focus:border-primary"
          />
          <Button variant="secondary" size="sm" onClick={onLock} className="gap-1.5">
            <Lock className="w-3.5 h-3.5" />
            Kunci
          </Button>
        </div>
      </div>
    </header>
  );
}
