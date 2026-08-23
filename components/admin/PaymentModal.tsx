"use client";

import React, { useState } from "react";
import { MessageCircle, Trash2, CheckCircle2 } from "lucide-react";
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
  onAddPayment: (amount: number, date: string, note: string) => void;
  onDeletePayment: (id: string) => void;
}) {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [note, setNote] = useState("");
  const [sendWa, setSendWa] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");

  if (!room) return null;

  const roomPayments = payments.filter((p) => p.roomId === room.id);
  const totalPaid = roomPayments.reduce((acc, p) => acc + p.amount, 0);
  
  const debtVal = room.debt || 0;
  const totalTarget = room.rate + debtVal;
  const remaining = Math.max(0, totalTarget - totalPaid);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(amount);
    if (!val || val <= 0) return;
    onAddPayment(val, date, note);

    const isLunas = (totalPaid + val) >= totalTarget;
    const info = `Berhasil menyimpan pembayaran sebesar ${formatCurrency(val)} untuk Kamar ${room.id}. Status: ${isLunas ? "LUNAS" : "BELUM LUNAS"}`;
    setSuccessMsg(info);

    if (sendWa) {
      const currentPaid = totalPaid + val;
      const currentRemaining = Math.max(0, totalTarget - currentPaid);
      const statusStr = currentRemaining === 0 ? "LUNAS" : `BELUM LUNAS (Sisa: ${formatCurrency(currentRemaining)})`;
      const noteStr = note ? `\n• Keterangan: ${note}` : "";

      const msg = `*KWITANSI PEMBAYARAN KOS FITRAH*
============================
Kepada Yth: *${room.tenant}*
Kamar: *No. ${room.id}*
Periode: *${period}*

*RINCIAN PEMBAYARAN:*
• Tanggal: ${date}
• Jumlah Masuk: *${formatCurrency(val)}*${noteStr}

*STATUS TAGIHAN:*
• Tarif Kamar: ${formatCurrency(room.rate)} / bulan
• Tunggakan Lalu: ${formatCurrency(debtVal)}
• Total Harus Dibayar: ${formatCurrency(totalTarget)}
• Total Sudah Masuk: ${formatCurrency(currentPaid)}
• Status: *${statusStr}*
============================
Terima kasih atas pembayaran Anda.`;

      const phone = room.phone.replace(/[^0-9]/g, "").replace(/^0/, "62");
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, "_blank");
    }

    setAmount("");
    setNote("");
    setTimeout(() => setSuccessMsg(""), 5000);
  };

  const handlePayLunasBulanIni = () => {
    setAmount(remaining.toString());
    setNote("Pelunasan Tagihan");
  };

  return (
    <Dialog open={open} onClose={() => { setSuccessMsg(""); onClose(); }} title={`Pembukuan Kamar ${room.id}`}>
      <div className="space-y-6">
        {/* Info Box */}
        <div className="grid grid-cols-3 gap-2 p-4 rounded-xl bg-muted border border-border text-center">
          <div>
            <span className="text-[10px] font-bold uppercase text-muted-foreground">Sudah Bayar</span>
            <div className="text-sm sm:text-base font-extrabold text-emerald-600">{formatCurrency(totalPaid)}</div>
          </div>
          <div className="border-x border-border/80">
            <span className="text-[10px] font-bold uppercase text-muted-foreground">Tunggakan</span>
            <div className="text-sm sm:text-base font-extrabold text-red-500">{formatCurrency(debtVal)}</div>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-muted-foreground">Sisa Tagihan</span>
            <div className="text-sm sm:text-base font-extrabold text-amber-500">{formatCurrency(remaining)}</div>
          </div>
        </div>

        {remaining > 0 && (
          <Button variant="outline" size="sm" onClick={handlePayLunasBulanIni} className="w-full text-xs font-bold py-2 border-emerald-500/35 hover:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
            Pilih Lunas / Bayar Semua Sisa Tagihan ({formatCurrency(remaining)})
          </Button>
        )}

        {successMsg && (
          <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

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
                    <Button variant="secondary" size="sm" onClick={() => {
                      const noteStr = p.note ? `\n• Keterangan: ${p.note}` : "";
                      const msg = `*KWITANSI PEMBAYARAN KOS FITRAH*
============================
Kepada Yth: *${room.tenant}*
Kamar: *No. ${room.id}*
Periode: *${period}*

*RINCIAN PEMBAYARAN:*
• Tanggal: ${p.date}
• Jumlah Masuk: *${formatCurrency(p.amount)}*${noteStr}

*STATUS TAGIHAN:*
• Tarif Kamar: ${formatCurrency(room.rate)} / bulan
• Tunggakan Lalu: ${formatCurrency(debtVal)}
• Total Sudah Masuk: ${formatCurrency(totalPaid)}
• Status: *${totalPaid >= totalTarget ? "LUNAS" : `BELUM LUNAS (Sisa: ${formatCurrency(remaining)})`}*
============================
Terima kasih atas pembayaran Anda.`;
                      const phone = room.phone.replace(/[^0-9]/g, "").replace(/^0/, "62");
                      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, "_blank");
                    }} className="p-1.5 h-auto">
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
