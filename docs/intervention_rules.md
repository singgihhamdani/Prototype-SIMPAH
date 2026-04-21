# Rule Engine: Rekomendasi Intervensi Desa SIMPAH

> Dokumen ini mendefinisikan logika otomatis untuk menghasilkan rekomendasi
> intervensi berdasarkan kondisi data per desa. Disusun berdasarkan perspektif
> Teknik Planologi dan standar pengelolaan persampahan nasional (SIPSN).

---

## Struktur Rule

Setiap rule memiliki format:
- **Kode**: ID unik untuk referensi sistem
- **Kondisi**: Ekspresi logika berdasarkan indikator terukur
- **Tingkat Urgensi**: 🔴 Kritis / 🟡 Perlu Perhatian / 🟢 Pengembangan
- **Penanggung Jawab**: Dinas / Desa / Bersama
- **Horizon Waktu**: Segera (< 1 bulan) / Pendek (1–3 bln) / Menengah (3–12 bln) / Panjang (> 1 thn)
- **Rekomendasi**: Teks yang ditampilkan di laporan
- **Dasar Kebijakan**: Referensi regulasi/standar

---

## Kelompok A: Timbulan & Volume

### A-01 — Timbulan Per KK Sangat Tinggi
- **Kondisi**: `timbulan_per_kk_bulan > 45 kg`
- **Urgensi**: 🔴 Kritis
- **PJ**: Dinas + Desa
- **Waktu**: Segera
- **Rekomendasi**: "Volume timbulan per KK melampaui ambang batas wajar. Lakukan survei komposisi sampah rumah tangga untuk mengidentifikasi sumber dominan. Pertimbangkan program pengomposan mandiri skala rumah tangga sebagai langkah segera untuk mengurangi beban di hulu."
- **Dasar**: SNI 19-3694-1994 timbulan sampah perkotaan

### A-02 — Timbulan Per KK Tinggi
- **Kondisi**: `timbulan_per_kk_bulan >= 35 AND <= 45 kg`
- **Urgensi**: 🟡 Perlu Perhatian
- **PJ**: Desa
- **Waktu**: Pendek (1–3 bulan)
- **Rekomendasi**: "Volume timbulan berada di atas rata-rata kabupaten. Prioritaskan edukasi pengurangan sampah di sumber (source reduction) melalui program 3R berbasis RT/RW yang dikoordinasikan BUMDes."

### A-03 — Lonjakan Timbulan Tiba-tiba
- **Kondisi**: `timbulan_bulan_ini > timbulan_rata_rata_3_bulan * 1.5`
- **Urgensi**: 🟡 Perlu Perhatian
- **PJ**: Dinas
- **Waktu**: Segera
- **Rekomendasi**: "Terdeteksi lonjakan volume signifikan (+50% dari rata-rata). Verifikasi apakah terdapat kegiatan insidental (event warga, hari raya, atau pembangunan). Jika bukan insidental, segera lakukan inspeksi lapangan untuk mengidentifikasi sumber tambahan."

### A-04 — Tren Timbulan Terus Meningkat
- **Kondisi**: `tren_timbulan_3_bulan == "naik_konsisten"`
- **Urgensi**: 🔴 Kritis
- **PJ**: Dinas + Desa
- **Waktu**: Menengah (3–12 bulan)
- **Rekomendasi**: "Data menunjukkan tren kenaikan timbulan yang konsisten selama 3 bulan berturut-turut — bukan anomali insidental. Diperlukan kajian kapasitas infrastruktur pengelolaan (TPS/TPS3R) dan revisi rencana operasional pengangkutan untuk jangka menengah."

---

## Kelompok B: Pemilahan & Daur Ulang

### B-01 — Recycling Rate Sangat Rendah
- **Kondisi**: `recycling_rate < 10%`
- **Urgensi**: 🔴 Kritis
- **PJ**: Dinas + Desa
- **Waktu**: Pendek (1–3 bulan)
- **Rekomendasi**: "Tingkat daur ulang di bawah 10% menunjukkan hampir tidak ada aktivitas pemilahan efektif. Diperlukan intervensi menyeluruh: pembentukan atau reaktivasi Bank Sampah desa, rekrutmen kader pemilah, dan koordinasi dengan pengepul/offtaker terdekat untuk memastikan rantai daur ulang tersambung."

### B-02 — Recycling Rate Rendah
- **Kondisi**: `recycling_rate >= 10% AND < 25%`
- **Urgensi**: 🟡 Perlu Perhatian
- **PJ**: Desa
- **Waktu**: Pendek (1–3 bulan)
- **Rekomendasi**: "Recycling rate masih di bawah target nasional (25%). Evaluasi titik-titik kegagalan rantai pilah: apakah karena rendahnya partisipasi warga, tidak adanya fasilitas pilah di TPS, atau tidak tersedianya offtaker? Fokus pada satu bottleneck yang paling dominan terlebih dahulu."

### B-03 — Tidak Ada Offtaker / Pengepul Terdekat
- **Kondisi**: `jarak_pengepul_terdekat_km > 15`
- **Urgensi**: 🟡 Perlu Perhatian
- **PJ**: Dinas
- **Waktu**: Menengah (3–12 bulan)
- **Rekomendasi**: "Ketiadaan pengepul dalam radius layak menjadi hambatan struktural daur ulang. Dinas perlu memfasilitasi kemitraan dengan pengepul kabupaten atau mendorong pembentukan koperasi daur ulang antar desa sebagai solusi kolektif."

### B-04 — Bank Sampah Tidak Aktif
- **Kondisi**: `bank_sampah_aktif == false AND bank_sampah_ada == true`
- **Urgensi**: 🟡 Perlu Perhatian
- **PJ**: Desa
- **Waktu**: Segera
- **Rekomendasi**: "Bank Sampah tercatat ada namun tidak beroperasi aktif. Lakukan asesmen cepat: apakah karena pengurus tidak aktif, modal macet, atau kurangnya nasabah? Reaktivasi Bank Sampah yang sudah berdiri jauh lebih efisien secara biaya dan waktu daripada membangun unit baru."

### B-05 — Partisipasi Warga dalam Pemilahan Sangat Rendah
- **Kondisi**: `partisipasi_pilah_persen < 20%`
- **Urgensi**: 🔴 Kritis
- **PJ**: Desa
- **Waktu**: Pendek (1–3 bulan)
- **Rekomendasi**: "Partisipasi pemilahan di bawah 20% KK. Program edukasi berbasis komunitas harus diprioritaskan. Rekomendasi khusus: libatkan PKK, Posyandu, dan tokoh agama sebagai agen perubahan perilaku. Sosialisasi door-to-door di RW dengan tingkat aduan tertinggi sebagai pilot area."

---

## Kelompok C: Residu & TPA

### C-01 — Residu ke TPA Sangat Tinggi
- **Kondisi**: `residu_rate > 60%`
- **Urgensi**: 🔴 Kritis
- **PJ**: Dinas
- **Waktu**: Pendek (1–3 bulan)
- **Rekomendasi**: "Lebih dari 60% sampah berakhir sebagai residu ke TPA — angka ini tidak berkelanjutan dan membebani kapasitas TPA kabupaten. Diperlukan evaluasi menyeluruh kapasitas pengolahan TPS. Jika TPS saat ini hanya berfungsi sebagai titik transfer (bukan pengolahan), rekomendasikan peningkatan status ke TPS3R dengan fasilitas pencacah dan komposter."

### C-02 — Residu ke TPA Tinggi
- **Kondisi**: `residu_rate >= 40% AND <= 60%`
- **Urgensi**: 🟡 Perlu Perhatian
- **PJ**: Desa + Dinas
- **Waktu**: Menengah (3–12 bulan)
- **Rekomendasi**: "Persentase residu berada di atas ambang yang direkomendasikan. Tinjau komposisi residu: jika didominasi sisa makanan (organik), introduction program biodigester atau komposter komunal dapat menurunkan angka ini secara signifikan."

### C-03 — Komposisi Residu Didominasi Organik
- **Kondisi**: `komposisi_residu_organik > 50%`
- **Urgensi**: 🟡 Perlu Perhatian
- **PJ**: Desa
- **Waktu**: Pendek (1–3 bulan)
- **Rekomendasi**: "Lebih dari separuh residu adalah sampah organik yang sebenarnya dapat diolah menjadi kompos atau biogas. Intervensi paling cost-effective: distribusi komposter skala rumah tangga atau pembangunan lubang biopori komunal di fasilitas publik (sekolah, masjid, kantor desa)."

---

## Kelompok D: Infrastruktur & Layanan Pengangkutan

### D-01 — Frekuensi Angkut di Bawah Standar
- **Kondisi**: `frekuensi_angkut_per_minggu < 2`
- **Urgensi**: 🔴 Kritis
- **PJ**: Dinas
- **Waktu**: Segera
- **Segera**: "Frekuensi pengangkutan di bawah 2x/minggu menyebabkan penumpukan di TPS dan memicu keluhan warga. Evaluasi jadwal rute armada. Jika armada tidak mencukupi, pertimbangkan sistem angkut terjadwal berbagi dengan desa tetangga (shared route)."

### D-02 — TPS Overkapasitas
- **Kondisi**: `volume_tps_terisi > kapasitas_tps * 0.85`
- **Urgensi**: 🔴 Kritis
- **PJ**: Dinas
- **Waktu**: Segera
- **Rekomendasi**: "TPS terindikasi beroperasi di atas 85% kapasitas maksimal. Risiko penumpukan dan luberan sangat tinggi. Tindakan segera: tambah frekuensi angkut atau alokasikan TPS bayangan terdekat sebagai buffer. Jangka menengah: evaluasi kebutuhan TPS tambahan mengacu pada pertumbuhan penduduk 5 tahun ke depan."

### D-03 — Tidak Ada TPS atau TPS Terlalu Jauh dari Pemukiman
- **Kondisi**: `jarak_tps_ke_pemukiman_terjauh_m > 500`
- **Urgensi**: 🟡 Perlu Perhatian
- **PJ**: Dinas + Desa
- **Waktu**: Menengah (3–12 bulan)
- **Rekomendasi**: "Terdapat area permukiman yang berjarak lebih dari 500m dari TPS terdekat. Ini adalah hambatan fisik yang mendorong perilaku buang sampah sembarangan. Identifikasi lokasi strategis untuk TPS baru berbasis analisis spasial kepadatan permukiman (sudah tersedia di modul GIS SIMPAH)."

### D-04 — Armada Tidak Tervalidasi MoU
- **Kondisi**: `armada_aktif_tanpa_mou > 0`
- **Urgensi**: 🔴 Kritis
- **PJ**: Dinas
- **Waktu**: Segera
- **Rekomendasi**: "Terdeteksi armada pengangkut yang beroperasi tanpa registrasi MoU aktif. Ini berpotensi melanggar regulasi pembuangan dan membuka risiko dumping liar. Lakukan verifikasi segera dan bekukan izin operasional armada yang tidak terdaftar hingga administrasi MoU diselesaikan."

---

## Kelompok E: Aduan Masyarakat

### E-01 — Volume Aduan Sangat Tinggi
- **Kondisi**: `jumlah_aduan_bulan > 10`
- **Urgensi**: 🔴 Kritis
- **PJ**: Dinas
- **Waktu**: Segera
- **Rekomendasi**: "Lebih dari 10 aduan aktif dalam satu periode adalah sinyal krisis layanan. Prioritaskan respons lapangan dalam 3x24 jam. Tinjau kluster spasial aduan di peta GIS untuk menentukan titik hot-spot yang menjadi prioritas kunjungan inspeksi pertama."

### E-02 — Aduan Terfokus di Satu Wilayah
- **Kondisi**: `kluster_aduan_dominan == true AND persen_aduan_di_kluster > 60%`
- **Urgensi**: 🔴 Kritis
- **PJ**: Dinas + Desa
- **Waktu**: Segera
- **Rekomendasi**: "Lebih dari 60% aduan terkonsentrasi di satu area/RW. Ini mengindikasikan masalah lokal spesifik (TPS luber, akses jalan terhambat truk, atau konflik sosial dengan warga). Kunjungan lapangan terarah ke kluster tersebut lebih efektif daripada intervensi menyeluruh."

### E-03 — Aduan Berulang Tanpa Respons
- **Kondisi**: `aduan_usia_lebih_7_hari_tanpa_tindak > 3`
- **Urgensi**: 🔴 Kritis
- **PJ**: Dinas
- **Waktu**: Segera
- **Rekomendasi**: "Terdapat aduan yang sudah lebih dari 7 hari belum ditangani. Aduan yang dibiarkan merusak kepercayaan publik terhadap sistem secara keseluruhan. Eskalasikan ke pejabat terkait dan tetapkan PIC penanganan dengan tenggat waktu yang jelas."

### E-04 — Jenis Aduan Didominasi Tumpukan Liar
- **Kondisi**: `jenis_aduan_dominan == "tumpukan_liar"`
- **Urgensi**: 🟡 Perlu Perhatian
- **PJ**: Dinas + Desa
- **Waktu**: Pendek (1–3 bulan)
- **Rekomendasi**: "Dominasi aduan tumpukan liar mengindikasikan titik-titik pembuangan informal yang belum ter-cover layanan resmi. Petakan koordinat GPS dari semua aduan jenis ini dan overlay dengan coverage peta TPS — kemungkinan besar ini adalah 'blank spot' layanan yang perlu prioritas penambahan fasilitas."

---

## Kelompok F: Kapasitas Kelembagaan Desa

### F-01 — Tidak Ada Kader Aktif
- **Kondisi**: `jumlah_kader_aktif == 0`
- **Urgensi**: 🔴 Kritis
- **PJ**: Dinas + Desa
- **Waktu**: Pendek (1–3 bulan)
- **Rekomendasi**: "Tidak ada kader persampahan aktif yang tercatat. Sistem pengelolaan tanpa aktor lapangan terlatih akan sangat rentan terhadap kegagalan operasional. Rekomendasikan program pelatihan kader dengan target minimal 1 kader per 50 KK, difasilitasi Dinas bersama BUMDes."

### F-02 — Rasio Kader Tidak Memadai
- **Kondisi**: `rasio_kk_per_kader > 100`
- **Urgensi**: 🟡 Perlu Perhatian
- **PJ**: Desa
- **Waktu**: Menengah (3–12 bulan)
- **Rekomendasi**: "Rasio kader terlalu tinggi (>100 KK per kader). Beban kerja yang berlebihan akan menyebabkan burnout dan penurunan kualitas pencatatan data. Target ideal adalah 1 kader untuk 50–75 KK. Rekomendasikan rekrutmen kader tambahan dengan mekanisme insentif yang disepakati bersama desa."

### F-03 — Data Entry Tidak Konsisten
- **Kondisi**: `frekuensi_input_data_per_bulan < 4 OR gap_input_terpanjang_hari > 14`
- **Urgensi**: 🟡 Perlu Perhatian
- **PJ**: Dinas
- **Waktu**: Pendek (1–3 bulan)
- **Rekomendasi**: "Ditemukan gap input data yang tidak normal (>14 hari tanpa entri atau frekuensi < 4x/bulan). Ini bisa mengindikasikan: kader tidak aktif, masalah akses perangkat/internet, atau hambatan teknis aplikasi. Lakukan verifikasi melalui kunjungan pembinaan atau komunikasi langsung dengan kader desa."

---

## Kelompok G: Kepatuhan & Regulasi

### G-01 — Tidak Ada Data GPS pada Entri
- **Kondisi**: `persen_entri_tanpa_gps > 30%`
- **Urgensi**: 🟡 Perlu Perhatian
- **PJ**: Dinas
- **Waktu**: Pendek (1–3 bulan)
- **Rekomendasi**: "Lebih dari 30% entri data tidak memiliki informasi geolokasi. Ini melemahkan auditabilitas data dan tidak memenuhi standar jejak audit (audit trail) SIMPAH. Lakukan re-training penggunaan aplikasi kepada kader, dengan penekanan pada pentingnya izin lokasi aktif di perangkat."

### G-02 — Tingkat Foto Bukti Rendah
- **Kondisi**: `persen_entri_tanpa_foto > 50%`
- **Urgensi**: 🟡 Perlu Perhatian
- **PJ**: Dinas
- **Waktu**: Pendek (1–3 bulan)
- **Rekomendasi**: "Lebih dari separuh entri tidak dilengkapi foto bukti lapangan. Foto adalah komponen validasi utama untuk mencegah data fiktif. Sosialisasikan kembali protokol pencatatan dan pertimbangkan untuk menjadikan foto sebagai field wajib (mandatory) di pembaruan aplikasi berikutnya."

### G-03 — Entri Data Banyak yang Belum Tersinkronisasi
- **Kondisi**: `persen_data_pending_sync > 20% AND usia_pending_terlama_hari > 7`
- **Urgensi**: 🟡 Perlu Perhatian
- **PJ**: Dinas
- **Waktu**: Segera
- **Rekomendasi**: "Terdapat data dalam jumlah signifikan yang tersimpan secara lokal namun belum tersinkronisasi ke server pusat lebih dari 7 hari. Kemungkinan penyebab: keterbatasan akses internet di wilayah ini. Koordinasikan dengan kader untuk melakukan sinkronisasi manual di lokasi dengan akses internet (kantor desa/kecamatan)."

---

## Kelompok H: Komparatif & Potensi

### H-01 — Performa di Bawah Rata-rata Kabupaten
- **Kondisi**: `skor_desa < rata_rata_kabupaten * 0.75`
- **Urgensi**: 🔴 Kritis
- **PJ**: Dinas
- **Waktu**: Menengah (3–12 bulan)
- **Rekomendasi**: "Performa pengelolaan desa ini signifikan di bawah rata-rata kabupaten (gap >25%). Pertimbangkan program sister-village dengan desa berperforma tinggi di kecamatan yang sama untuk transfer pengetahuan dan praktik baik secara peer-to-peer."

### H-02 — Potensi Desa Model
- **Kondisi**: `recycling_rate > 40% AND residu_rate < 30% AND aduan_count < 2`
- **Urgensi**: 🟢 Pengembangan
- **PJ**: Dinas
- **Waktu**: Panjang (> 1 tahun)
- **Rekomendasi**: "Desa ini memiliki performa pengelolaan sampah terbaik di kelasnya. Rekomendasikan untuk dijadikan desa percontohan (pilot village) dalam program replikasi kabupaten. Dokumentasikan praktik terbaik untuk dijadikan modul pelatihan kader di desa-desa lain."

### H-03 — Potensi Ekonomi Daur Ulang Belum Dimaksimalkan
- **Kondisi**: `recycling_rate > 25% AND bank_sampah_omzet_bulan < threshold_ekonomis`
- **Urgensi**: 🟢 Pengembangan
- **PJ**: Desa + BUMDes
- **Waktu**: Menengah (3–12 bulan)
- **Rekomendasi**: "Volume material terpilah cukup signifikan namun nilai ekonominya belum dioptimalkan. Fasilitasi akses ke platform digital pengepul atau negosiasi harga dengan pengepul resmi kabupaten. Pertimbangkan agregasi material antar desa untuk mendapatkan harga jual yang lebih baik (economies of scale)."

---

## Tabel Referensi Benchmark

> Digunakan sebagai acuan perhitungan kondisi di atas. Dapat disesuaikan berdasarkan kondisi lokal kabupaten.

| Indikator | Threshold Kritis 🔴 | Threshold Perhatian 🟡 | Target Ideal 🟢 | Referensi |
|---|---|---|---|---|
| Timbulan / KK / bulan | > 45 kg | 35–45 kg | < 30 kg | SNI 19-3694 |
| Recycling Rate | < 10% | 10–25% | > 25% | Target RPJMN 2025 |
| Residu ke TPA | > 60% | 40–60% | < 40% | Kebijakan Kementerian LHK |
| Frekuensi Angkut | < 2x/minggu | 2–3x/minggu | ≥ 3x/minggu | Standar operasi TPS |
| Rasio KK/Kader | > 100 | 75–100 | < 50 | Best practice lapangan |
| Aduan Aktif/Bulan | > 10 | 5–10 | < 2 | Internal SIMPAH |
| Partisipasi Pilah | < 20% | 20–40% | > 50% | Target SIPSN |
| Gap Input Data | > 14 hari | 7–14 hari | < 7 hari | Protokol SIMPAH |

---

## Catatan Implementasi untuk Developer

```javascript
// Contoh struktur rule engine di JavaScript
const INTERVENTION_RULES = [
  {
    id: 'A-01',
    group: 'Timbulan & Volume',
    urgency: 'kritis', // 'kritis' | 'perhatian' | 'pengembangan'
    pic: 'Dinas + Desa',
    horizon: 'segera',
    condition: (data) => data.timbulan_per_kk_bulan > 45,
    recommendation: "Volume timbulan per KK melampaui ambang batas...",
  },
  // ... dst
];

// Evaluasi semua rule terhadap data desa
function evaluateRules(desaData) {
  return INTERVENTION_RULES
    .filter(rule => rule.condition(desaData))
    .sort((a, b) => urgencyWeight(b.urgency) - urgencyWeight(a.urgency));
}
```
