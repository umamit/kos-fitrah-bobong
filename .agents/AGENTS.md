# Aturan Perilaku (AGENTS.md)

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

## Kualitas Kode CSS & JS
* **Batas Panjang File & Fungsi (Maks 150 Baris)**: Setiap file modul, komponen kode, atau fungsi tidak boleh melebihi **150 baris** (150L). Jika mendekati atau melampaui batas ini, wajib dipecah menjadi modul atau fungsi pembantu yang lebih kecil dan terfokus.
* **1 Kode 1 Fungsi (Single Responsibility)**: Setiap blok kode, file modul, atau fungsi hanya boleh memiliki satu tugas atau tanggung jawab spesifik. Hindari mencampuradukkan berbagai logika yang tidak terkait dalam satu fungsi atau file yang sama.
* **Struktur CSS Modular**: CSS website ini dibagi ke dalam file-file modular dengan peran yang jelas — jangan menggabungkannya kembali menjadi satu file monolitik:
  * `base.css` — Variabel global, reset CSS, tipografi, komponen dasar (tombol, navbar, layout umum).
  * `sections.css` — Gaya tiap seksi utama halaman (Hero, Kamar, Spesifikasi, Tata Tertib).
  * `components.css` — Komponen interaktif (FAQ accordion, kalkulator, peta kontak, footer) dan semua media query responsif.
* **Don't Repeat Yourself (DRY)**: Gunakan CSS Custom Properties (`--nama-variabel`) untuk warna, shadow, radius, dan transisi. Jangan menulis nilai statis (seperti warna hex) berulang di berbagai selector jika sudah tersedia sebagai variabel.
* **Vanilla JS Only**: Website ini menggunakan HTML, CSS, dan JS murni. Jangan menambahkan framework atau library eksternal (Tailwind, Bootstrap, React, Vue, dll.) yang membebani ukuran file dan performa.


