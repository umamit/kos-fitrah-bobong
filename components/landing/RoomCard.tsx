import React from "react";
import Image from "next/image";
import { Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface RoomProps {
  tag: string;
  image: string;
  title: string;
  desc: string;
  facilities: string[];
  dayPrice: string;
  monthPrice: string;
  yearPrice: string;
  roomKey: string;
  onSelect?: (key: string) => void;
}

export function RoomCard({ tag, image, title, desc, facilities, dayPrice, monthPrice, yearPrice, roomKey, onSelect }: RoomProps) {
  return (
    <Card className="overflow-hidden flex flex-col hover:shadow-xl hover:border-primary/40 transition-all group">
      <div className="relative h-52 w-full overflow-hidden bg-muted">
        <Badge variant={roomKey === "vip" ? "primary" : "muted"} className="absolute top-3 left-3 z-10 shadow-md">
          {tag}
        </Badge>
        <Image src={image} alt={title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
      </div>
      <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
          <ul className="space-y-2 pt-2 border-t border-border/60">
            {facilities.map((fac, idx) => (
              <li key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-foreground">
                <Check className="w-4 h-4 text-primary flex-shrink-0" />
                {fac}
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-4 pt-4 border-t border-border">
          <div className="grid grid-cols-3 gap-2 bg-muted/60 p-3 rounded-xl border border-border text-center">
            <div><span className="block text-[10px] text-muted-foreground uppercase font-bold">Harian</span><span className="text-xs sm:text-sm font-extrabold text-foreground">{dayPrice}</span></div>
            <div><span className="block text-[10px] text-muted-foreground uppercase font-bold">Bulanan</span><span className="text-xs sm:text-sm font-extrabold text-primary">{monthPrice}</span></div>
            <div><span className="block text-[10px] text-muted-foreground uppercase font-bold">Tahunan</span><span className="text-xs sm:text-sm font-extrabold text-foreground">{yearPrice}</span></div>
          </div>
          <Button className="w-full" onClick={() => onSelect?.(roomKey)}>Pilih Kamar Ini</Button>
        </div>
      </div>
    </Card>
  );
}
