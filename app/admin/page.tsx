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
  { id: "01", type: "basic", tenant: "Budi Santoso", phone: "08123456789", rate: 600000, dueDay: 5, occupied: true, debt: 0 },
  { id: "02", type: "basic", tenant: "Ahmad Rizki", phone: "08129876543", rate: 600000, dueDay: 10, occupied: true, debt: 0 },
  { id: "03", type: "comfort", tenant: "Siti Rahma", phone: "08215554443", rate: 700000, dueDay: 1, occupied: true, debt: 0 },
  { id: "04", type: "comfort", tenant: "", phone: "", rate: 700000, dueDay: 1, occupied: false, debt: 0 },
  { id: "05", type: "breeze", tenant: "Fajar Pratama", phone: "08521112223", rate: 750000, dueDay: 15, occupied: true, debt: 0 },
  { id: "06", type: "breeze", tenant: "Dewi Lestari", phone: "08137778889", rate: 750000, dueDay: 20, occupied: true, debt: 0 },
  { id: "07", type: "vip", tenant: "Hendro Wijaya", phone: "08112223334", rate: 1000000, dueDay: 25, occupied: true, debt: 0 },
  { id: "08", type: "vip", tenant: "", phone: "", rate: 1000000, dueDay: 1, occupied: false, debt: 0 },
  { id: "09", type: "vip", tenant: "Rian Saputra", phone: "08139990001", rate: 1000000, dueDay: 8, occupied: true, debt: 0 }
];

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
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
      setIsAuthenticated(Boolean(data.session));
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(Boolean(session));
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    const loadData = async () => {
      try {
        const { data: cloudRooms, error } = await supabase.from("rooms").select("*").order("id");
        if (!error && cloudRooms && cloudRooms.length > 0) {
          setRooms(cloudRooms.map((r: any) => ({
            id: r.id, type: r.type, tenant: r.tenant || "", phone: r.phone || "",
            rate: Number(r.rate) || 600000, dueDay: Number(r.due_day) || 1, occupied: Boolean(r.occupied),
            debt: Number(r.debt) || 0
          })));
        } else {
          const seedData = defaultRooms.map((r) => ({
            id: r.id, type: r.type, tenant: r.tenant, phone: r.phone,
            rate: r.rate, due_day: r.dueDay, occupied: r.occupied, debt: r.debt || 0
          }));
          await supabase.from("rooms").upsert(seedData);
          const { data: refetched } = await supabase.from("rooms").select("*").order("id");
          if (refetched) {
            setRooms(refetched.map((r: any) => ({
              id: r.id, type: r.type, tenant: r.tenant || "", phone: r.phone || "",
              rate: Number(r.rate) || 600000, dueDay: Number(r.due_day) || 1, occupied: Boolean(r.occupied),
              debt: Number(r.debt) || 0
            })));
          }
        }
      } catch (e) {}

      try {
        const { data: cloudPay, error } = await supabase
          .from("payments").select("*").eq("period", period).order("created_at", { ascending: false });
        if (!error && cloudPay) {
          setPayments(cloudPay.map((p: any) => ({
            id: p.id, roomId: p.room_id, amount: Number(p.amount), date: p.date, note: p.note || ""
          })));
        } else {
          setPayments([]);
        }
      } catch (e) {
        setPayments([]);
      }
    };

    loadData();
  }, [period, isAuthenticated]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
  };

  const handleSaveRooms = async (updated: RoomAdminData) => {
    setRooms(rooms.map((r) => (r.id === updated.id ? updated : r)));
    try {
      await supabase.from("rooms").upsert({
        id: updated.id, type: updated.type, tenant: updated.tenant, phone: updated.phone,
        rate: updated.rate, due_day: updated.dueDay, occupied: updated.occupied, debt: updated.debt || 0,
        updated_at: new Date().toISOString()
      });
    } catch (e) {}
  };

  const handleAddPayment = async (amount: number, date: string, note: string) => {
    if (!activePayRoom) return;
    const newPay: PaymentRecord = { id: "pay_" + Date.now(), roomId: activePayRoom.id, amount, date, note };
    setPayments([newPay, ...payments]);
    try {
      await supabase.from("payments").insert({
        id: newPay.id, room_id: newPay.roomId, amount: newPay.amount, date: newPay.date, note: newPay.note, period
      });
    } catch (e) {}
  };

  const handleDeletePayment = async (id: string) => {
    setPayments(payments.filter((p) => p.id !== id));
    try { await supabase.from("payments").delete().eq("id", id); } catch (e) {}
  };

  const occupiedRooms = rooms.filter((r) => r.occupied);
  const totalIncome = payments.reduce((acc, p) => acc + p.amount, 0);
  const totalTarget = occupiedRooms.reduce((acc, r) => acc + r.rate + (r.debt || 0), 0);
  const totalPending = Math.max(0, totalTarget - totalIncome);

  return (
    <div className="min-h-screen bg-background text-foreground bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(5,150,105,0.08),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.08),rgba(11,15,25,0))]">
      <AdminHeader period={period} onPeriodChange={setPeriod} onLock={handleLogout} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <StatsOverview totalIncome={totalIncome} totalPending={totalPending} occupiedCount={occupiedRooms.length} />
        
        <div>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-extrabold text-foreground tracking-tight">Status Unit 9 Kamar</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Pantau status pelunasan cicilan bulanan dan data penyewa aktif</p>
            </div>
          </div>
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
