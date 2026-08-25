"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sun, Moon, Menu, X, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [theme, setTheme] = useState("light");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("kosfitrah_theme") || "light";
    setTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("kosfitrah_theme", next);
    document.documentElement.setAttribute("data-theme", next);
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-border bg-card/85 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="#home" className="flex items-center gap-2.5">
          <Image src="/assets/logo-symbol.png?v=3.0.0" alt="Logo" width={32} height={32} className="h-8 w-auto" />
          <span className="font-extrabold text-lg tracking-tight">Kos Fitrah<span className="text-primary">.</span></span>
        </Link>
        <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-muted-foreground">
          <Link href="#kamar" className="hover:text-primary transition-colors">Tipe Kamar</Link>
          <Link href="#spesifikasi" className="hover:text-primary transition-colors">Spesifikasi</Link>
          <Link href="#peraturan" className="hover:text-primary transition-colors">Tata Tertib</Link>
          <Link href="#faq" className="hover:text-primary transition-colors">FAQ</Link>
          <Link href="#kalkulator" className="hover:text-primary transition-colors">Estimasi Biaya</Link>
          <Link href="#kontak" className="hover:text-primary transition-colors">Lokasi</Link>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={toggleTheme} aria-label="Ganti Tema" className="p-2 rounded-full">
            {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </Button>
          <Link href="/admin/">
            <Button variant="outline" size="sm" className="gap-1.5 rounded-xl border-border/80 hover:bg-primary-light hover:text-primary transition-colors">
              <Lock className="w-3.5 h-3.5" />
              <span>Login Admin</span>
            </Button>
          </Link>
          <Link href="#kalkulator" className="hidden sm:inline-flex">
            <Button size="sm">Pesan Kamar</Button>
          </Link>
          <Button variant="ghost" size="sm" onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2">
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-card px-4 py-4 space-y-3 font-semibold text-sm">
          <Link href="#kamar" onClick={() => setMenuOpen(false)} className="block py-1 hover:text-primary">Tipe Kamar</Link>
          <Link href="#spesifikasi" onClick={() => setMenuOpen(false)} className="block py-1 hover:text-primary">Spesifikasi</Link>
          <Link href="#peraturan" onClick={() => setMenuOpen(false)} className="block py-1 hover:text-primary">Tata Tertib</Link>
          <Link href="#faq" onClick={() => setMenuOpen(false)} className="block py-1 hover:text-primary">FAQ</Link>
          <Link href="#kalkulator" onClick={() => setMenuOpen(false)} className="block py-1 hover:text-primary">Estimasi Biaya</Link>
          <Link href="#kontak" onClick={() => setMenuOpen(false)} className="block py-1 hover:text-primary">Lokasi</Link>
          <Link href="/admin/" onClick={() => setMenuOpen(false)} className="block py-1 text-primary flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" />
            <span>Login Admin</span>
          </Link>
        </div>
      )}
    </nav>
  );
}
