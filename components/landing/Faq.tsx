"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const faqs = [
  { q: "Bagaimana cara melakukan survei atau memesan kamar?", a: "Pilih kamar melalui kalkulator di bawah, lalu klik 'Ajukan Pemesanan via WhatsApp'. Pengelola akan segera mengonfirmasi ketersediaan dan jadwal kunjungan." },
  { q: "Apakah ada biaya tambahan untuk listrik dan air?", a: "Biaya sewa sudah mencakup penggunaan air bersih dan pemakaian listrik normal. Pemakaian peralatan elektronik berdaya tinggi tertentu dapat didiskusikan langsung." },
  { q: "Apakah ada jam malam di Kos Fitrah?", a: "Tidak ada jam malam kaku. Penghuni bebas keluar masuk dengan kunci masing-masing, asalkan menjaga ketertiban dan tidak mengganggu waktu istirahat tetangga kamar." },
  { q: "Berapa kapasitas maksimal dalam satu kamar?", a: "Sesuai tata tertib, kapasitas maksimal adalah 2 (dua) orang per kamar demi kenyamanan dan ketenangan bersama." }
];

export function Faq() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div className="bg-muted/50 py-20 border-y border-border" id="faq">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">Tanya Jawab</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">Pertanyaan yang Sering Diajukan</h2>
          <p className="text-sm sm:text-base text-muted-foreground">Informasi lengkap seputar penyewaan dan kenyamanan tinggal di Kos Fitrah.</p>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <Card key={idx} className="overflow-hidden border border-border">
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-5 text-left font-bold text-foreground flex items-center justify-between gap-4 hover:bg-muted/50 transition-colors"
                >
                  <span className="text-base sm:text-lg">{faq.q}</span>
                  <ChevronDown className={cn("w-5 h-5 text-muted-foreground transition-transform duration-300 flex-shrink-0", isOpen && "rotate-180 text-primary")} />
                </button>
                {isOpen && (
                  <div className="p-5 pt-0 text-sm sm:text-base text-muted-foreground leading-relaxed border-t border-border/40 mt-2">
                    {faq.a}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
