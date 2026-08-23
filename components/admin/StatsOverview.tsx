import React from "react";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

export function StatsOverview({ totalIncome, totalPending, occupiedCount }: {
  totalIncome: number;
  totalPending: number;
  occupiedCount: number;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
      <Card className="p-6 space-y-2 hover:shadow-md transition-all">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Uang Masuk (Bulan Ini)</span>
        <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 tracking-tight">{formatCurrency(totalIncome)}</div>
      </Card>
      <Card className="p-6 space-y-2 hover:shadow-md transition-all">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Sisa Tagihan / Piutang</span>
        <div className="text-2xl sm:text-3xl font-extrabold text-amber-500 tracking-tight">{formatCurrency(totalPending)}</div>
      </Card>
      <Card className="p-6 space-y-2 hover:shadow-md transition-all">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Kamar Terisi</span>
        <div className="text-2xl sm:text-3xl font-extrabold text-sky-600 tracking-tight">{occupiedCount} / 9 Kamar</div>
      </Card>
    </div>
  );
}
