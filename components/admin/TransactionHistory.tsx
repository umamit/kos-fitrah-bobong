import React from "react";
import { formatCurrency } from "@/lib/utils";
import type { PaymentRecord } from "./PaymentModal";
import type { RoomAdminData } from "./RoomCardAdmin";
import { Card } from "@/components/ui/card";

export function TransactionHistory({
  payments,
  rooms
}: {
  payments: PaymentRecord[];
  rooms: RoomAdminData[];
}) {
  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <Card className="p-6 border border-border/80 shadow-xs space-y-4">
      <div>
        <h3 className="text-base font-extrabold text-foreground tracking-tight">Riwayat Transaksi Masuk</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Daftar seluruh riwayat cicilan & pelunasan pembayaran bulan ini</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-border/60 text-muted-foreground font-semibold">
              <th className="py-2.5">Tanggal</th>
              <th className="py-2.5">Unit Kamar</th>
              <th className="py-2.5">Nama Penyewa</th>
              <th className="py-2.5 text-right">Jumlah Bayar</th>
              <th className="py-2.5 pl-4">Catatan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40 font-medium">
            {payments.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-muted-foreground font-normal">
                  Belum ada transaksi masuk pada periode bulan ini.
                </td>
              </tr>
            ) : (
              payments.map((p) => {
                const roomInfo = rooms.find((r) => r.id === p.roomId);
                return (
                  <tr key={p.id} className="hover:bg-muted/40 transition-colors">
                    <td className="py-3 text-muted-foreground">{p.date}</td>
                    <td className="py-3 font-bold text-foreground">Kamar {p.roomId}</td>
                    <td className="py-3 text-foreground truncate max-w-[90px]">{roomInfo?.tenant || "Penghuni Baru"}</td>
                    <td className="py-3 text-right font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(p.amount)}</td>
                    <td className="py-3 pl-4 text-muted-foreground italic truncate max-w-[120px]" title={p.note}>
                      {p.note || "-"}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {payments.length > 0 && (
        <div className="pt-4 border-t border-border/80 flex items-center justify-between text-xs font-bold bg-muted/30 p-2.5 rounded-xl border border-border/40">
          <span className="text-muted-foreground">Total: {payments.length} Transaksi</span>
          <span className="text-emerald-600 dark:text-emerald-400">{formatCurrency(totalAmount)}</span>
        </div>
      )}
    </Card>
  );
}
