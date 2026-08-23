import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <header className="relative overflow-hidden py-16 md:py-24 bg-gradient-to-b from-emerald-500/5 via-transparent to-transparent" id="home">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary bg-primary-light px-3.5 py-1.5 rounded-full w-fit border border-primary/20">
            <MapPin className="w-3.5 h-3.5" />
            Bobong, Pulau Taliabu
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]">
            Hunian Tenang Tanpa Gangguan, Privasi Anda Terjaga Penuh
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Nikmati suasana kos yang hening, bersih, privat, dan bebas antre. Tanpa area komunal (dapur bersama/tempat cuci) yang bising dan berantakan, Kos Fitrah didesain khusus bagi Anda yang mengutamakan kenyamanan istirahat maksimal di Bobong.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link href="#kamar">
              <Button size="lg">Lihat Pilihan Kamar</Button>
            </Link>
            <Link href="#spesifikasi">
              <Button variant="secondary" size="lg">Pelajari Fasilitas</Button>
            </Link>
          </div>
        </div>
        <div className="relative">
          <div className="relative h-[320px] sm:h-[400px] w-full rounded-2xl overflow-hidden shadow-2xl border border-border">
            <Image src="/assets/hero.jpg" alt="Eksterior Modern Kos Fitrah Bobong" fill priority className="object-cover hover:scale-105 transition-transform duration-700" />
          </div>
        </div>
      </div>
    </header>
  );
}
