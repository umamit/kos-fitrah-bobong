"use client";

import React, { useState } from "react";
import { Send } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";

const rates: Record<string, { day: number; month: number; year: number; name: string }> = {
  basic: { day: 100000, month: 600000, year: 6600000, name: "Standard Lite (Basic)" },
  comfort: { day: 100000, month: 700000, year: 7700000, name: "Eco Comfort (Standard Plus)" },
  breeze: { day: 100000, month: 750000, year: 8250000, name: "Eco Breeze (Standard Premium)" },
  vip: { day: 150000, month: 1000000, year: 11000000, name: "Executive VIP (Deluxe AC)" }
};

export function Calculator() {
  const [name, setName] = useState("");
  const [roomType, setRoomType] = useState("basic");
  const [cycle, setCycle] = useState("bulan");
  const [duration, setDuration] = useState(1);
  const [startDate, setStartDate] = useState(() => new Date().toISOString().split("T")[0]);

  const selectedRate = rates[roomType] || rates.basic;
  const unitPrice = cycle === "hari" ? selectedRate.day : cycle === "bulan" ? selectedRate.month : selectedRate.year;
  const totalCost = unitPrice * Math.max(1, duration);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cycleText = cycle === "hari" ? "Hari" : cycle === "bulan" ? "Bulan" : "Tahun";
    const dateFormatted = startDate ? new Date(startDate).toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) : "-";
    const text = `Halo Pengelola Kos Fitrah Bobong,

Saya ingin mengajukan pemesanan kamar kos dengan detail berikut:
• Nama: ${name}
• Tipe Kamar: Kamar ${selectedRate.name}
• Durasi Sewa: ${duration} ${cycleText}
• Rencana Masuk: ${dateFormatted}

Estimasi Biaya Sewa:
• Tarif: ${formatCurrency(unitPrice)} / ${cycle}
• Total Estimasi: ${formatCurrency(totalCost)}

Mohon konfirmasi ketersediaan unit kamar tersebut. Terima kasih!`;

    window.open(`https://wa.me/6281357001357?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <section className="py-20 max-w-2xl mx-auto px-4 sm:px-6" id="kalkulator">
      <div className="text-center mb-12 space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-primary">Estimasi Biaya</span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">Hitung Tarif Sewa Anda</h2>
        <p className="text-sm sm:text-base text-muted-foreground">Pilih tipe kamar dan periode sewa untuk mendapatkan estimasi total biaya secara akurat dan transparan.</p>
      </div>
      <Card className="p-6 sm:p-8 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-foreground">Nama Lengkap</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Masukkan nama Anda" required />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-foreground">Tipe Kamar</label>
              <select id="tipe-kamar" value={roomType} onChange={(e) => setRoomType(e.target.value)} className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm font-medium focus:border-primary">
                <option value="basic">Standard Lite (Basic)</option>
                <option value="comfort">Eco Comfort (Standard Plus)</option>
                <option value="breeze">Eco Breeze (Standard Premium)</option>
                <option value="vip">Executive VIP (Deluxe AC)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-foreground">Skema Sewa</label>
              <select value={cycle} onChange={(e) => setCycle(e.target.value)} className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm font-medium focus:border-primary">
                <option value="hari">Harian</option>
                <option value="bulan">Bulanan</option>
                <option value="tahun">Tahunan</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-foreground">Durasi ({cycle === "hari" ? "Hari" : cycle === "bulan" ? "Bulan" : "Tahun"})</label>
              <Input type="number" min="1" max="60" value={duration} onChange={(e) => setDuration(parseInt(e.target.value) || 1)} required />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-foreground">Rencana Tanggal Masuk</label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
            </div>
          </div>
          <div className="p-4 rounded-xl bg-muted/70 border border-border space-y-2">
            <div className="flex justify-between text-sm"><span className="text-muted-foreground font-medium">Tarif Dasar:</span><span className="font-bold text-foreground">{formatCurrency(unitPrice)} / {cycle}</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground font-medium">Deposit / Jaminan:</span><span className="font-bold text-emerald-600">Rp 0 (Gratis)</span></div>
            <div className="pt-2 border-t border-border flex justify-between items-center"><span className="font-extrabold text-foreground">Estimasi Total:</span><span className="text-xl font-extrabold text-primary">{formatCurrency(totalCost)}</span></div>
          </div>
          <Button type="submit" size="lg" className="w-full gap-2">
            <Send className="w-4 h-4" />
            Ajukan Pemesanan via WhatsApp
          </Button>
        </form>
      </Card>
    </section>
  );
}
