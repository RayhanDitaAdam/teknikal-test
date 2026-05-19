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

## 🚀 Cara Menjalankan (Manual)

```bash
git clone https://github.com/RayhanDitaAdam/teknikal-test.git
cd teknikal-test
pnpm install
pnpm prisma migrate dev
pnpm seed
pnpm dev
```

Buka **http://localhost:3000**.

## 🐳 Docker (Opsi Termudah)

```bash
git clone https://github.com/RayhanDitaAdam/teknikal-test.git
cd teknikal-test
docker compose up -d
```

Buka **http://localhost:3000**.

> Data sudah langsung terisi seed. Container siap dalam ~30 detik (tergantung koneksi).

### Perintah Docker Lainnya

| Perintah | Fungsi |
|----------|--------|
| `docker compose up -d` | Jalankan di background |
| `docker compose down` | Hentikan container |
| `docker compose logs -f` | Lihat log real-time |
| `docker compose restart` | Restart container |

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

### Kendaraan Seed

| Kendaraan | Plat | Unit | Status |
|-----------|------|------|--------|
| Toyota Avanza | B 1234 CD | 2 unit | Aman |
| Honda CRV | B 5678 EF | 1 unit | Perlu Service |
| Suzuki Ertiga | B 9012 GH | 3 unit | Aman |
| Mitsubishi Pajero | B 3456 IJ | 1 unit | Bahaya |
| Isuzu Elf | B 7890 KL | 1 unit | Perlu Service |

> Setiap kendaraan punya **jumlah unit** — ketersediaan dicek otomatis saat pemesanan berdasarkan tanggal.

---

📘 Panduan penggunaan lengkap → [`docs/PENGGUNAAN.md`](./docs/PENGGUNAAN.md)  
📖 Dokumentasi teknis → [`docs/`](./docs)
