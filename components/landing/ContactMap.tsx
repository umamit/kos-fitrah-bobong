import React from "react";
import { MapPin, Phone, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ContactMap() {
  return (
    <div className="bg-muted/50 py-20 border-y border-border" id="kontak">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">Lokasi & Kontak</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">Akses Mudah di Bobong</h2>
          <p className="text-sm sm:text-base text-muted-foreground">Terletak strategis di pusat kota Bobong, dekat dengan fasilitas publik dan perkantoran.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-6">
            <Card className="p-6 space-y-3">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center flex-shrink-0 border border-primary/20">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-base">Alamat Utama</h4>
                  <p className="text-sm text-muted-foreground mt-1">Bobong, Kec. Taliabu Barat, Kabupaten Pulau Taliabu, Maluku Utara.</p>
                  <p className="text-xs text-muted-foreground mt-2">Akses jalan utama mudah dijangkau kendaraan roda dua maupun roda empat.</p>
                </div>
              </div>
            </Card>
            <Card className="p-6 space-y-3">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center flex-shrink-0 border border-primary/20">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-base">Pengelola / Narahubung</h4>
                  <p className="text-sm font-semibold text-foreground mt-1">Kak Ona: +62 813-5700-1357</p>
                  <p className="text-xs text-muted-foreground mt-2">Hubungi via WhatsApp atau telepon langsung untuk survei unit kamar.</p>
                </div>
              </div>
            </Card>
            <a href="https://maps.google.com/?q=Bobong,+Pulau+Taliabu" target="_blank" rel="noopener noreferrer" className="block">
              <Button variant="secondary" className="w-full gap-2">
                <ExternalLink className="w-4 h-4" />
                Buka Navigasi di Aplikasi Google Maps
              </Button>
            </a>
          </div>
          <Card className="overflow-hidden p-0 border border-border shadow-lg">
            <div className="p-4 bg-card border-b border-border flex justify-between items-center">
              <h4 className="font-bold text-sm text-foreground">Google Maps Interaktif</h4>
              <span className="text-xs font-semibold text-primary">Pusat Kota Bobong</span>
            </div>
            <div className="p-4 bg-muted/40">
              <iframe
                src="https://maps.google.com/maps?q=Bobong,+Taliabu+Barat,+Pulau+Taliabu&t=&z=15&ie=UTF8&iwloc=&output=embed"
                className="w-full h-[280px] rounded-xl border border-border"
                title="Google Maps Kos Fitrah"
                loading="lazy"
                allowFullScreen
              />
              <p className="text-xs text-muted-foreground mt-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary inline-block animate-pulse" />
                Hanya 5 menit dari Pelabuhan Bobong dan dekat pusat perkantoran Pulau Taliabu.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
