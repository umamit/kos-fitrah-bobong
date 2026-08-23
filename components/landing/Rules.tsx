import React from "react";
import { Card } from "@/components/ui/card";

const rules = [
  { no: "01", title: "Kapasitas Maksimal", desc: "Satu kamar hanya diperuntukkan maksimal 2 (dua) orang penghuni." },
  { no: "02", title: "Kebijakan Tamu", desc: "Tamu bebas berkunjung (termasuk lawan jenis) dengan tetap menjaga sopan santun dan etika bertetangga." },
  { no: "03", title: "Kebersihan Pintu Keluar", desc: "Dilarang keras membuang atau meninggalkan sampah di samping pintu keluar kos. Gunakan tempat sampah utama." },
  { no: "04", title: "Ketenangan Lingkungan", desc: "Kegaduhan berulang yang mengganggu penghuni lain setelah ditegur akan dikeluarkan secara tegas tanpa uang kembali." },
  { no: "05", title: "Perlindungan Inventaris", desc: "Dilarang membawa pergi atau menukar fasilitas/inventaris kos (kipas angin, bohlam lampu, sprei, kasur, bantal, ember) saat keluar atau pindah." },
  { no: "06", title: "Keamanan Barang Pribadi", desc: "Pengelola tidak bertanggung jawab atas kehilangan barang berharga pribadi. Selalu kunci kamar saat bepergian." },
  { no: "07", title: "Kerapian Area Parkir", desc: "Parkir kendaraan roda dua secara tertib pada jalur yang disediakan agar tidak menghalangi akses keluar-masuk kamar lain." },
  { no: "08", title: "Kebijakan Pembatalan / Keluar Awal", desc: "Tidak ada pengembalian dana (no refund) bagi penyewa yang memutuskan keluar atau berhenti sewa sebelum masa sewa berakhir." }
];

export function Rules() {
  return (
    <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6" id="peraturan">
      <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-primary">Tata Tertib</span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">Aturan Hunian Bersama</h2>
        <p className="text-sm sm:text-base text-muted-foreground">Aturan sederhana demi kenyamanan, keamanan, dan ketenangan seluruh penghuni Kos Fitrah.</p>
      </div>
      <Card className="divide-y divide-border overflow-hidden">
        {rules.map((rule, idx) => (
          <div key={idx} className="p-5 sm:p-6 flex items-start gap-5 hover:bg-muted/40 transition-colors">
            <span className="font-extrabold text-lg sm:text-xl text-primary/70 tracking-tight flex-shrink-0">{rule.no}</span>
            <div className="space-y-1">
              <h4 className="font-bold text-foreground text-base">{rule.title}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{rule.desc}</p>
            </div>
          </div>
        ))}
      </Card>
    </section>
  );
}
