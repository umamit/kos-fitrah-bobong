"use client";

import React, { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const roomRates: Record<string, { label: string; value: number }> = {
  basic: { label: "Standard Lite (Basic) - Rp 600.000", value: 600000 },
  comfort: { label: "Eco Comfort (Standard Plus) - Rp 700.000", value: 700000 },
  breeze: { label: "Eco Breeze (Standard Premium) - Rp 750.000", value: 750000 },
  vip: { label: "Executive VIP (Deluxe AC) - Rp 1.000.000", value: 1000000 }
};

export function AddRoomModal({
  open,
  onClose,
  onAdd
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (id: string, type: string, rate: number, dueDay: number) => void;
}) {
  const [roomId, setRoomId] = useState("");
  const [type, setType] = useState("basic");
  const [rate, setRate] = useState(600000);
  const [dueDay, setDueDay] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomId.trim()) return;
    onAdd(roomId.trim(), type, rate, dueDay);
    setRoomId("");
    onClose();
  };

  const handleRateSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setType(val);
    const selected = roomRates[val];
    if (selected) {
      setRate(selected.value);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} title="Tambah Kamar Baru">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase text-foreground">Nomor / ID Kamar</label>
          <Input value={roomId} onChange={(e) => setRoomId(e.target.value)} placeholder="Contoh: 10, 04A" required />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase text-foreground">Tipe / Paket Kamar</label>
            <select
              value={type}
              onChange={handleRateSelectChange}
              className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm font-medium focus:border-primary focus:outline-none"
            >
              {Object.entries(roomRates).map(([key, item]) => (
                <option key={key} value={key}>{item.label}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase text-foreground">Tarif Bulanan (Rp)</label>
            <Input
              type="number"
              step="50000"
              value={rate}
              onChange={(e) => setRate(parseInt(e.target.value) || 0)}
              required
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase text-foreground">Tanggal Jatuh Tempo Default</label>
          <Input type="number" min="1" max="31" value={dueDay} onChange={(e) => setDueDay(parseInt(e.target.value) || 1)} required />
        </div>
        <Button type="submit" className="w-full">Tambahkan Kamar</Button>
      </form>
    </Dialog>
  );
}
