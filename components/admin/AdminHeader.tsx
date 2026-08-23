import React from "react";
import Image from "next/image";
import { Lock, Calendar, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminHeader({ period, onPeriodChange, onLock }: {
  period: string;
  onPeriodChange: (val: string) => void;
  onLock: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-border/80 bg-card/90 backdrop-blur-xl shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="relative p-1.5 rounded-xl bg-primary/10 border border-primary/20">
            <Image src="/assets/logo-symbol.png?v=3.0.0" alt="Logo" width={28} height={28} className="h-7 w-auto" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base sm:text-lg tracking-tight text-foreground">Kos Fitrah</h1>
              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-900/50">
                <Layers className="w-3 h-3" />
                9 Kamar
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground font-medium">Sistem Pembukuan & Manajemen Unit</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-muted/60 px-3 py-1.5 rounded-xl border border-border">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <input
              type="month"
              value={period}
              onChange={(e) => onPeriodChange(e.target.value)}
              className="bg-transparent text-xs font-bold text-foreground focus:outline-none cursor-pointer"
            />
          </div>
          <Button variant="outline" size="sm" onClick={onLock} className="gap-1.5 rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors">
            <Lock className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Kunci Sesi</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
