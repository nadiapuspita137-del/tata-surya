BOLAPELANGI2 — TATA SURYA 3D
================================

Isi folder:
- index.html                 Halaman utama
- assets/css/style.css       Tampilan dan responsif
- assets/js/main.js          Tata surya dan interaksi 3D
- assets/images/logo.png     Logo pusat tata surya

CARA UPLOAD KE CLOUDFLARE PAGES (DIRECT UPLOAD)
1. Ekstrak ZIP ini.
2. Masuk ke Cloudflare Dashboard > Workers & Pages.
3. Pilih Create > Pages > Upload assets.
4. Tarik seluruh folder source-package atau unggah ZIP ini.
5. Klik Deploy site.

CARA TES DI KOMPUTER
Karena JavaScript memakai module, jalankan melalui server lokal.
Contoh dengan VS Code: pasang Live Server, lalu klik Open with Live Server.
Atau dengan terminal: python -m http.server 8080
Kemudian buka http://localhost:8080

CATATAN
- Tidak memakai database atau backend.
- Three.js dimuat dari jsDelivr CDN.
- Logo dapat diganti di assets/images/logo.png, pertahankan nama filenya.
- Ubah nama/deskripsi planet di assets/js/main.js pada bagian const data.
