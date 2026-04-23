# Laporan Audit UX & Inkonsistensi UI SIMPAH

Berdasarkan audit komprehensif pada portal publik aplikasi SIMPAH, ditemukan beberapa area yang memiliki inkonsistensi dari segi User Experience (UX) dan antarmuka pengguna (UI). Berikut adalah temuan utama beserta rekomendasinya:

## 1. Inkonsistensi Desain Antar Halaman (Edukasi vs Galeri)
- **Temuan**: Halaman **Edukasi** menggunakan desain premium dengan gambar nyata, animasi *Ken Burns* (gambar bergerak perlahan), dan penempatan ikon di dalam lingkaran (*badge*). Di sisi lain, halaman **Galeri** masih menggunakan desain *legacy* dengan *placeholder* kotak warna solid sederhana yang kontras dengan estetika modern di Edukasi.
- **Rekomendasi**: Perbarui halaman Galeri menggunakan struktur desain yang seragam dengan Edukasi (misalnya menggunakan *grid* yang konsisten, bayangan yang lebih lembut, atau mengubah presentasinya agar memiliki nuansa yang setara).

## 2. Masalah Kontras & Aksesibilitas (Halaman Aduan)
- **Temuan**: Teks bantuan form (`.form-hint` seperti "Nama tidak wajib diisi") menggunakan variabel warna `--text-muted` (`#9ca3af` pada mode terang). Warna ini tidak memenuhi standar kontras minimal WCAG (2.45:1 terhadap latar putih), sehingga sulit dibaca oleh pengguna di luar ruangan atau pengguna dengan keterbatasan penglihatan.
- **Rekomendasi**: Ubah `--text-muted` menjadi warna abu-abu yang lebih gelap (minimal `#6b7280`) pada tema terang untuk memastikan keterbacaan yang optimal.

## 3. Inkonsistensi Hierarki dan Ukuran Target Sentuh (Mobile)
- **Temuan**: Tombol "Masuk" di navigasi seluler menggunakan ukuran `.btn-sm`, sehingga ukurannya terlalu kecil untuk di-tap (*touch target* kecil) bagi jempol pengguna ponsel. Sementara di halaman Beranda (Hero section), tombol utama sangat besar (`.btn-lg`).
- **Rekomendasi**: Gunakan ukuran tombol minimal `.btn` (reguler) atau `.btn-block` penuh untuk *Call to Action* (CTA) di dalam menu *hamburger* pada versi seluler.

## 4. Inkonsistensi Warna (Halaman Regulasi)
- **Temuan**: Ikon pada daftar peraturan di halaman **Regulasi** menggunakan warna merah cerah (`#dc2626` dengan *background* merah muda). Walaupun menonjol, hal ini tidak sejalan dengan skema warna utama *brand* SIMPAH (Zamrud/Emerald Green) atau warna biru *info*. Warna merah secara universal diasosiasikan dengan "Bahaya" atau "Galat", bukan dokumen.
- **Rekomendasi**: Ubah warna ikon regulasi menjadi biru (`--info-600`) atau selaras dengan tema hijau aplikasi untuk konsistensi emosi desain.

## 5. Artefak Visual Tambahan (Glow/Bayangan)
- **Temuan**: Pada versi *mobile*, ada artefak pendar biru (*blue glow*) / bayangan yang kadang muncul di tepian *viewport* tertentu saat di-_scroll_ yang kemungkinan berasal dari properti CSS yang belum tuntas diatasi (misal `box-shadow` pada navigasi yang tembus pandang atau pada elemen `focus`).
- **Rekomendasi**: Lakukan pengecekan pada batas (*overflow*) dan batasi `box-shadow` pada kontainer utamanya.
