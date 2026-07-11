# Arsitektur Lia Portfolio Web

Aplikasi web portofolio menggunakan **Next.js App Router** dengan stack:

- **Next.js 15** (App Router) – Framework React fullstack
- **Supabase** (PostgreSQL) – Database cloud
- **Cloudflare R2** (S3-compatible) – File/image storage
- **Tailwind CSS 3** – Utility-first styling
- **Vercel** – Deployment target

Arsitektur menggunakan pola **Model-View-Controller (MVC)** yang diadaptasi untuk Next.js.

## Struktur Folder

```text
LiaPortofolioWeb/
├── STRUCTURE.md              - Dokumentasi arsitektur (file ini)
│
├── frontend/                 - Next.js application root
│   ├── package.json          - Dependencies & scripts
│   ├── next.config.js        - Konfigurasi Next.js
│   ├── tsconfig.json         - Konfigurasi TypeScript
│   ├── tailwind.config.ts    - Konfigurasi Tailwind CSS
│   ├── postcss.config.mjs    - PostCSS plugins
│   ├── .env.local.example    - Template environment variables
│   ├── .gitignore            - Git ignore rules
│   │
│   ├── app/                  [NEXT.JS APP ROUTER]
│   │   ├── globals.css       - Tailwind directives + custom CSS
│   │   ├── layout.tsx        - Root layout (fonts, metadata, ThemeProvider)
│   │   ├── loading.tsx       - Loading skeleton (Suspense fallback)
│   │   ├── page.tsx          - "/" – Halaman publik portfolio (ISR 60s)
│   │   │
│   │   ├── kelola/
│   │   │   ├── page.tsx      - "/kelola" – Login admin
│   │   │   └── panel/
│   │   │       └── page.tsx  - "/kelola/panel" – Dashboard admin
│   │   │
│   │   └── api/              [API ROUTES – Server-side]
│   │       ├── auth/login/route.ts   - POST /api/auth/login
│   │       ├── upload/route.ts       - POST /api/upload (R2)
│   │       └── contact/route.ts      - POST /api/contact
│   │
│   ├── models/               [M] DATA & KONFIGURASI
│   │   ├── types.ts          - Definisi tipe data
│   │   └── constants.ts      - Konfigurasi statis (Warna, Teks, Navigasi)
│   │
│   ├── views/                [V] PRESENTATION & UI
│   │   ├── public/           - Komponen halaman publik
│   │   ├── admin/            - Komponen dashboard admin
│   │   └── shared/           - Komponen bersama
│   │
│   ├── controllers/          [C] LOGIC & ORCHESTRATION
│   │   ├── PortfolioPage.tsx - Controller halaman publik
│   │   ├── AdminLoginPage.tsx- Controller login admin
│   │   └── AdminDashboard.tsx- Controller dashboard admin
│   │
│   ├── hooks/backend/        [DATA FETCHING]
│   │   ├── portfolio.ts      - useGetData, useSendContact (Supabase)
│   │   └── admin.ts          - useLogin, useGetContacts, useCrud, useUpload
│   │
│   ├── lib/                  [INFRASTRUCTURE]
│   │   ├── supabase.ts       - Supabase client (browser + server)
│   │   ├── r2.ts             - Cloudflare R2 helpers
│   │   ├── AOSInit.tsx       - AOS scroll animation
│   │   ├── SmoothScroll.tsx  - Lenis smooth scroll
│   │   ├── ScrollProgressBar.tsx
│   │   ├── CursorFollower.tsx
│   │   └── shadcn/           - shadcn/ui components
│   │
│   └── components/           - Komponen standalone (ThemeProvider)
│
└── supabase/
    └── migrations/
        └── 001_init.sql      - Schema database + RLS + seed
```

## Backend Integration & Database

Aplikasi ini menggunakan perpaduan **Supabase (PostgreSQL)** untuk penyimpanan data terstruktur dan **Cloudflare R2** untuk penyimpanan berkas biner (gambar, audio, dan dokumen).

### 1. Database: Supabase (PostgreSQL)
Inisialisasi klien Supabase dipisahkan menjadi dua mode pada `frontend/lib/supabase.ts`:
- **Client/Browser Client (`getSupabaseBrowser`)**: Digunakan langsung di komponen klien React. Menerapkan pola *singleton* untuk mencegah inisialisasi berulang dan menggunakan `anon_key` publik dengan fitur autentikasi bawaan.
- **Server Client (`getSupabaseServer`)**: Digunakan pada Next.js API Routes / Server Components. Klien ini dibuat baru setiap kali request masuk dan menggunakan `SUPABASE_SERVICE_ROLE_KEY` (jika tersedia) untuk melakukan operasi bypass atau admin secara aman di sisi server.

### 2. File Storage: Cloudflare R2 (S3-Compatible)
Penyimpanan berkas dikelola secara terpusat di `frontend/lib/r2.ts` dengan menggunakan AWS SDK S3:
- **`uploadToR2(file: Buffer, key: string, contentType: string)`**: Menerima buffer berkas dan mengunggahnya ke bucket Cloudflare R2, mengembalikan URL publik berkas.
- **`deleteFromR2(key: string)`**: Menghapus berkas dari R2 berdasarkan key uniknya.
- **`generateR2Key(folder: string, filename: string)`**: Generator key unik berbasis timestamp untuk menghindari tabrakan nama berkas di storage.

### 3. API Routes (Backend Server-side)
API Router bertindak sebagai kontroler backend di sisi server Next.js:
- **`POST /api/auth/login`**: Memeriksa kecocokan kredensial yang dikirimkan user dengan `ADMIN_USERNAME` dan `ADMIN_PASSWORD` di `.env.local`, kemudian mengeluarkan token akses berbasis base64.
- **`POST /api/upload`**: Endpoint khusus admin yang memvalidasi otorisasi header `Authorization: Bearer <token>`, melakukan pengecekan tipe berkas (MIME types) dan ukuran maksimal (10MB), serta melakukan stream berkas ke Cloudflare R2.
- **`POST /api/contact`**: Menerima input dari formulir kontak publik, memvalidasi isian, dan memasukkannya ke tabel `contact_messages` Supabase.

### 4. Data Fetching & Hooks Orchestration
Komunikasi data terstruktur dengan Supabase dijembatani menggunakan custom React hooks:
- **Public Fetching (`frontend/hooks/backend/portfolio.ts`)**:
  - `useGetData()`: Mengambil seluruh konfigurasi profil, keahlian, pengalaman, prestasi, sertifikat, dan voice over.
  - `useSendContact()`: Mengirim pesan kontak ke database Supabase.
- **Admin Orchestration (`frontend/hooks/backend/admin.ts`)**:
  - `useLogin()`: Menghubungi `/api/auth/login` untuk autentikasi admin.
  - `useCrud()`: Modul CRUD generik (`getAll`, `create`, `update`, `remove`) yang terintegrasi langsung dengan Supabase SDK.
  - `useUpload()`: Menghubungi `/api/upload` untuk mengunggah berkas multimedia (foto profil, contoh suara VO, sertifikat, dll).

## Environment Variables

Salin `.env.local.example` → `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
R2_ENDPOINT
R2_ACCESS_KEY_ID
R2_SECRET_ACCESS_KEY
R2_BUCKET_NAME
NEXT_PUBLIC_R2_PUBLIC_URL
ADMIN_USERNAME
ADMIN_PASSWORD
ADMIN_JWT_SECRET
```

## Routing

| Path              | Halaman            | Akses  |
|-------------------|--------------------|--------|
| `/`               | Portfolio publik   | Public |
| `/kelola`         | Login admin        | Public |
| `/kelola/panel`   | Dashboard admin    | Auth   |
| `/api/auth/login` | API login          | Server |
| `/api/upload`     | API upload R2      | Server |
| `/api/contact`    | API kirim pesan    | Server |

## Menjalankan

```bash
cd frontend
npm install
npm run dev      # http://localhost:3000
npm run build    # Production build
npm start        # Start production