# Diagram SIMPAH

Berikut adalah diagram arsitektur dan model data untuk proyek SIMPAH. Anda dapat melihatnya secara langsung di bawah ini atau menekan klik-kanan dan **"Save Image As"** untuk mengekspor (menyimpan) gambarnya.

## 1. Architecture Overview
Diagram ini menunjukkan bagaimana PWA Lapangan (Mobile-First) berinteraksi secara offline-first dengan IndexedDB, serta aliran data ke dashboard, portal publik, dan sistem ekspor.

```mermaid
graph TD
    A["PWA Lapangan (Mobile-First)"] -->|IndexedDB + Sync| D["Central Data Store"]
    B["Dashboard GIS"] -->|Read| D
    C["Dashboard Eksekutif"] -->|Read| D
    E["Portal Publik"] -->|Read + Write Aduan| D
    D -->|Export| F["SIPSN Format (CSV/Excel)"]
    D -->|Audit Trail| G["Timestamp + UserID + GPS"]
```

## 2. Data Model (SIPSN Compatible)
Diagram Entity-Relationship yang memodelkan relasi antar record pengelolaan sampah yang tersimpan secara lokal dan sudah kompatibel dengan format laporan nasional (SIPSN).

```mermaid
erDiagram
    WASTE_RECORD ||--o{ SORTED_WASTE : contains
    WASTE_RECORD ||--o| RESIDUE : generates
    WASTE_RECORD }o--|| LOCATION : recorded_at
    WASTE_RECORD }o--|| USER : recorded_by
    WASTE_RECORD }o--o| FLEET : transported_by
    FLEET }o--o| MOU : covered_by
    COMPLAINT }o--o| LOCATION : near

    WASTE_RECORD {
        string id PK
        string category_sipsn
        float weight_kg
        string type "masuk|pilah|residu"
        float lat
        float lng
        string location_id FK
        string user_id FK
        string fleet_id FK
        boolean is_incidental
        string notes
        datetime created_at
        boolean synced
    }

    LOCATION {
        string id PK
        string name
        string type "tps|tps3r|bank_sampah|pengepul|tpa"
        float lat
        float lng
        string address
        string wilayah
    }
```
