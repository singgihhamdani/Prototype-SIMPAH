# Daftar Pertanyaan Meeting: Requirement Gathering dengan DPPKPLH Banjarnegara

Berikut adalah daftar pertanyaan terstruktur yang dirancang untuk menggali kebutuhan spesifik dari pihak DPPKPLH (Dinas Perumahan, Kawasan Permukiman, dan Lingkungan Hidup) Kabupaten Banjarnegara agar platform SIMPAH dapat dioperasikan secara maksimal di lapangan.

---

## 1. Sinkronisasi Data dengan Standar SIPSN Nasional
*Fokus: Memastikan format data yang dikumpulkan sistem sesuai dengan format laporan yang diminta KLHK.*
* Bagaimana mekanisme pelaporan data pengelolaan sampah dari DPPKPLH Banjarnegara ke platform SIPSN pusat saat ini? Berapa periode pelaporannya (bulanan, semesteran, tahunan)?
* Dari seluruh form kategori sampah dalam standar SIPSN (Sisa Makanan, Kayu/Ranting, Kertas, Plastik, Logam, Kain, dll), apakah saat ini sudah ada pencatatan detail tonase untuk setiap kategori dari tingkat TPS3R atau Bank Sampah di Banjarnegara?
* Apakah ada variabel atau parameter tambahan (di luar SIPSN) khusus untuk wilayah Banjarnegara yang perlu kami lacak dan catat di dalam *dashboard* kami?

## 2. Realita Operasional Lapangan & Kesiapan SDM/Perangkat
*Fokus: Mengidentifikasi hambatan teknis yang mungkin terjadi pada petugas/kader (end-user).*
* Bagaimana sistem pencatatan sampah masuk dan residu yang selama ini dilakukan oleh operator truk/kader TPS? Apakah masih menggunakan buku tulis / rekap *Excel* manual?
* Spesifikasi rata-rata infrastruktur seluler dan *smartphone* di area operasional TPS/TPS3R daerah Banjarnegara? (Pertanyaan ini untuk memvalidasi limitasi mode *Offline-first / PWA constraint* kita).
* Seberapa terbiasa para operator atau kader di lapangan dalam menggunakan aplikasi untuk pelaporan wajib harian? Perlukah fitur pendampingan seperti *tooltip* sederhana pada sistem?

## 3. Pemetaan Geospasial (GIS) & Prioritas Penanganan Indikator
*Fokus: Menyelaraskan output pemetaan.*
* Jika kami memetakan *Heatmap* atau Titik Rawan Penumpukan di peta, metrik apa yang paling krusial untuk dinas? (Misalnya: tonase yang terlalu lama menumpuk, atau persentase residu dari TPA yang semakin mengkhawatirkan).
* Ada berapa titik infrastruktur pengolahan utama saat ini yang sudah dikelola dan harus diakomodir lokasi pastinya di aplikasi (Jumlah TPS3R, Bank Sampah Induk, Pengepul besar, TPA)?

## 4. Manajemen MoU & Pengangkutan oleh Pihak Ketiga (Transporter)
*Fokus: Penertiban izin dan tata kelola armada.*
* Dalam PRD, kami memasukkan *"Validasi MoU Transporter"* untuk mengawasi armada swasta atau BUMDes. Seperti apa skema perizinan, tagihan, atau retribusi pembuangan dari pihak ketiga ke TPA di Banjarnegara saat ini? 
* Apakah armada pengangkut dari BUMDes/Swasta diwajibkan mendaftarkan pelat nomor dan data pengemudinya ke dinas sebelum bisa membuang residu atau diolah di TPS Induk?

## 5. Portal Aduan & Keterlibatan Edukasi Masyarakat Publik
*Fokus: Menentukan sistem mitigasi untuk laporan liar.*
* Saat kami merilis portal khusus aduan masyarakat yang dilengkapi foto dan lokasi keberadaan tumpukan sampah liar, siapa/tim apa di internal DPPKPLH yang akan bertugas memantau dan mem-verifikasinya?
* Apakah aduan tersebut butuh *SLA* (Service Level Agreement / batas waktu pengerjaan) pelacakan di dashboard? Misalnya perubahan status laporan dari: *"Masuk" -> "Sedang Ditangani" -> "Selesai"*.

## 6. Harapan & Roadmap Adopsi
*Fokus: Persiapan Deployment (Server & Infrastruktur Cloud).*
* Jika sistem *prototype* ini berhasil divalidasi, apakah DPPKPLH berencana menggunakan *server* lokal dinas (On-Premise Kominfo daerah) atau menggunakan *Cloud* publik (contoh: AWS/Google Cloud) milik swasta?
* Siapa yang akan ditunjuk sebagai administrator utama yang mengatur penambahan user/akun *(Role Management)* untuk kader, petugas, dan akun BUMDes?
