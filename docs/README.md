# 📖 Dokumentasi Sistem Pemesanan Kendaraan

> 📘 **Panduan penggunaan lengkap dari 0 ke 100%** → [`PENGGUNAAN.md`](./PENGGUNAAN.md)

- [Panduan Penggunaan per Role](#-panduan-penggunaan-per-role)
- [Activity Diagram](#-activity-diagram)
- [Physical Data Model](#-physical-data-model)
- [API Endpoints](#-api-endpoints)
- [Struktur Proyek](#-struktur-proyek)

---

## 📖 Panduan Penggunaan per Role

### Admin
1. Login sebagai **Admin Utama**
2. **Dashboard** → Lihat statistik, grafik, export Excel
3. **Pemesanan Baru** → Buat pemesanan kendaraan
4. **Kendaraan** → Tambah/edit kendaraan, catat service, filter status
5. **Approval** → Approve/tolak pemesanan (bisa level 1 & 2)
6. **Log Aktivitas** → Lihat seluruh aktivitas sistem

### Approver
1. Login sebagai **Budi Santoso** (Approver 1) atau **Siti Rahmawati** (Approver 2)
2. **Approval** → Lihat antrian pending sesuai level
3. Klik **Setuju** atau **Tolak** — lengkapi catatan jika perlu
4. **Dashboard** → Monitor status pemesanan

### Driver
1. Login sebagai salah satu driver
2. **Dashboard** → Lihat jadwal pemesanan
3. Bersifat read-only di sebagian menu

---

## 🔄 Activity Diagram

```mermaid
flowchart TD
    A([Mulai]) --> B[Admin input pemesanan]
    B --> C{Approver 1 setuju?}
    C -->|Ya| D[Status: Pending Level 2]
    C -->|Tidak| E[Status: Ditolak]
    D --> F{Approver 2 setuju?}
    F -->|Ya| G[Status: Disetujui]
    F -->|Tidak| H[Status: Ditolak]
    G --> I([Selesai])
    E --> I
    H --> I

    style A fill:#e2e8f0,stroke:#475569
    style B fill:#dbeafe,stroke:#3b82f6
    style C fill:#fef3c7,stroke:#f59e0b
    style D fill:#dbeafe,stroke:#3b82f6
    style E fill:#fee2e2,stroke:#ef4444
    style F fill:#fef3c7,stroke:#f59e0b
    style G fill:#dcfce7,stroke:#22c55e
    style H fill:#fee2e2,stroke:#ef4444
    style I fill:#e2e8f0,stroke:#475569
```

---

## 🗄 Physical Data Model

```mermaid
erDiagram
    User ||--o{ Pemesanan : "pemohon"
    User ||--o{ Pemesanan : "approver1"
    User ||--o{ Pemesanan : "approver2"
    User ||--o{ Pemesanan : "driver"
    User ||--o{ LogAktivitas : "membuat"
    Vehicle ||--o{ Pemesanan : "dipesan"
    Vehicle ||--o{ VehicleServiceLog : "riwayat"
    Pemesanan ||--o{ LogAktivitas : "terkait"

    User {
        string id PK
        string nama
        string email UK
        string role "admin | approver | driver"
        datetime createdAt
        datetime updatedAt
    }

    Vehicle {
        string id PK
        string nama
        string plat UK
        string tipe "angkutan_orang | angkutan_barang"
        string kepemilikan "milik | sewa"
        int kilometer
        float kmPerLiter
        int serviceIntervalKm
        int oilChangeIntervalKm
        int lastServiceKm
        int lastOilChangeKm
        datetime lastService
        datetime lastOilChange
        datetime lastFuelRefill
        datetime createdAt
        datetime updatedAt
    }

    VehicleServiceLog {
        string id PK
        string vehicleId FK
        string tipe "service | oil_change | fuel | other"
        datetime tanggal
        int kilometer
        string deskripsi
        float biaya
        datetime createdAt
    }

    Pemesanan {
        string id PK
        string pemohonId FK
        string driverId FK
        string vehicleId FK
        string approver1Id FK
        string approver2Id FK
        string namaPemesan
        string departemen
        datetime tanggalMulai
        datetime tanggalSelesai
        string tujuan
        float jarakKm
        int jumlahPenumpang
        string keterangan
        string status "pending_level_1 | pending_level_2 | approved | rejected"
        string catatanApprover1
        string catatanApprover2
        datetime approvedAt
        datetime createdAt
        datetime updatedAt
    }

    LogAktivitas {
        string id PK
        string userId FK
        string pemesananId FK
        string aksi "LOGIN | CREATE_PEMESANAN | APPROVE_LEVEL_1 | APPROVE_LEVEL_2 | REJECT_LEVEL_1 | REJECT_LEVEL_2 | EXPORT_EXCEL"
        string detail
        datetime timestamp
    }
```

### Spesifikasi Database

| Item | Detail |
|------|--------|
| **Database** | SQLite 3.x (via Prisma) |
| **PHP Version** | _Not Applicable_ (Node.js 20.x / Next.js) |
| **Framework** | Next.js 16 (Full-stack TypeScript) |

---

## 🔌 API Endpoints

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/api/users` | Daftar semua user |
| `POST` | `/api/users` | Tambah user baru |
| `GET` | `/api/vehicles` | Daftar kendaraan |
| `POST` | `/api/vehicles` | Tambah kendaraan baru |
| `GET` | `/api/vehicles/[id]` | Detail kendaraan |
| `PATCH` | `/api/vehicles/[id]` | Update kendaraan / catat service |
| `DELETE` | `/api/vehicles/[id]` | Hapus kendaraan |
| `GET` | `/api/pemesanan` | Daftar pemesanan |
| `POST` | `/api/pemesanan` | Buat pemesanan baru |
| `PATCH` | `/api/pemesanan/[id]` | Approve/reject pemesanan |
| `GET` | `/api/logs` | Log aktivitas (200 terbaru) |
| `POST` | `/api/logs` | Catat log baru |
| `GET` | `/api/distance?tujuan=` | Hitung jarak Jakarta → kota tujuan |

---

## 📁 Struktur Proyek

```
tes-teknikal/
├── app/
│   ├── api/
│   │   ├── distance/route.ts       # Hitung jarak (OpenStreetMap)
│   │   ├── logs/route.ts           # CRUD log aktivitas
│   │   ├── pemesanan/
│   │   │   ├── route.ts            # CRUD pemesanan
│   │   │   └── [id]/route.ts      # Approve/reject
│   │   ├── users/route.ts          # CRUD user
│   │   └── vehicles/
│   │       ├── route.ts            # CRUD kendaraan
│   │       └── [id]/route.ts      # Detail & service
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/          # shadcn/ui
│   ├── layout/      # AppLayout
│   ├── template/    # Dashboard, Approval, Kendaraan, Log, PemesananForm
│   └── shared/      # StatCard, VehicleCard, LoginDialog, dll
├── lib/
│   ├── db.ts        # Prisma client
│   ├── types.ts     # Type definitions
│   ├── utils.ts     # Utility functions
│   └── vehicle-utils.ts
└── prisma/
    ├── schema.prisma
    ├── seed.ts
    └── dev.db
```
