import React from "react";
import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card py-12 text-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-3 md:col-span-2">
          <div className="flex items-center gap-2">
            <Image src="/assets/logo-symbol.png?v=3.0.0" alt="Logo" width={28} height={28} className="h-7 w-auto" />
            <span className="font-extrabold text-base tracking-tight">Kos Fitrah<span className="text-primary">.</span></span>
          </div>
          <p className="text-muted-foreground text-xs sm:text-sm max-w-md leading-relaxed">
            Hunian sewa kos harian dan bulanan dengan kamar mandi dalam privat di Bobong, Pulau Taliabu. Mengedepankan ketenangan, privasi, dan kenyamanan istirahat Anda.
          </p>
        </div>
        <div className="space-y-2">
          <h4 className="font-bold text-foreground text-xs uppercase tracking-wider">Navigasi</h4>
          <ul className="space-y-1.5 text-xs text-muted-foreground">
            <li><Link href="#kamar" className="hover:text-primary">Pilihan Kamar</Link></li>
            <li><Link href="#spesifikasi" className="hover:text-primary">Spesifikasi</Link></li>
            <li><Link href="#peraturan" className="hover:text-primary">Tata Tertib</Link></li>
            <li><Link href="#faq" className="hover:text-primary">FAQ</Link></li>
            <li><Link href="#kalkulator" className="hover:text-primary">Simulasi Sewa</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-8 pt-6 border-t border-border text-center text-xs text-muted-foreground">
        <p>&copy; 2026 Kos Fitrah Bobong. Seluruh Hak Cipta Dilindungi. Developed by <a href="https://ibradigital.id" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline">ibradigital.id</a>.</p>
      </div>
    </footer>
  );
}
