import React from "react";
import { Plus, Settings, User, PhoneCall, Calendar, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/utils";

export interface RoomAdminData {
  id: string;
  type: string;
  tenant: string;
  phone: string;
  rate: number;
  dueDay: number;
  occupied: boolean;
  debt?: number; // Tunggakan bulan-bulan sebelumnya
}

export function RoomCardAdmin({
  room,
  paid,
  onPay,
  onEdit
}: {
  room: RoomAdminData;
  paid: number;
  onPay: (id: string) => void;
  onEdit: (id: string) => void;
}) {
  const debtVal = room.debt || 0;
  const totalTarget = room.rate + debtVal;
  const rem = Math.max(0, totalTarget - paid);
  const percent = room.occupied ? Math.min(100, Math.round((paid / totalTarget) * 100)) : 0;
  
  let statusText = "KOSONG";
  let statusVariant: "success" | "warning" | "danger" | "muted" = "muted";

  if (room.occupied) {
    if (paid >= totalTarget) {
      statusText = "Lunas";
      statusVariant = "success";
    } else if (paid > 0) {
      statusText = `Dicicil (${percent}%)`;
      statusVariant = "warning";
    } else {
      statusText = "Belum Bayar";
      statusVariant = "danger";
    }
  }

  return (
    <Card className="p-6 flex flex-col justify-between space-y-6 hover:shadow-xl hover:border-primary/40 transition-all border-border/80 group">
      <div className="space-y-4">
        {/* Card Header */}
        <div className="flex justify-between items-center pb-3 border-b border-border/60">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-primary" />
            <span className="text-base font-extrabold text-foreground tracking-tight">Kamar {room.id}</span>
          </div>
          <Badge variant={statusVariant}>{statusText}</Badge>
        </div>

        {/* Tenant Body */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <h4 className="font-extrabold text-foreground text-base truncate">
              {room.occupied ? room.tenant : "Kamar Siap Huni"}
            </h4>
          </div>

          {room.occupied ? (
            <div className="space-y-1.5 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-muted-foreground/70" />
                <span>{room.phone || "Belum ada no WA"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-muted-foreground/70" />
                <span>Jatuh tempo tgl <strong>{room.dueDay}</strong> • {formatCurrency(room.rate)}/bln</span>
              </div>
              {debtVal > 0 && (
                <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-semibold bg-amber-50 dark:bg-amber-950/30 px-2 py-1 rounded-md border border-amber-200/50">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Ada Tunggakan: {formatCurrency(debtVal)}</span>
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">Unit kosong siap disewakan kapan saja.</p>
          )}
        </div>

        {/* Progress Tracker */}
        {room.occupied && (
          <div className="space-y-2 bg-muted/60 p-3.5 rounded-xl border border-border/60">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-emerald-600 dark:text-emerald-400">Masuk: {formatCurrency(paid)}</span>
              <span className="text-muted-foreground">Sisa: {formatCurrency(rem)}</span>
            </div>
            <Progress value={percent} variant={percent < 100 && percent > 0 ? "warning" : "default"} />
          </div>
        )}
      </div>

      {/* Card Action Buttons */}
      <div className="flex gap-2.5 pt-2">
        {room.occupied && (
          <Button size="sm" onClick={() => onPay(room.id)} className="flex-1 gap-1.5 rounded-xl shadow-xs">
            <Plus className="w-3.5 h-3.5" />
            + Cicilan
          </Button>
        )}
        <Button variant="outline" size="sm" onClick={() => onEdit(room.id)} className="flex-1 gap-1.5 rounded-xl">
          <Settings className="w-3.5 h-3.5 text-muted-foreground" />
          Pengaturan
        </Button>
      </div>
    </Card>
  );
}
