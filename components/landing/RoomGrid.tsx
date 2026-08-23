"use client";

import React from "react";
import { RoomCard, type RoomProps } from "./RoomCard";

const rooms: Omit<RoomProps, "onSelect">[] = [
  {
    tag: "Standard Lite",
    image: "/assets/room_basic.jpg",
    title: "Kamar Standard Lite (Basic)",
    desc: "Pilihan hemat, praktis, dan esensial. Sangat ideal untuk Anda yang memprioritaskan efisiensi anggaran dan tempat istirahat yang bersih, tenang, serta privat.",
    facilities: [
      "Kamar Mandi Dalam Privat (Tanpa Antre)",
      "Koneksi Wi-Fi 100 Mbps (Gratis)",
      "Ventilasi Udara Alami yang Sehat",
      "Kasur Busa Nyaman + Bantal & Sprei",
      "Kipas Angin Dinding",
      "Lemari Pakaian Minimalis"
    ],
    dayPrice: "Rp 100rb",
    monthPrice: "Rp 600rb",
    yearPrice: "Rp 6,6jt",
    roomKey: "basic"
  },
  {
    tag: "Standard Plus",
    image: "/assets/room_comfort.jpg",
    title: "Kamar Eco Comfort (Standard Plus)",
    desc: "Kenyamanan lebih dengan perabot kokoh buatan tangan dan sirkulasi udara optimal. Dirancang untuk durasi tinggal lebih lama yang bebas stres.",
    facilities: [
      "Kamar Mandi Dalam Privat (Tanpa Antre)",
      "Koneksi Wi-Fi 100 Mbps (Gratis)",
      "Jendela Pencahayaan Alami Segar",
      "Kasur Busa Berkualitas & Sprei Bersih",
      "Kipas Angin Dinding Efisien",
      "Lemari Pakaian Handmade Kokoh"
    ],
    dayPrice: "Rp 100rb",
    monthPrice: "Rp 700rb",
    yearPrice: "Rp 7,7jt",
    roomKey: "comfort"
  },
  {
    tag: "Standard Premium",
    image: "/assets/room_standard.jpg",
    title: "Kamar Eco Breeze (Standard Premium)",
    desc: "Ruang yang lapang dan tenang dengan pencahayaan alami yang melimpah. Sangat pas untuk pekerja atau profesional yang butuh suasana rileks sepulang kerja.",
    facilities: [
      "Kamar Mandi Dalam Privat (Tanpa Antre)",
      "Koneksi Wi-Fi 100 Mbps (Gratis)",
      "Ventilasi & Pencahayaan Optimal",
      "Kasur Tebal Nyaman + Bantal & Sprei",
      "Kipas Angin Dinding",
      "Lemari Pakaian Handmade Luas"
    ],
    dayPrice: "Rp 100rb",
    monthPrice: "Rp 750rb",
    yearPrice: "Rp 8,25jt",
    roomKey: "breeze"
  },
  {
    tag: "Deluxe VIP",
    image: "/assets/room_vip.jpg",
    title: "Kamar Executive VIP (Deluxe AC)",
    desc: "Tipe kamar terbaik dengan penyejuk udara (AC). Memberikan ketenangan mutlak, suhu sejuk setiap saat, dan privasi penuh kelas eksekutif.",
    facilities: [
      "Penyejuk Udara (Air Conditioner / AC)",
      "Kamar Mandi Dalam Privat (Tanpa Antre)",
      "Koneksi Wi-Fi 100 Mbps (Gratis)",
      "Kasur Premium Empuk & Nyaman",
      "Lemari Pakaian Handmade",
      "Lingkungan Paling Hening & Privat"
    ],
    dayPrice: "Rp 150rb",
    monthPrice: "Rp 1.000rb",
    yearPrice: "Rp 11jt",
    roomKey: "vip"
  }
];

export function RoomGrid() {
  const handleSelect = (key: string) => {
    const el = document.getElementById("tipe-kamar") as HTMLSelectElement;
    if (el) el.value = key;
    document.getElementById("kalkulator")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6" id="kamar">
      <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-primary">Kamar Kos</span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">Pilihan Tipe Kamar</h2>
        <p className="text-sm sm:text-base text-muted-foreground">Pilih tipe hunian yang paling sesuai dengan kebutuhan harian dan kenyamanan Anda.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {rooms.map((room, idx) => (
          <RoomCard key={idx} {...room} onSelect={handleSelect} />
        ))}
      </div>
      <p className="text-center text-xs text-muted-foreground mt-8">
        *Harga sewa sudah termasuk fasilitas dasar kamar dan air bersih. Tidak ada biaya deposit/jaminan di awal.
      </p>
    </section>
  );
}
