# Aturan Perilaku (AGENTS.md)

## Persona & Filosofi Rekayasa (MIT Graduate Level)
* **First Principles & Rigor Ilmiah**: Setiap solusi teknis, struktur arsitektur, dan algoritma dibangun dari prinsip dasar komputasi yang efisien, terukur secara matematis, dan minim kompleksitas (*Occam's Razor*).
* **Komunikasi Tajam & Padat**: Menyajikan penjelasan teknis yang presisi, to-the-point, tanpa basa-basi retoris, serta selalu berorientasi pada eksekusi dan verifikasi empiris (*data-driven*).
* **Zero Technical Debt**: Tidak mentolerir kode berantakan (*code smell*), modul monolitik, atau dependensi redundan. Menjaga arsitektur tetap bersih, modular, dan teruji.

## Jangan Halu (Be Grounded and Realistic)
* **Faktual**: Selalu gunakan informasi yang nyata, terverifikasi, dan diberikan langsung oleh user (seperti spesifikasi kamar, harga sewa, nomor telepon, dan lokasi). Jangan pernah berasumsi atau mengarang data palsu.
* **Tata Tertib & Fakta Kos**: Aturan operasional kos yang harus dijaga keasliannya di website: (1) 1 Kamar maks 2 orang; (2) Tamu bebas berkunjung (termasuk lawan jenis); (3) Dilarang membuang/meninggalkan sampah di samping pintu keluar kos; (4) Kegaduhan berulang setelah ditegur akan dikeluarkan tanpa uang kembali; (5) Dilarang membawa pergi atau menukar fasilitas/inventaris kos (seperti kipas angin, bohlam lampu, sprei, kasur, bantal, ember) saat keluar/pindah; (6) Tidak ada pengembalian dana (no refund) jika penyewa keluar sebelum masa sewa berakhir.
* **Presisi**: Jika data atau instruksi tidak lengkap, tanyakan langsung kepada user daripada berspekulasi.
* **Verifikasi**: Jalankan perintah pemeriksaan yang solid untuk memastikan semua implementasi berfungsi di dunia nyata sebelum menganggapnya selesai.

## Infrastruktur & Hosting
* **Vercel Gratis**: Website ini di-hosting di Vercel tier gratis (Hobby). Seluruh fitur, aset, dan kode yang dibuat harus tetap ramah terhadap batasan Vercel gratis (seperti meminimalkan ukuran file statis, menghindari backend server-side yang membutuhkan server berbayar, dan memaksimalkan performa static page).
* **Cloudflare DNS**: Domain `kosfitrah.uk` menggunakan Cloudflare untuk DNS dan caching. Saat melakukan pembaruan CSS, JS, atau gambar, gunakan parameter cache-busting (seperti `?v=xxx`) pada file HTML untuk memastikan perubahan langsung terlihat oleh pengguna tanpa terhambat cache Cloudflare/browser.

## Manajemen Aset & Logo
* **Pembersihan Background**: Logo harus memiliki latar belakang yang sepenuhnya transparan. Bersihkan sisa gradasi/vignette krem dengan threshold warna yang cukup tinggi (misal: whiteness detection R>195, G>190, B>180) agar tidak menyisakan kotak bayangan krem di website.
* **Presisi Pemotongan (Cropping)**: Lakukan pemotongan (cropping) gambar logo secara ketat mengikuti batas piksel konten asli (bounding box). Pastikan ornamen di luar logo (seperti pita samping pada gambar mentah) dan teks di luar area simbol tidak ikut terpotong sebagian atau terbawa masuk.
* **Cache-Busting Wajib**: Setiap kali mengubah file gambar (logo, favicon), stylesheet (CSS), atau skrip logika (JS), versi parameter di file HTML wajib dinaikkan ke nomor versi baru yang unik/belum pernah digunakan (misal: `index.js?v=1.0.6` menjadi `index.js?v=1.0.7`). Jangan pernah menggunakan kembali nomor versi cache-busting yang sudah ada setelah file diubah, karena peramban klien/Cloudflare akan mengabaikan pembaruan tersebut.

## Kualitas Kode & Arsitektur Framework
* **Batas Panjang File & Fungsi (Maks 150 Baris)**: Setiap file modul, komponen `.astro`, skrip JavaScript, atau stylesheet CSS tidak boleh melebihi **150 baris** (150L). Jika mendekati atau melampaui batas ini, wajib dipecah menjadi subkomponen atau fungsi pembantu yang lebih kecil dan terfokus.
* **1 Kode 1 Fungsi (Single Responsibility)**: Setiap blok kode, file modul, atau komponen hanya boleh memiliki satu tugas atau tanggung jawab spesifik.
* **Framework Astro & Islands Architecture**: Website ini menggunakan **Astro Framework** dengan prinsip *Zero-JS by Default* untuk landing page publik (`index.astro`), dan *Client Islands* interaktif untuk kalkulator serta dashboard admin (`admin.astro`).
* **Struktur Kode Terorganisir**:
  * `src/components/` — Komponen UI modular (Navbar, Hero, RoomGrid, Specs, Rules, Faq, Calculator, ContactMap, Footer).
  * `src/layouts/` — Template halaman dasar (SEO, meta tags, schema JSON-LD, font).
  * `src/pages/` — Rute halaman publik dan dashboard admin.
  * `src/styles/` — Modul CSS terpisah (variables, base, navbar, hero, rooms, calculator, admin, responsive).
  * `src/lib/` — Helper logika murni (Supabase client, theme, auth, ledger).
* **Don't Repeat Yourself (DRY)**: Gunakan CSS Custom Properties (`--nama-variabel`) untuk warna, shadow, radius, dan transisi. Gunakan props pada komponen Astro untuk menghindari duplikasi markup HTML.
* **Konektivitas Cloud & Supabase**: Dashboard admin terhubung dengan database cloud Supabase menggunakan REST API ringan tanpa dependensi pustaka berat. Kredensial sensitif disimpan di `.env.local` dan wajib terdaftar di `.gitignore`.
