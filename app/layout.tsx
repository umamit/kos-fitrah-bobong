import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kos Fitrah Bobong - Sewa Kos Harian & Bulanan Pulau Taliabu",
  description: "Kos Fitrah Bobong menyediakan sewa kamar kos harian & bulanan di Bobong, Pulau Taliabu. Kamar mandi dalam privat, AC/Kipas, bersih, tenang tanpa bising fasilitas komunal. Tarif mulai 100rb/hari.",
  metadataBase: new URL("https://kosfitrah.uk"),
  icons: {
    icon: "/assets/logo-symbol.png?v=3.0.0",
    apple: "/assets/logo-symbol.png?v=3.0.0"
  },
  openGraph: {
    title: "Kos Fitrah Bobong - Sewa Kos Harian & Bulanan Pulau Taliabu",
    description: "Kos Fitrah Bobong menyediakan sewa kamar kos harian & bulanan di Bobong, Pulau Taliabu. Kamar mandi dalam privat, AC/Kipas, bersih, tenang.",
    url: "https://kosfitrah.uk",
    siteName: "Kos Fitrah",
    images: [{ url: "/assets/logo.png?v=3.0.0" }],
    type: "website"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Kos Fitrah" />
        <meta name="theme-color" content="#059669" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Kos Fitrah",
              alternateName: ["Kos Fitrah Bobong", "Kos Fitrah Taliabu"],
              url: "https://kosfitrah.uk/"
            })
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
