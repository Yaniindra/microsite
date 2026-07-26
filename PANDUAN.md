# Panduan Menjalankan Microsite Registrasi di Komputer Lokal

Dokumen ini menjelaskan langkah-langkah dari awal hingga aplikasi bisa dijalankan di komputer Anda — tidak diperlukan pengalaman sebagai software engineer.

---

## Daftar Isi

1. [Apa yang Dibutuhkan](#1-apa-yang-dibutuhkan)
2. [Instalasi Node.js](#2-instalasi-nodejs)
3. [Instalasi Git](#3-instalasi-git)
4. [Mengunduh Kode (Clone Repository)](#4-mengunduh-kode-clone-repository)
5. [Masuk ke Folder Proyek](#5-masuk-ke-folder-proyek)
6. [Menginstal Paket yang Dibutuhkan](#6-menginstal-paket-yang-dibutuhkan)
7. [Menyiapkan File Konfigurasi (.env)](#7-menyiapkan-file-konfigurasi-env)
8. [Menjalankan Aplikasi](#8-menjalankan-aplikasi)
9. [Membuka Aplikasi di Browser](#9-membuka-aplikasi-di-browser)
10. [Cara Menggunakan Aplikasi](#10-cara-menggunakan-aplikasi)
11. [Menghentikan Aplikasi](#11-menghentikan-aplikasi)
12. [Menjalankan Ulang di Lain Waktu](#12-menjalankan-ulang-di-lain-waktu)
13. [Troubleshooting (Jika Ada Masalah)](#13-troubleshooting-jika-ada-masalah)

---

## 1. Apa yang Dibutuhkan

Sebelum mulai, pastikan komputer Anda sudah memiliki dua program berikut:

| Program | Versi minimal | Untuk apa |
|---------|--------------|-----------|
| **Node.js** | v22 ke atas | Menjalankan aplikasi web |
| **Git** | versi berapa saja | Mengunduh kode dari GitHub |

> **Belum punya?** Ikuti langkah instalasi di bawah. Jika sudah ada, lewati ke [Langkah 4](#4-mengunduh-kode-clone-repository).

---

## 2. Instalasi Node.js

### Cara cek apakah Node.js sudah terpasang

Buka **Terminal** (Mac/Linux) atau **Command Prompt / PowerShell** (Windows), lalu ketik:

```
node --version
```

Jika muncul angka seperti `v26.3.1` atau `v22.x.x`, Node.js sudah terpasang — lewati ke langkah berikutnya.

Jika muncul pesan error seperti `command not found`, ikuti instalasi berikut.

### Instalasi Node.js

1. Buka browser dan pergi ke **https://nodejs.org**
2. Klik tombol besar berlabel **"LTS"** (versi yang direkomendasikan)
3. Unduh file installer sesuai sistem operasi Anda:
   - Windows → file `.msi`
   - macOS → file `.pkg`
4. Buka file yang sudah diunduh dan ikuti wizard instalasi (klik Next terus sampai selesai)
5. Setelah selesai, tutup dan buka ulang Terminal/Command Prompt
6. Verifikasi dengan mengetik `node --version` — seharusnya muncul nomor versi

---

## 3. Instalasi Git

### Cara cek apakah Git sudah terpasang

Di Terminal/Command Prompt, ketik:

```
git --version
```

Jika muncul seperti `git version 2.x.x`, Git sudah ada — lewati ke langkah berikutnya.

### Instalasi Git

- **Windows:** Unduh dari **https://git-scm.com/download/win**, jalankan installer, klik Next terus
- **macOS:** Buka Terminal, ketik `git --version` — macOS biasanya akan otomatis menawarkan instalasi. Atau unduh dari **https://git-scm.com/download/mac**
- **Linux (Ubuntu/Debian):** Jalankan `sudo apt install git`

---

## 4. Mengunduh Kode (Clone Repository)

"Clone" artinya menyalin semua kode dari GitHub ke komputer Anda.

1. Buka **Terminal** (Mac/Linux) atau **Command Prompt** (Windows)

2. Arahkan ke folder di mana Anda ingin menyimpan proyek ini. Contoh, jika ingin menyimpan di folder `Documents`:

   **Mac/Linux:**
   ```
   cd ~/Documents
   ```

   **Windows:**
   ```
   cd %USERPROFILE%\Documents
   ```

3. Jalankan perintah clone berikut:

   ```
   git clone https://github.com/Yaniindra/microsite.git
   ```

4. Tunggu sampai proses selesai. Akan muncul pesan seperti:
   ```
   Cloning into 'microsite'...
   remote: Enumerating objects: ...
   Resolving deltas: done.
   ```

5. Sekarang ada folder baru bernama `microsite` di dalam `Documents` Anda.

---

## 5. Masuk ke Folder Proyek

Setelah clone selesai, masuk ke dalam folder proyek:

```
cd microsite
```

Untuk memastikan Anda berada di tempat yang benar, ketik:

```
ls
```
(Mac/Linux) atau:
```
dir
```
(Windows)

Anda akan melihat daftar file seperti: `app/`, `package.json`, `vite.config.ts`, dan lain-lain.

---

## 6. Menginstal Paket yang Dibutuhkan

Aplikasi ini menggunakan banyak "paket" (library) pihak ketiga. Semua paket tersebut perlu diunduh terlebih dahulu.

Jalankan perintah berikut di dalam folder `microsite`:

```
npm install
```

> Proses ini membutuhkan koneksi internet dan bisa memakan waktu 1–3 menit tergantung kecepatan internet Anda.

Setelah selesai, akan muncul pesan seperti:
```
added 200 packages in 10s
```

Dan akan muncul folder baru bernama `node_modules/` — folder ini berisi semua paket yang diunduh (jangan dihapus).

---

## 7. Menyiapkan File Konfigurasi (.env)

Aplikasi membutuhkan file konfigurasi bernama `.env` yang berisi pengaturan seperti password admin dan nama perusahaan.

### Langkah-langkah:

1. Di dalam folder `microsite`, sudah ada file contoh bernama `.env.example`. Anda perlu menyalinnya menjadi `.env`.

   **Mac/Linux:**
   ```
   cp .env.example .env
   ```

   **Windows (Command Prompt):**
   ```
   copy .env.example .env
   ```

   **Windows (PowerShell):**
   ```
   Copy-Item .env.example .env
   ```

2. Buka file `.env` dengan teks editor (Notepad, TextEdit, atau VS Code):

   **Mac:**
   ```
   open -e .env
   ```

   **Windows:**
   ```
   notepad .env
   ```

3. Isi file `.env` terlihat seperti ini:

   ```
   SESSION_SECRET=your-strong-random-secret-here
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=admin123
   COMPANY_NAME=Nama Perusahaan
   REQUIRE_CONSENT=true
   SHOW_NOTE_FIELD=true
   ```

4. Ubah nilai-nilai berikut sesuai kebutuhan:

   | Variabel | Keterangan | Contoh |
   |----------|-----------|--------|
   | `SESSION_SECRET` | Kata sandi rahasia untuk enkripsi sesi — isi dengan teks acak yang panjang | `xk92mNpQ7rLvTz...` |
   | `ADMIN_USERNAME` | Username untuk login ke halaman admin | `admin` |
   | `ADMIN_PASSWORD` | Password untuk login ke halaman admin | `password_kuat_anda` |
   | `COMPANY_NAME` | Nama perusahaan yang tampil di aplikasi | `PT Maju Bersama` |
   | `REQUIRE_CONSENT` | Apakah checkbox persetujuan wajib dicentang (`true`/`false`) | `true` |
   | `SHOW_NOTE_FIELD` | Apakah kolom catatan ditampilkan (`true`/`false`) | `true` |

5. Simpan file setelah selesai mengedit.

> **Penting:** File `.env` bersifat rahasia dan tidak boleh dikirim ke GitHub. File ini sudah otomatis diabaikan oleh Git.

---

## 8. Menjalankan Aplikasi

Setelah semua persiapan selesai, jalankan aplikasi dengan perintah:

```
npm run dev
```

Tunggu beberapa detik. Jika berhasil, Anda akan melihat tampilan seperti ini di Terminal:

```
  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Aplikasi sudah berjalan!

> **Catatan:** Biarkan jendela Terminal tetap terbuka selama menggunakan aplikasi. Menutup Terminal akan menghentikan aplikasi.

---

## 9. Membuka Aplikasi di Browser

Buka browser (Chrome, Firefox, Safari, Edge) dan pergi ke alamat:

```
http://localhost:5173
```

Anda akan melihat **halaman formulir registrasi** seperti pada desain.

### Halaman-halaman yang tersedia:

| Alamat | Deskripsi |
|--------|-----------|
| `http://localhost:5173/` | Halaman registrasi publik |
| `http://localhost:5173/thanks?name=...` | Halaman terima kasih setelah submit |
| `http://localhost:5173/admin/login` | Halaman login admin |
| `http://localhost:5173/admin` | Dashboard admin (perlu login dulu) |

---

## 10. Cara Menggunakan Aplikasi

### Mengisi Formulir Registrasi (Halaman Publik)

1. Buka `http://localhost:5173/`
2. Isi kolom-kolom berikut:
   - **Nama Lengkap** *(wajib)*
   - **Email Aktif** *(wajib)*
   - **No. HP / WhatsApp** *(wajib)*
   - **Nama Perusahaan** *(opsional)*
   - **Tertarik dengan apa** — pilih dari dropdown
   - **Catatan Tambahan** *(opsional)*
3. Centang kotak persetujuan
4. Klik tombol **"Kirim Data"**
5. Jika berhasil, halaman akan berpindah ke pesan terima kasih

### Mengakses Halaman Admin

1. Buka `http://localhost:5173/admin/login`
2. Masukkan username dan password sesuai yang Anda isi di file `.env`
   - Default: username `admin`, password `admin123`
3. Klik **"Masuk"**
4. Anda akan masuk ke dashboard yang menampilkan:
   - **Total registrant** — jumlah total data yang masuk
   - **Tabel data** — daftar semua registrant
   - **Kolom pencarian** — ketik nama, email, atau perusahaan untuk menyaring data
   - **Tombol "Unduh CSV"** — mengunduh semua data dalam format spreadsheet

### Mengunduh Data sebagai CSV

1. Login ke admin panel
2. Klik tombol **"Unduh CSV"** di pojok kanan atas tabel
3. File `data-registrant.csv` akan terunduh otomatis
4. Buka file tersebut dengan Microsoft Excel atau Google Sheets

### Logout dari Admin Panel

Klik tombol **"Keluar"** di pojok kanan atas halaman admin.

---

## 11. Menghentikan Aplikasi

Untuk menghentikan server, klik pada jendela Terminal yang menjalankan aplikasi, lalu tekan:

```
Ctrl + C
```

(Tahan tombol `Ctrl` dan tekan `C` bersamaan)

Aplikasi akan berhenti dan Terminal kembali ke prompt normal.

---

## 12. Menjalankan Ulang di Lain Waktu

Jika Anda sudah pernah menjalankan aplikasi sebelumnya dan ingin menjalankannya lagi:

1. Buka Terminal
2. Masuk ke folder proyek:
   ```
   cd ~/Documents/microsite
   ```
3. Jalankan aplikasi:
   ```
   npm run dev
   ```
4. Buka browser ke `http://localhost:5173`

> `npm install` **tidak perlu** dijalankan lagi kecuali ada pembaruan dari repository.

---

## 13. Troubleshooting (Jika Ada Masalah)

### "command not found: node" atau "node is not recognized"

Node.js belum terpasang atau perlu restart Terminal. Ulangi [Langkah 2](#2-instalasi-nodejs), lalu tutup dan buka ulang Terminal.

---

### "command not found: git"

Git belum terpasang. Ulangi [Langkah 3](#3-instalasi-git).

---

### "EADDRINUSE: address already in use :::5173"

Port 5173 sudah dipakai oleh proses lain. Coba hentikan proses yang menggunakannya atau jalankan dengan port berbeda:

```
npm run dev -- --port 3000
```

Lalu buka browser ke `http://localhost:3000`.

---

### Halaman tidak muncul / browser menampilkan "This site can't be reached"

Pastikan aplikasi sedang berjalan (Terminal menampilkan `➜ Local: http://localhost:5173/`). Jika belum, jalankan `npm run dev` terlebih dahulu.

---

### "npm install" gagal atau ada error merah

Pastikan koneksi internet Anda aktif, lalu coba jalankan ulang:

```
npm install
```

Jika masih gagal, coba hapus folder `node_modules` dan file `package-lock.json`, lalu install ulang:

**Mac/Linux:**
```
rm -rf node_modules package-lock.json
npm install
```

**Windows:**
```
rmdir /s /q node_modules
del package-lock.json
npm install
```

---

### Data admin/password salah

Buka file `.env` dan periksa kembali nilai `ADMIN_USERNAME` dan `ADMIN_PASSWORD`. Pastikan tidak ada spasi ekstra sebelum atau sesudah tanda `=`.

---

### Perubahan di file `.env` tidak berpengaruh

Setiap kali mengubah file `.env`, hentikan aplikasi (`Ctrl + C`) dan jalankan ulang (`npm run dev`).

---

*Dokumen ini dibuat untuk proyek Microsite Registrasi — versi 1.0*
