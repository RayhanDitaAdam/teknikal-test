# 🚗 Sistem Pemesanan Kendaraan Operasional

Aplikasi manajemen pemesanan kendaraan operasional dengan **approval 2 level** untuk lingkungan logistik tambang nikel.

---

## 🛠 Tech Stack

| Komponen | Teknologi |
|----------|-----------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **Database** | SQLite via Prisma ORM |
| **UI** | shadcn/ui + Tailwind CSS 4 |
| **Grafik** | Recharts |
| **Export** | SheetJS (xlsx) |

## 🚀 Cara Menjalankan

```bash
pnpm install
pnpm prisma migrate dev
pnpm seed
pnpm dev
```

Buka **http://localhost:3000**.

## 🔄 Flow Approval

```
Admin Input → Approver 1 Setuju → Approver 2 Setuju → ✅ Selesai
                  ↓                      ↓
              ❌ Ditolak             ❌ Ditolak
```

## 👤 Akun

| Nama | Role | Email |
|------|------|-------|
| Admin Utama | Admin | admin@company.com |
| Budi Santoso | Approver 1 | approver1@company.com |
| Siti Rahmawati | Approver 2 | approver2@company.com |
| Ahmad Supriyadi | Driver | driver1@company.com |
| Dodi Kurniawan | Driver | driver2@company.com |
| Rudi Hermawan | Driver | driver3@company.com |

> Login tanpa password — cukup pilih user dari dialog.

---

📘 Panduan penggunaan lengkap → [`docs/PENGGUNAAN.md`](./docs/PENGGUNAAN.md)  
📖 Dokumentasi teknis → [`docs/`](./docs)
