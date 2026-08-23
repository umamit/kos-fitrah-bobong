"use client";

import React, { useState } from "react";
import { MessageCircle, Trash2 } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";
import type { RoomAdminData } from "./RoomCardAdmin";

export interface PaymentRecord {
  id: string;
  roomId: string;
  amount: number;
  date: string;
  note: string;
}

export function PaymentModal({
  open,
  onClose,
  room,
  period,
  payments,
  onAddPayment,
  onDeletePayment
}: {
  open: boolean;
  onClose: () => void;
  room: RoomAdminData | null;
  period: string;
  payments: PaymentRecord[];
  onAddPayment: (amount: number, date: string, note: string, sendWa: boolean) => void;
  onDeletePayment: (id: string) => void;
}) {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [note, setNote] = useState("");
  const [sendWa, setSendWa] = useState(true);

  if (!room) return null;

  const roomPayments = payments.filter((p) => p.roomId === room.id);
  const totalPaid = roomPayments.reduce((acc, p) => acc + p.amount, 0);
  const remaining = Math.max(0, room.rate - totalPaid);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(amount);
    if (!val || val <= 0) return;
    onAddPayment(val, date, note, sendWa);
    setAmount("");
    setNote("");
  };

  const handleSendWA = (p: PaymentRecord) => {
    const isLunas = remaining === 0;
    const statusStr = isLunas ? "LUNAS" : `BELUM LUNAS (Sisa: ${formatCurrency(remaining)})`;
    const noteStr = p.note ? `\n• Keterangan: ${p.note}` : "";

    const msg = `*KWITANSI PEMBAYARAN KOS FITRAH*
============================
Kepada Yth: *${room.tenant}*
Kamar: *No. ${room.id}*
Periode: *${period}*

*RINCIAN PEMBAYARAN:*
• Tanggal: ${p.date}
• Jumlah Masuk: *${formatCurrency(p.amount)}*${noteStr}

*STATUS TAGIHAN BULAN INI:*
• Total Tagihan: ${formatCurrency(room.rate)}
• Total Sudah Masuk: ${formatCurrency(totalPaid)}
• Status: *${statusStr}*
============================
Terima kasih atas pembayaran Anda.`;

    const phone = room.phone.replace(/[^0-9]/g, "").replace(/^0/, "62");
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <Dialog open={open} onClose={onClose} title={`Pembukuan Kamar ${room.id}`}>
      <div className="space-y-6">
        <div className="flex justify-between items-center p-4 rounded-xl bg-muted border border-border">
          <div>
            <span className="text-xs font-semibold text-muted-foreground">Sudah Dibayar</span>
            <div className="text-lg font-extrabold text-emerald-600">{formatCurrency(totalPaid)}</div>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold text-muted-foreground">Sisa Tagihan</span>
            <div className="text-lg font-extrabold text-amber-500">{formatCurrency(remaining)}</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase text-foreground">Jumlah Pembayaran / Cicilan (Rp)</label>
            <Input type="number" min="1000" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Contoh: 200000" required />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase text-foreground">Tanggal Bayar</label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase text-foreground">Keterangan / Catatan</label>
            <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Contoh: Cicilan 1 (Transfer BCA)" />
          </div>
          <div className="flex items-center gap-2 p-3 bg-muted/60 rounded-xl border border-border">
            <input type="checkbox" id="send-wa" checked={sendWa} onChange={(e) => setSendWa(e.target.checked)} className="w-4 h-4 accent-emerald-600 cursor-pointer" />
            <label htmlFor="send-wa" className="text-xs font-medium text-foreground cursor-pointer">Kirim bukti kwitansi langsung ke WhatsApp penghuni</label>
          </div>
          <Button type="submit" className="w-full">Simpan Pembayaran</Button>
        </form>

        <div className="space-y-3 pt-4 border-t border-border">
          <h4 className="text-xs font-bold uppercase text-muted-foreground">Riwayat Pembayaran Bulan Ini</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {roomPayments.length === 0 ? (
              <p className="text-xs text-muted-foreground py-2">Belum ada cicilan masuk untuk bulan ini.</p>
            ) : (
              roomPayments.map((p) => (
                <div key={p.id} className="flex justify-between items-center p-3 rounded-xl bg-muted/80 border border-border text-xs">
                  <div>
                    <div className="font-bold text-foreground">{p.date} • {formatCurrency(p.amount)}</div>
                    <div className="text-muted-foreground text-[11px]">{p.note || "Tanpa catatan"}</div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Button variant="secondary" size="sm" onClick={() => handleSendWA(p)} className="p-1.5 h-auto">
                      <MessageCircle className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => onDeletePayment(p.id)} className="p-1.5 h-auto">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Dialog>
  );
}
