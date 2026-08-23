import React from "react";
import { ArrowDownLeft, Clock, Home, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

export function StatsOverview({ totalIncome, totalPending, occupiedCount }: {
  totalIncome: number;
  totalPending: number;
  occupiedCount: number;
}) {
  const occupancyRate = Math.round((occupiedCount / 9) * 100);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
      {/* Income Card */}
      <Card className="relative overflow-hidden p-6 border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 via-card to-card hover:shadow-lg transition-all">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Total Uang Masuk</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">{formatCurrency(totalIncome)}</div>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
            <ArrowDownLeft className="w-5 h-5" />
          </div>
        </div>
        <p className="text-[11px] text-muted-foreground mt-3 flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
          Akumulasi cicilan & pelunasan periode ini
        </p>
      </Card>

      {/* Pending Card */}
      <Card className="relative overflow-hidden p-6 border border-amber-500/20 bg-gradient-to-br from-amber-500/5 via-card to-card hover:shadow-lg transition-all">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Sisa Tagihan / Piutang</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">{formatCurrency(totalPending)}</div>
          </div>
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-600 border border-amber-500/20">
            <Clock className="w-5 h-5" />
          </div>
        </div>
        <p className="text-[11px] text-muted-foreground mt-3">Target sisa pembayaran dari unit berpenghuni</p>
      </Card>

      {/* Occupancy Card */}
      <Card className="relative overflow-hidden p-6 border border-sky-500/20 bg-gradient-to-br from-sky-500/5 via-card to-card hover:shadow-lg transition-all">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">Okupansi Kamar</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              {occupiedCount} <span className="text-sm font-semibold text-muted-foreground">/ 9 Kamar ({occupancyRate}%)</span>
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-sky-500/10 text-sky-600 border border-sky-500/20">
            <Home className="w-5 h-5" />
          </div>
        </div>
        <p className="text-[11px] text-muted-foreground mt-3">{9 - occupiedCount} kamar saat ini siap untuk disewakan</p>
      </Card>
    </div>
  );
}
