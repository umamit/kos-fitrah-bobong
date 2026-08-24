"use client";

import React, { useState, useEffect } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { StatsOverview } from "@/components/admin/StatsOverview";
import { RoomCardAdmin, type RoomAdminData } from "@/components/admin/RoomCardAdmin";
import { PaymentModal, type PaymentRecord } from "@/components/admin/PaymentModal";
import { EditRoomModal } from "@/components/admin/EditRoomModal";
import { AddRoomModal } from "@/components/admin/AddRoomModal";
import { LoginOverlay } from "@/components/admin/LoginOverlay";
import { TransactionHistory } from "@/components/admin/TransactionHistory";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [period, setPeriod] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });

  const [rooms, setRooms] = useState<RoomAdminData[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [activePayRoom, setActivePayRoom] = useState<RoomAdminData | null>(null);
  const [activeEditRoom, setActiveEditRoom] = useState<RoomAdminData | null>(null);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [loading, setLoading] = useState(true);

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
      setLoading(true);
      try {
        const { data: cloudRooms, error } = await supabase.from("rooms").select("*").order("id");
        if (!error && cloudRooms) {
          setRooms(cloudRooms.map((r: any) => ({
            id: r.id, type: r.type, tenant: r.tenant || "", phone: r.phone || "",
            rate: Number(r.rate) || 600000, dueDay: Number(r.due_day) || 1, occupied: Boolean(r.occupied),
            debt: Number(r.debt) || 0
          })));
        }
      } catch (e) {}

      try {
        const { data: cloudPay, error } = await supabase
          .from("payments").select("*").eq("period", period).order("date", { ascending: false });
        if (!error && cloudPay) {
          setPayments(cloudPay.map((p: any) => ({
            id: p.id, roomId: p.room_id, amount: Number(p.amount), date: p.date, note: p.note || ""
          })));
        } else {
          setPayments([]);
        }
      } catch (e) {
        setPayments([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [period, isAuthenticated]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
  };

  const handleAddRoom = async (id: string, type: string, rate: number, dueDay: number) => {
    const newRoom: RoomAdminData = { id, type, rate, dueDay, tenant: "", phone: "", occupied: false, debt: 0 };
    setRooms([...rooms, newRoom].sort((a, b) => a.id.localeCompare(b.id)));
    try {
      await supabase.from("rooms").insert({
        id, type, rate, due_day: dueDay, tenant: "", phone: "", occupied: false, debt: 0
      });
    } catch (e) {}
  };

  const handleDeleteRoom = async (id: string) => {
    setRooms(rooms.filter((r) => r.id !== id));
    try {
      await supabase.from("rooms").delete().eq("id", id);
      await supabase.from("payments").delete().eq("room_id", id);
    } catch (e) {}
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

  if (isAuthenticated === null) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-sm font-semibold text-muted-foreground">Memverifikasi keamanan sesi...</div>;
  }

  if (!isAuthenticated) {
    return <LoginOverlay onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(5,150,105,0.08),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.08),rgba(11,15,25,0))]">
      <AdminHeader period={period} onPeriodChange={setPeriod} onLock={handleLogout} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <StatsOverview totalIncome={totalIncome} totalPending={totalPending} occupiedCount={occupiedRooms.length} />
        
        {loading ? (
          <div className="py-20 text-center text-sm text-muted-foreground font-semibold">Mengambil data langsung dari Supabase...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-extrabold text-foreground tracking-tight">Status Unit Kamar</h2>
                  <p className="text-xs text-muted-foreground mt-0.5 font-medium">Jumlah terdaftar: {rooms.length} Kamar</p>
                </div>
                <Button onClick={() => setOpenAddModal(true)} size="sm" className="gap-1.5 rounded-xl">
                  <Plus className="w-4 h-4" />
                  Tambah Kamar
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <div className="lg:sticky lg:top-24">
              <TransactionHistory payments={payments} rooms={rooms} />
            </div>
          </div>
        )}
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
        onDelete={handleDeleteRoom}
      />
      <AddRoomModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onAdd={handleAddRoom}
      />
    </div>
  );
}
