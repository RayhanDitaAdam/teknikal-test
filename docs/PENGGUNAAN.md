# 📘 Panduan Penggunaan Aplikasi

Panduan lengkap menggunakan Sistem Pemesanan Kendaraan Operasional dari awal sampai akhir.

---

## 📋 Daftar Isi

1. [Login](#1-login)
2. [Dashboard](#2-dashboard)
3. [Membuat Pemesanan Baru](#3-membuat-pemesanan-baru)
4. [Approval 2 Level](#4-approval-2-level)
5. [Manajemen Kendaraan](#5-manajemen-kendaraan)
6. [Log Aktivitas](#6-log-aktivitas)
7. [Export Excel](#7-export-excel)

---

## 1. Login

Saat pertama kali membuka aplikasi, akan muncul dialog **Pilih User**.

**Langkah:**
1. Klik salah satu user dari daftar yang tersedia
2. User akan terbagi dalam 3 role:
   - 🛡️ **Admin** — bisa melakukan semua aksi
   - ✅ **Approver** — hanya bisa approve/tolak pemesanan
   - 🚚 **Driver** — hanya bisa melihat data (read-only)

> **Catatan:** Aplikasi tidak menggunakan password. Cukup pilih user dan langsung masuk.

Setelah login, sidebar kiri akan menampilkan nama dan role user yang sedang aktif.

---

## 2. Dashboard

Dashboard adalah halaman utama yang menampilkan ringkasan seluruh data.

### 2.1 Statistik Ringkasan
Di bagian atas terdapat 5 kartu statistik:
| Kartu | Warna | Arti |
|-------|-------|------|
| Total Pemesanan | Biru | Semua pemesanan yang pernah dibuat |
| Pending Level 1 | Kuning | Menunggu persetujuan Approver 1 |
| Pending Level 2 | Oranye | Menunggu persetujuan Approver 2 |
| Disetujui | Hijau | Pemesanan yang sudah final disetujui |
| Ditolak | Merah | Pemesanan yang ditolak |

### 2.2 Grafik Pemesanan
- **Pemesanan per Status** — Grafik batang warna-warni (kuning, oranye, hijau, merah)
- **Distribusi Status** — Sama seperti di atas, tampilan berbeda
- **Pemesanan per Departemen** — Grafik batang horizontal, lihat departemen mana yang paling sering memesan
- **Trend Pemesanan** — Line chart pemesanan per bulan

### 2.3 Tabel Kendaraan
Tabel ringkas kondisi kendaraan:
- Nama & plat nomor
- Status (`Aman`/`Perlu Service`/`Bahaya`)
- Kilometer terakhir
- Konsumsi BBM (km/L)
- Jumlah pemakaian (berapa kali dipesan)

### 2.4 Export Excel
Tombol **Export ke Excel** untuk mendownload laporan pemesanan dalam format `.xlsx`.

---

## 3. Membuat Pemesanan Baru

Menu ini hanya bisa diakses oleh role **Admin**.

### 3.1 Isi Form Pemesanan

| Field | Keterangan | Wajib |
|-------|------------|-------|
| Nama Pemesan | Terisi otomatis sesuai user login (read-only) | ✔ |
| Departemen | Contoh: IT, Finance, HRD | ✔ |
| Tanggal Mulai | Tanggal pemakaian kendaraan | ✔ |
| Tanggal Selesai | Tanggal selesai pemakaian | ✔ |
| Tujuan | Nama kota/nama tempat | ✔ |
| Jumlah Penumpang | Berapa orang yang ikut | ✔ |
| Pilih Driver | Pilih dari daftar driver yang tersedia | ✘ |
| Pilih Kendaraan | Pilih kendaraan yang akan dipakai | ✘ |
| Pilih Approver 1 | Approver pertama yang akan menyetujui | ✔ |
| Pilih Approver 2 | Approver kedua yang akan menyetujui | ✔ |
| Keterangan | Catatan tambahan (opsional) | ✘ |

### 3.2 Fitur Auto-Distance

Saat mengetik **Tujuan**, sistem otomatis menghitung jarak dari Jakarta:
- Gunakan API OpenStreetMap (Nominatim) untuk geocoding
- Hitung jarak dengan rumus **Haversine**
- Jarak akan muncul otomatis di bawah field tujuan
- Contoh: ketika mengetik "Bandung", akan muncul `Jarak dari Jakarta: 150 km`

### 3.3 Fitur Smart Vehicle Status

Saat memilih kendaraan, sistem akan menampilkan info tambahan:
- Kilometer terakhir
- Konsumsi BBM
- Sisa jarak sebelum service berikutnya
- Peringatan jika kendaraan dalam status `service` (tidak disarankan perjalanan >100km)
- Kendaraan status `danger` tidak bisa dipilih

### 3.4 Validasi Approver

Approver 1 dan Approver 2 tidak boleh dipilih sama — sistem akan otomatis mengosongkan field jika user yang sama dipilih.

### 3.5 Submit

Setelah submit berhasil:
- Status pemesanan: **Pending Level 1**
- Muncul notifikasi hijau sukses
- Form akan tereset
- Data langsung masuk ke dashboard dan menu approval

---

## 4. Approval 2 Level

Menu ini menampilkan antrian pemesanan yang perlu disetujui.

### 4.1 Cara Approval

**Level 1 (Approver 1):**
1. Buka tab **Approval**
2. Cari bagian **Pending Level 1**
3. Klik **Setuju** (hijau) atau **Tolak** (merah)
4. Isi catatan (opsional) lalu konfirmasi

Jika disetujui → status berubah jadi **Pending Level 2**
Jika ditolak → status berubah jadi **Ditolak** ❌

**Level 2 (Approver 2):**
1. Tunggu Approver 1 menyetujui dulu
2. Cari bagian **Pending Level 2**
3. Klik **Setuju** atau **Tolak**
4. Isi catatan (opsional) lalu konfirmasi

Jika disetujui → status berubah jadi **Disetujui** ✅ (SELESAI)
Jika ditolak → status berubah jadi **Ditolak** ❌

### 4.2 Siapa yang Bisa Approval
- **Admin** bisa approve level 1 dan level 2
- **Approver 1** (Budi Santoso) hanya bisa approve level 1
- **Approver 2** (Siti Rahmawati) hanya bisa approve level 2
- **Driver** tidak bisa melakukan approval

### 4.3 Riwayat Approval
Di bagian bawah menu Approval terdapat tabel **Riwayat Approval** yang menampilkan 10 data terakhir yang sudah disetujui/ditolak, lengkap dengan catatan dari approver.

---

## 5. Manajemen Kendaraan

Menu untuk mengelola data kendaraan operasional.

### 5.1 Melihat Kendaraan
Semua kendaraan ditampilkan dalam bentuk **card grid** dengan informasi:
- Nama dan plat nomor
- Status (`Aman` / `Perlu Service` / `Bahaya`)
- Kilometer saat ini
- Jarak service (setiap berapa km)
- Sisa jarak sebelum service berikutnya
- Konsumsi BBM (km/L)
- Kepemilikan (Milik / Sewa)
- Peringatan ganti oli (jika sudah waktunya)

### 5.2 Filter & Cari
- **Search bar**: Cari berdasarkan nama kendaraan atau plat nomor
- **Filter status**: Pilih `Semua Status`, `Aman`, `Perlu Service`, atau `Bahaya`

### 5.3 Tambah Kendaraan Baru
1. Klik tombol **Tambah Kendaraan** (atas kanan)
2. Isi form:
   - Nama kendaraan
   - Plat nomor
   - Tipe (Angkutan Orang / Angkutan Barang)
   - Kepemilikan (Milik Perusahaan / Sewa)
   - KM Awal
   - Bensin (km/L)
   - Service setiap (km)
   - Ganti Oli setiap (km)
3. Klik **Simpan**

### 5.4 Detail & Riwayat Service
Klik pada card kendaraan untuk melihat detail:
- Informasi lengkap kendaraan
- **Riwayat Service** — tabel semua aktivitas service, ganti oli, isi BBM
- **Tombol aksi cepat**:
  - **Service Selesai** — catat servis rutin
  - **Ganti Oli** — catat pergantian oli
  - **Isi BBM** — catat pengisian bahan bakar

### 5.5 Status Kendaraan Otomatis
Sistem menentukan status kendaraan secara otomatis berdasarkan data service terakhir:

| Sisa Jarak ke Service | Status | Warna |
|----------------------|--------|-------|
| > 2.000 km | ✅ Aman | Hijau |
| ≤ 2.000 km | ⚠️ Perlu Service | Kuning |
| ≤ 0 km (lewat) | 🚫 Bahaya | Merah |

---

## 6. Log Aktivitas

Menu untuk melihat semua aktivitas yang terjadi di sistem.

### 6.1 Jenis Aktivitas yang Tercatat

| Aksi | Ikon | Arti |
|------|------|------|
| `LOGIN` | 🔵 | User masuk ke sistem |
| `CREATE_PEMESANAN` | 📄 | Pemesanan baru dibuat |
| `APPROVE_LEVEL_1` | ✅ | Approver 1 menyetujui |
| `APPROVE_LEVEL_2` | ✅ | Approver 2 menyetujui |
| `REJECT_LEVEL_1` | ❌ | Approver 1 menolak |
| `REJECT_LEVEL_2` | ❌ | Approver 2 menolak |
| `EXPORT_EXCEL` | 📥 | User mengexport laporan |

### 6.2 Fitur Pencarian & Filter
- **Search bar**: Cari berdasarkan user, detail aktivitas, atau pemesanan terkait
- **Filter aksi**: Pilih jenis aksi tertentu (Login, Buat Pemesanan, dll)

### 6.3 Detail Log
Setiap baris log menampilkan:
- Waktu kejadian (tanggal + jam)
- User (nama + role badge)
- Aksi (badge warna sesuai jenis)
- Detail informasi
- Pemesanan terkait (nama pemesan, tujuan, status)

---

## 7. Export Excel

Tersedia di halaman **Dashboard**.

### 7.1 Cara Export
1. Buka tab **Dashboard**
2. Scroll ke bagian **Export Data**
3. Klik tombol **Export ke Excel**
4. File akan terdownload otomatis dengan format: `laporan_pemesanan_YYYYMMDD_HHmm.xlsx`

### 7.2 Data yang Diexport
File Excel berisi kolom:
| Kolom | Keterangan |
|-------|------------|
| Nama Pemesan | - |
| Departemen | - |
| Driver | Nama driver yang ditugaskan |
| Kendaraan | Nama kendaraan (plat nomor) |
| Approver 1 | - |
| Approver 2 | - |
| Tgl Mulai | Format DD/MM/YYYY |
| Tgl Selesai | Format DD/MM/YYYY |
| Tujuan | - |
| Jarak (km) | - |
| Penumpang | Jumlah penumpang |
| Status | Pending / Disetujui / Ditolak |
| Dibuat | Tanggal + jam pembuatan |

### 7.3 Tracking Export
Setiap kali export, sistem otomatis mencatat log:
> *"Export 10 data pemesanan ke Excel"*

---

## 🎯 Skenario Lengkap (Dari 0 ke 100%)

Berikut skenario penggunaan aplikasi dari awal sampai selesai:

### Skenario: Pemesanan Kendaraan untuk Perjalanan Dinas

**1. Login sebagai Admin**
```
Buka app → Klik "Admin Utama" → Masuk ke Dashboard
```

**2. Cek Dashboard**
```
Lihat statistik → Cek grafik → Lihat kondisi kendaraan
```

**3. Buat Pemesanan Baru**
```
Klik "Pemesanan Baru" → Isi form:
  - Departemen: IT
  - Tgl: 20/05/2026 - 20/05/2026
  - Tujuan: Bandung (jarak auto-fill: 150 km)
  - Penumpang: 3
  - Driver: Ahmad Supriyadi
  - Kendaraan: Toyota Avanza
  - Approver 1: Budi Santoso
  - Approver 2: Siti Rahmawati
→ Klik Submit
→ Status: Pending Level 1 ✅
```

**4. Login sebagai Approver 1 (Budi Santoso)**
```
Klik foto profil → Pilih user Budi Santoso
Klik "Approval" → Lihat Pending Level 1
Klik "Setuju" → Isi catatan: "Setuju, perjalanan dinas"
→ Status: Pending Level 2 ✅
```

**5. Login sebagai Approver 2 (Siti Rahmawati)**
```
Klik foto profil → Pilih user Siti Rahmawati
Klik "Approval" → Lihat Pending Level 2
Klik "Setuju" → Isi catatan: "Disetujui"
→ Status: Disetujui ✅ (SELESAI)
```

**6. Cek Log Aktivitas**
```
Klik "Log Aktivitas" → Lihat seluruh riwayat:
  - Admin create pemesanan
  - Approver 1 approve
  - Approver 2 approve
```

**7. Export Laporan**
```
Klik "Dashboard" → Tombol "Export ke Excel"
→ File .xlsx terdownload
```

---

> **💡 Tip:** Admin bisa melakukan approve di level 1 dan 2 jika ingin mempercepat proses.
