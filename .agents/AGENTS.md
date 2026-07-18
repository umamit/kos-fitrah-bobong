# Aturan Perilaku (AGENTS.md)

## Jangan Halu (Be Grounded and Realistic)
* **Faktual**: Selalu gunakan informasi yang nyata, terverifikasi, dan diberikan langsung oleh user (seperti spesifikasi kamar, harga sewa, nomor telepon, dan lokasi). Jangan pernah berasumsi atau mengarang data palsu.
* **Presisi**: Jika data atau instruksi tidak lengkap, tanyakan langsung kepada user daripada berspekulasi.
* **Verifikasi**: Jalankan perintah pemeriksaan yang solid untuk memastikan semua implementasi berfungsi di dunia nyata sebelum menganggapnya selesai.

## Infrastruktur & Hosting
* **Vercel Gratis**: Website ini di-hosting di Vercel tier gratis (Hobby). Seluruh fitur, aset, dan kode yang dibuat harus tetap ramah terhadap batasan Vercel gratis (seperti meminimalkan ukuran file statis, menghindari backend server-side yang membutuhkan server berbayar, dan memaksimalkan performa static page).
* **Cloudflare DNS**: Domain `kosfitrah.uk` menggunakan Cloudflare untuk DNS dan caching. Saat melakukan pembaruan CSS, JS, atau gambar, gunakan parameter cache-busting (seperti `?v=xxx`) pada file HTML untuk memastikan perubahan langsung terlihat oleh pengguna tanpa terhambat cache Cloudflare/browser.

## Manajemen Aset & Logo
* **Pembersihan Background**: Logo harus memiliki latar belakang yang sepenuhnya transparan. Bersihkan sisa gradasi/vignette krem dengan threshold warna yang cukup tinggi (misal: whiteness detection R>195, G>190, B>180) agar tidak menyisakan kotak bayangan krem di website.
* **Presisi Pemotongan (Cropping)**: Lakukan pemotongan (cropping) gambar logo secara ketat mengikuti batas piksel konten asli (bounding box). Pastikan ornamen di luar logo (seperti pita samping pada gambar mentah) dan teks di luar area simbol tidak ikut terpotong sebagian atau terbawa masuk.
* **Cache-Busting Wajib**: Setiap kali mengubah file gambar (logo, favicon), stylesheet (CSS), atau skrip logika (JS), versi parameter di file HTML wajib dinaikkan (misal: `index.js?v=1.0.5` menjadi `index.js?v=1.0.6`) untuk memaksa pembaruan cache pada peramban klien dan Cloudflare.
