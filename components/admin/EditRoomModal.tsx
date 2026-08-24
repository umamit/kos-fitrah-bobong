"use client";

import React, { useState, useEffect } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { RoomAdminData } from "./RoomCardAdmin";

const roomRates: Record<string, { label: string; value: number }> = {
  basic: { label: "Standard Lite (Basic) - Rp 600.000", value: 600000 },
  comfort: { label: "Eco Comfort (Standard Plus) - Rp 700.000", value: 700000 },
  breeze: { label: "Eco Breeze (Standard Premium) - Rp 750.000", value: 750000 },
  vip: { label: "Executive VIP (Deluxe AC) - Rp 1.000.000", value: 1000000 }
};

export function EditRoomModal({
  open,
  onClose,
  room,
  onSave,
  onDelete
}: {
  open: boolean;
  onClose: () => void;
  room: RoomAdminData | null;
  onSave: (updated: RoomAdminData) => void;
  onDelete: (id: string) => void;
}) {
  const [tenant, setTenant] = useState("");
  const [phone, setPhone] = useState("");
  const [rate, setRate] = useState(600000);
  const [dueDay, setDueDay] = useState(1);
  const [occupied, setOccupied] = useState(false);
  const [debt, setDebt] = useState(0);
  const [selectedType, setSelectedType] = useState("basic");

  useEffect(() => {
    if (room) {
      setTenant(room.tenant || "");
      setPhone(room.phone || "");
      setRate(room.rate || 600000);
      setDueDay(room.dueDay || 1);
      setOccupied(room.occupied);
      setDebt(room.debt || 0);
      setSelectedType(room.type || "basic");
    }
  }, [room]);

  if (!room) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...room,
      tenant,
      phone,
      rate,
      dueDay,
      occupied,
      debt,
      type: selectedType
    });
    onClose();
  };

  const handleDelete = () => {
    if (confirm(`Apakah Anda yakin ingin menghapus Kamar ${room.id} secara permanen dari sistem? Semua data terkait kamar ini akan hilang.`)) {
      onDelete(room.id);
      onClose();
    }
  };

  const handleRateSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedType(val);
    if (val === "custom") return;
    const selected = roomRates[val];
    if (selected) {
      setRate(selected.value);
    }
  };

  const isCustomRate = selectedType === "custom" || !Object.values(roomRates).some((r) => r.value === rate);

  return (
    <Dialog open={open} onClose={onClose} title={`Pengaturan Kamar ${room.id}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase text-foreground">Nama Penghuni</label>
          <Input value={tenant} onChange={(e) => setTenant(e.target.value)} placeholder="Nama lengkap penghuni" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase text-foreground">Nomor WhatsApp Penghuni</label>
          <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Contoh: 081234567890" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase text-foreground">Tipe / Paket Kamar</label>
            <select
              value={isCustomRate ? "custom" : selectedType}
              onChange={handleRateSelectChange}
              className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm font-medium focus:border-primary focus:outline-none"
            >
              {Object.entries(roomRates).map(([key, item]) => (
                <option key={key} value={key}>{item.label}</option>
              ))}
              <option value="custom">Kustom (Ketik Manual)</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase text-foreground">Tarif Bulanan (Rp)</label>
            <Input
              type="number"
              step="50000"
              value={rate}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 0;
                setRate(val);
                const matchedType = Object.keys(roomRates).find((k) => roomRates[k].value === val);
                setSelectedType(matchedType || "custom");
              }}
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase text-foreground">Tanggal Jatuh Tempo</label>
            <Input type="number" min="1" max="31" value={dueDay} onChange={(e) => setDueDay(parseInt(e.target.value) || 1)} required />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase text-foreground text-amber-600">Tunggakan Lalu (Rp)</label>
            <Input
              type="number"
              step="50000"
              value={debt}
              onChange={(e) => setDebt(parseInt(e.target.value) || 0)}
              placeholder="Tunggakan bulan lalu"
            />
          </div>
        </div>
        <div className="flex items-center gap-2 p-3 bg-muted/60 rounded-xl border border-border">
          <input
            type="checkbox"
            id="occupied-check"
            checked={occupied}
            onChange={(e) => setOccupied(e.target.checked)}
            className="w-4 h-4 accent-emerald-600 cursor-pointer"
          />
          <label htmlFor="occupied-check" className="text-xs font-medium text-foreground cursor-pointer">
            Kamar sedang terisi / berpenghuni
          </label>
        </div>
        <div className="flex gap-3 pt-2">
          <Button type="button" variant="danger" onClick={handleDelete} className="flex-1">
            Hapus Kamar
          </Button>
          <Button type="submit" className="flex-2">
            Simpan Perubahan
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
