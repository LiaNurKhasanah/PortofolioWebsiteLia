# Lia Nur Khasanah - Professional Portfolio Website

Website portofolio interaktif, modern, dan responsif milik **Lia Nur Khasanah** (Mahasiswi Ilmu Komunikasi, Content Writer, dan Voice Over Talent). Aplikasi ini dibangun dengan Next.js 15, Tailwind CSS, Supabase, dan Cloudflare R2, mengadopsi struktur arsitektur **Model-View-Controller (MVC)** yang modular.

## 🚀 Fitur Utama
- **Desain Interaktif & Estetis**: Animasi transisi halus didukung oleh AOS dan Lenis (Smooth Scroll).
- **SEO & Google Analytics Terpadu**: Dilengkapi dengan skema Sitemap Index dinamis, optimasi tag judul/deskripsi, verifikasi webmaster (Google, Yandex, Bing), serta pelacakan performa lalu lintas dengan Google Analytics 4 (GA4).
- **Sub-rute Virtual**: Memungkinkan mesin pencari merayapi sub-halaman khusus seperti `/about`, `/portofolio`, `/voiceover`, dan `/kontak` dengan pengalihan server-side (*307 Temporary Redirect*) untuk memusatkan SEO (*Link Juice*) ke halaman utama.
- **Panel Admin Keamanan Tinggi**:
  - Autentikasi berbasis HTTP-only Signed Cookie.
  - Verifikasi tipe data server-side dengan skema Zod.
  - Sistem pencatatan aktivitas admin (Audit Logging).
- **Pemisahan Konfigurasi Foto**: Memungkinkan administrator mengatur foto utama di bagian Home/Hero secara terpisah dari foto detail di bagian About (Kenali Aku Lebih Dekat).

---

## 🛠️ Tech Stack
- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS 3, Shadcn UI
- **Database & Auth**: Supabase (PostgreSQL)
- **Object Storage**: Cloudflare R2 (S3-Compatible)
- **Hosting**: Vercel

---

## ⚙️ Inisialisasi & Setup Lokal

### 1. Salin Environment Variables
Salin template `.env.local.example` menjadi `.env.local` pada direktori `/frontend`:
```bash
cp frontend/.env.local.example frontend/.env.local
```

Isi variabel-variabel di bawah ini dengan kredensial proyek Anda:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Cloudflare R2 Configuration
R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=your-r2-access-key
R2_SECRET_ACCESS_KEY=your-r2-secret-key
R2_BUCKET_NAME=your-bucket-name
NEXT_PUBLIC_R2_PUBLIC_URL=https://your-public-url.com

# Admin Authentication
ADMIN_USERNAME=liabocil
ADMIN_PASSWORD=your-secure-password
ADMIN_JWT_SECRET=your-jwt-secret-at-least-32-chars
ADMIN_SESSION_SECRET=your-session-secret-at-least-32-chars

# SEO & Analytics
NEXT_PUBLIC_SITE_URL=https://lianurkhasanah.web.id
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GOOGLE_VERIFICATION=your-google-token
NEXT_PUBLIC_YANDEX_VERIFICATION=your-yandex-token
NEXT_PUBLIC_BING_VERIFICATION=your-bing-token
```

### 2. Jalankan Migrasi Database
Jalankan berkas migrasi SQL yang berada di dalam folder `supabase/migrations/` di server Supabase atau gunakan Supabase CLI untuk menginisialisasi skema tabel:
- `001_init.sql` (Tabel profil, keahlian, pengalaman, proyek, dll)
- `002_character_values.sql` (Tabel nilai karakter)
- `003_admin_audit_logs.sql` (Tabel pencatatan audit log admin)
- `004_socials_and_character_values.sql` (Penyelarasan kolom TikTok dan nilai karakter default)
- `005_about_photo.sql` (Kolom pemisahan foto profile bagian About)

Jalankan perintah seed untuk mengisi data awal:
```bash
node supabase/seed_cv.js
```

### 3. Jalankan Aplikasi
Masuk ke direktori `frontend`, instal dependensi, lalu jalankan server pengembangan:
```bash
cd frontend
npm install
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) pada browser Anda.

---

## ⚖️ Lisensi
Aplikasi ini dilisensikan di bawah **Apache License 2.0**. Silakan periksa berkas `LICENSE` untuk informasi lebih lengkap.
