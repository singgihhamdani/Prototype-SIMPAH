# Pemetaan Aliran Data Sistem SIMPAH

Sistem SIMPAH memiliki alur data yang dirancang mulai dari tingkat **sumber (lapangan/akar rumput)** hingga **tingkat eksekutif (Dinas)** sebagai bahan pengambilan keputusan berkelanjutan dan pelaporan SIPSN.

Untuk pemahaman terbaik tentang bagaimana semua komponen ini terhubung secara logis, saya menyarankan pendekatan gabungan antara:
1. **High-Level System Architecture:** Untuk melihat interaksi antar modul (PWA vs Dashboard vs Server).
2. **Data Flow Workflow (Alur Entri Data Operasional):** Untuk memetakan lifecycle / siklus perjalanan entri tunggal dari HP petugas ke laporan akhir.

---

## 1. Arsitektur Sistem (Level Makro)

Diagram arsitektur makro ini menunjukkan hubungan entitas atau modul utama aplikasi, bagaimana *offline-first* bekerja, dan siapa yang mengonsumsi data tersebut.

```mermaid
graph TD
    %% Entitas Sumber / Input
    subgraph Sisi Lapangan & Publik
        U_Masyarakat[Masyarakat Umum]
        U_Kader[Kader / Nasabah Bank Sampah]
        U_Petugas[Petugas Pengangkut]
    end

    %% Antarmuka PWA / Web Terdistribusi
    subgraph PWA & Portals
        P_Portal[Portal Publik & Form Aduan]
        P_Mobile[PWA Operasional Mobile]
        DB_Local[(Local IndexedDB\nOffline Cache)]
        
        U_Kader -.->|"Input Pilah/Masuk"| P_Mobile
        U_Petugas -.->|"Input Residu/Angkut"| P_Mobile
        P_Mobile <-->|"Simpan/Baca Offline"| DB_Local
        
        U_Masyarakat -.->|"Kirim Laporan Aduan"| P_Portal
    end

    %% Sisi Cloud / Server
    subgraph Backend & Real-Time Sync
        API[API / Service Layer]
        DB_Cloud[(Central Cloud Database)]
        
        DB_Local == Auto Sync saat Online ==> API
        P_Portal --> API
        API <--> DB_Cloud
    end

    %% Dasbor dan Pengolahan Lanjutan
    subgraph Management Dashboard
        D_GIS[Dashboard GIS & Heatmap]
        D_Exec[Dashboard Eksekutif DLHK]
        
        DB_Cloud --> D_GIS
        DB_Cloud --> D_Exec
    end

    %% Pengguna Sistem Pusat
    U_Pemdes[Pemerintah Desa / Pemdes] --> D_GIS
    U_Dinas[Dinas Eksekutif] --> D_Exec
    U_Dinas --> D_GIS

    %% Tindakan Lanjutan
    D_Exec -->|"Export File CSV/Excel"| SIPSN["Sistem Pelaporan SIPSN Nasional"]
```

> [!NOTE]
> **Mengapa Arsitektur Ini Kuat?**
> Karena ada lapisan **Local IndexedDB (Offline Cache)**. Kader di pelosok yang tidak memiliki sinyal bisa tetap memasukkan data tanpa gagal. Begitu mendapat internet, Service API akan melakukan sinkronisasi dengan *Cloud Database* di *background*.

---

## 2. DFD Alur Operasional Pengelolaan Sampah (Level Mikro)

Bagaimana perjalanan sampah (data fisik) dipetakan ke dalam entri data digital dari hulu hingga hilir pelaporan?

```mermaid
sequenceDiagram
    participant K as Kader Lapangan
    participant PWA as PWA App & GPS
    participant S as Sistem Utama (Cloud)
    participant E as Dasbor Eksekutif (Dinas)
    
    Note over K,PWA: 1. Proses Pengumpulan & Pemilahan
    K->>PWA: Input "Sampah Masuk" & Ambil Foto
    PWA->>PWA: Grab Koordinat GPS Otomatis
    K->>PWA: Input "Sampah Terpilah" (Standar Kategori SIPSN)
    
    Note over PWA,S: 2. Transmisi Data Berkala
    PWA->>S: Transmisikan Laporan (Data + GPS + Foto)
    S-->>PWA: Validasi & Konfirmasi Sukses
    
    Note over S: Server menyimpan dengan status 'Pending' (Anti-Fraud)
    
    Note over S,E: 3. Validasi Eksekutif (Anti-Fraud)
    E->>S: Dinas meninjau Antrean Validasi Data
    E->>S: Dinas klik "Setujui (Approved)" pada laporan sah
    
    Note over S,E: 4. Visualisasi dan Agregasi Dashboard
    S->>E: Update Statistik Volume Harian secara Real-Time
    S->>E: Perhitungan Skor Intervensi Desa
    
    Note over E: 5. Export Laporan SIPSN & Intervensi
    E->>E: Dinas filter Laporan (Harian/Bulanan)
    E->>S: Download Format SIPSN (CSV) & PDF Intervensi
```

> [!TIP]
> **Fokus Utama Pemetaan Form (SIPSN Compliance):**
> Titik kritis dari DFD operasional di atas terletak di Form Entri Data. Data sampah terpilah (Contoh: "Plastik: 5kg", "Sisa Makanan: 2kg") langsung diformat oleh PWA mengikuti standar klasifikasi **SIPSN**. Ini menghilangkan keharusan pihak Dinas atau Operator Desa untuk merekap ulang data kotor.

---

## Kesimpulan Rekomendasi
Untuk Anda atau saat Anda melakukan presentasi/pitching, saya menyarankan untuk memakai **High-Level System Architecture (Diagram 1)** dikombinasikan dengan narasi dari **Sequence DFD (Diagram 2)**. 

Diagram Arsitektur Makro secara visual dengan cepat menunjukkan nilai jual (value proposition) yang tinggi, yaitu integrasi data dari skala terbawah *(PWA)*, berpusat ke sistem tangguh dan offline-first, diteruskan ke *(Cloud)* terpusat, dan bermuara ke modul analitik canggih bagi aparat eksekutif *(Dashboard GIS & Automasi Ekspor Pelaporan SIPSN)*.
