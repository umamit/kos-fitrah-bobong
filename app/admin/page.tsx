"use client";

import React, { useState, useEffect } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { StatsOverview } from "@/components/admin/StatsOverview";
import { RoomCardAdmin, type RoomAdminData } from "@/components/admin/RoomCardAdmin";
import { PaymentModal, type PaymentRecord } from "@/components/admin/PaymentModal";
import { EditRoomModal } from "@/components/admin/EditRoomModal";
import { LoginOverlay } from "@/components/admin/LoginOverlay";
import { supabase } from "@/lib/supabase/client";

const defaultRooms: RoomAdminData[] = [
  { id: "01", type: "basic", tenant: "Budi Santoso", phone: "08123456789", rate: 600000, dueDay: 5, occupied: true },
  { id: "02", type: "basic", tenant: "Ahmad Rizki", phone: "08129876543", rate: 600000, dueDay: 10, occupied: true },
  { id: "03", type: "comfort", tenant: "Siti Rahma", phone: "08215554443", rate: 700000, dueDay: 1, occupied: true },
  { id: "04", type: "comfort", tenant: "", phone: "", rate: 700000, dueDay: 1, occupied: false },
  { id: "05", type: "breeze", tenant: "Fajar Pratama", phone: "08521112223", rate: 750000, dueDay: 15, occupied: true },
  { id: "06", type: "breeze", tenant: "Dewi Lestari", phone: "08137778889", rate: 750000, dueDay: 20, occupied: true },
  { id: "07", type: "vip", tenant: "Hendro Wijaya", phone: "08112223334", rate: 1000000, dueDay: 25, occupied: true },
  { id: "08", type: "vip", tenant: "", phone: "", rate: 1000000, dueDay: 1, occupied: false },
  { id: "09", type: "vip", tenant: "Rian Saputra", phone: "08139990001", rate: 1000000, dueDay: 8, occupied: true }
];

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [period, setPeriod] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });

  const [rooms, setRooms] = useState<RoomAdminData[]>(defaultRooms);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [activePayRoom, setActivePayRoom] = useState<RoomAdminData | null>(null);
  const [activeEditRoom, setActiveEditRoom] = useState<RoomAdminData | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setIsAuthenticated(true);
    });

    const savedRooms = localStorage.getItem("kosfitrah_rooms_v3");
    if (savedRooms) try { setRooms(JSON.parse(savedRooms)); } catch (e) {}

    const savedPay = localStorage.getItem(`kosfitrah_pay_v3_${period}`);
    if (savedPay) try { setPayments(JSON.parse(savedPay)); } catch (e) {}
  }, [period]);

  const handleSaveRooms = (updated: RoomAdminData) => {
    const next = rooms.map((r) => (r.id === updated.id ? updated : r));
    setRooms(next);
    localStorage.setItem("kosfitrah_rooms_v3", JSON.stringify(next));
  };

  const handleAddPayment = (amount: number, date: string, note: string) => {
    if (!activePayRoom) return;
    const newPay: PaymentRecord = {
      id: "pay_" + Date.now(),
      roomId: activePayRoom.id,
      amount,
      date,
      note
    };
    const next = [newPay, ...payments];
    setPayments(next);
    localStorage.setItem(`kosfitrah_pay_v3_${period}`, JSON.stringify(next));
  };

  const handleDeletePayment = (id: string) => {
    const next = payments.filter((p) => p.id !== id);
    setPayments(next);
    localStorage.setItem(`kosfitrah_pay_v3_${period}`, JSON.stringify(next));
  };

  const occupiedRooms = rooms.filter((r) => r.occupied);
  const totalIncome = payments.reduce((acc, p) => acc + p.amount, 0);
  const totalTarget = occupiedRooms.reduce((acc, r) => acc + r.rate, 0);
  const totalPending = Math.max(0, totalTarget - totalIncome);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {!isAuthenticated && <LoginOverlay onLoginSuccess={() => setIsAuthenticated(true)} />}
      <AdminHeader period={period} onPeriodChange={setPeriod} onLock={() => setIsAuthenticated(false)} />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <StatsOverview totalIncome={totalIncome} totalPending={totalPending} occupiedCount={occupiedRooms.length} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => {
            const roomPaid = payments.filter((p) => p.roomId === room.id).reduce((acc, p) => acc + p.amount, 0);
            return (
              <RoomCardAdmin
                key={room.id}
                room={room}
                paid={roomPaid}
                onPay={() => setActivePayRoom(room)}
                onEdit={() => setActiveEditRoom(room)}
              />
            );
          })}
        </div>
      </main>
      <PaymentModal
        open={!!activePayRoom}
        onClose={() => setActivePayRoom(null)}
        room={activePayRoom}
        period={period}
        payments={payments}
        onAddPayment={handleAddPayment}
        onDeletePayment={handleDeletePayment}
      />
      <EditRoomModal
        open={!!activeEditRoom}
        onClose={() => setActiveEditRoom(null)}
        room={activeEditRoom}
        onSave={handleSaveRooms}
      />
    </div>
  );
}
