import React from "react";
import { ShieldCheck, Wifi, Sparkles, Key, SunMedium, Bike } from "lucide-react";
import { Card } from "@/components/ui/card";

const specs = [
  { icon: Bike, title: "Parkir Motor Luas & Aman", desc: "Halaman parkir khusus kendaraan roda dua tepat di depan kamar, memudahkan mobilitas harian Anda." },
  { icon: SunMedium, title: "Jemuran Pakaian Mandiri", desc: "Area jemuran pakaian mandiri tersedia di area ventilasi masing-masing unit tanpa campur pakaian orang lain." },
  { icon: Key, title: "Privasi & Kebebasan Maksimal", desc: "Setiap penyewa memegang kunci kamar dan gerbang sendiri. Bebas jam malam dengan tetap saling menghormati." },
  { icon: Sparkles, title: "Bebas Antre & Bebas Konflik", desc: "Tidak ada dapur umum atau tempat cuci bersama yang rawan berantakan, memastikan lingkungan tetap bersih dan higienis." },
  { icon: Wifi, title: "Wi-Fi Cepat 100 Mbps", desc: "Nikmati koneksi internet nirkabel gratis super cepat hingga 100 Mbps di seluruh area kos untuk kerja dan hiburan." },
  { icon: ShieldCheck, title: "Lingkungan Tenang & Nyaman", desc: "Suasana hunian yang hening, kondusif untuk istirahat optimal bagi para pekerja dan profesional di Bobong." }
];

export function Specs() {
  return (
    <div className="bg-muted/50 py-20 border-y border-border" id="spesifikasi">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">Spesifikasi Praktis</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">Mengapa Memilih Kos Fitrah?</h2>
          <p className="text-sm sm:text-base text-muted-foreground">Hunian yang mengutamakan fungsi, privasi, dan ketenangan Anda selama tinggal di Bobong.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {specs.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Card key={idx} className="p-6 space-y-4 hover:shadow-md hover:border-primary/30 transition-all">
                <div className="w-12 h-12 rounded-xl bg-primary-light text-primary flex items-center justify-center border border-primary/20">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
