import React from "react";
import { Plus, Edit2 } from "lucide-react";
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
  const rem = Math.max(0, room.rate - paid);
  const percent = room.occupied ? Math.min(100, Math.round((paid / room.rate) * 100)) : 0;
  
  let statusText = "KOSONG";
  let statusVariant: "success" | "warning" | "danger" | "muted" = "muted";

  if (room.occupied) {
    if (paid >= room.rate) {
      statusText = "Lunas";
      statusVariant = "success";
    } else if (paid > 0) {
      statusText = "Dicicil";
      statusVariant = "warning";
    } else {
      statusText = "Belum Bayar";
      statusVariant = "danger";
    }
  }

  return (
    <Card className="p-6 flex flex-col justify-between space-y-5 hover:shadow-lg hover:border-primary/40 transition-all">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-extrabold text-foreground">Kamar {room.id}</span>
          <Badge variant={statusVariant}>{statusText}</Badge>
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-foreground text-base">{room.occupied ? room.tenant : "Kamar Kosong"}</h4>
          <p className="text-xs text-muted-foreground">
            {room.occupied ? `Jatuh tempo tgl ${room.dueDay} • ${formatCurrency(room.rate)}/bln` : "Siap huni"}
          </p>
        </div>
        {room.occupied && (
          <div className="space-y-2 bg-muted/60 p-3 rounded-xl border border-border">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-muted-foreground">Masuk: {formatCurrency(paid)}</span>
              <span className="text-foreground">Sisa: {formatCurrency(rem)}</span>
            </div>
            <Progress value={percent} variant={percent < 100 && percent > 0 ? "warning" : "default"} />
          </div>
        )}
      </div>
      <div className="flex gap-2.5 pt-2">
        {room.occupied && (
          <Button size="sm" onClick={() => onPay(room.id)} className="flex-1 gap-1.5">
            <Plus className="w-3.5 h-3.5" />
            Bayar / Cicil
          </Button>
        )}
        <Button variant="secondary" size="sm" onClick={() => onEdit(room.id)} className="flex-1 gap-1.5">
          <Edit2 className="w-3.5 h-3.5" />
          Edit
        </Button>
      </div>
    </Card>
  );
}
