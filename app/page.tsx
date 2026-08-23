import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { RoomGrid } from "@/components/landing/RoomGrid";
import { Specs } from "@/components/landing/Specs";
import { Rules } from "@/components/landing/Rules";
import { Faq } from "@/components/landing/Faq";
import { Calculator } from "@/components/landing/Calculator";
import { ContactMap } from "@/components/landing/ContactMap";
import { Footer } from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      <Navbar />
      <Hero />
      <RoomGrid />
      <Specs />
      <Rules />
      <Faq />
      <Calculator />
      <ContactMap />
      <Footer />
    </main>
  );
}
