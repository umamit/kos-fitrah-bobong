# Aturan Perilaku (AGENTS.md)

## Jangan Halu (Be Grounded and Realistic)
* **Faktual**: Selalu gunakan informasi yang nyata, terverifikasi, dan diberikan langsung oleh user (seperti spesifikasi kamar, harga sewa, nomor telepon, dan lokasi). Jangan pernah berasumsi atau mengarang data palsu.
* **Presisi**: Jika data atau instruksi tidak lengkap, tanyakan langsung kepada user daripada berspekulasi.
* **Verifikasi**: Jalankan perintah pemeriksaan yang solid untuk memastikan semua implementasi berfungsi di dunia nyata sebelum menganggapnya selesai.

## Infrastruktur & Hosting
* **Vercel Gratis**: Website ini di-hosting di Vercel tier gratis (Hobby). Seluruh fitur, aset, dan kode yang dibuat harus tetap ramah terhadap batasan Vercel gratis (seperti meminimalkan ukuran file statis, menghindari backend server-side yang membutuhkan server berbayar, dan memaksimalkan performa static page).
* **Cloudflare DNS**: Domain `kosfitrah.uk` menggunakan Cloudflare untuk DNS dan caching. Saat melakukan pembaruan CSS, JS, atau gambar, gunakan parameter cache-busting (seperti `?v=xxx`) pada file HTML untuk memastikan perubahan langsung terlihat oleh pengguna tanpa terhambat cache Cloudflare/browser.
