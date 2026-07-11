# Kisah di Balik Layar: Portofolio Digital Lia Nur Khasanah 🌸

Di tengah riuhnya era digital, komunikasi bukan lagi sekadar pertukaran kata. Bagi **Lia Nur Khasanah**, seorang mahasiswi semester akhir Ilmu Komunikasi di Yogyakarta, komunikasi adalah seni membangun jembatan emosi. Lewat tulisan (*Content Writing*), suara (*Voice Over*), dan interaksi publik (*Public Speaking*), Lia berdedikasi untuk melahirkan karya-karya yang hangat, ramah, sekaligus profesional.

Website portofolio ini adalah rumah digital tempat Lia menyimpan setiap jejak perjalanannya.

---

## 🌺 Filosofi Desain: Keindahan Bunga Lily
Website ini dirancang secara khusus untuk merefleksikan karakter Lia. Melalui kolaborasi kreatif, lahirlah sebuah karya visual yang teduh dan organik:
- **Swaying Lilies**: Hiasan bunga Lily yang berayun lembut di bagian atas menyambut setiap pengunjung dengan kehangatan alam.
- **Palet Warna Pastel**: Perpaduan warna merah muda lembut (*Lia Pink*) yang melambangkan empati, serta hijau pastel (*Lia Green*) yang menyegarkan, memberikan kenyamanan visual bagi siapa saja yang singgah.
- **Sentuhan Bunga pada Tombol**: Tombol-tombol berhiaskan ornamen bunga floral dirancang untuk memberikan interaksi yang menyenangkan dan tak terlupakan.

Setiap elemen visual diatur secara dinamis dengan transisi yang sangat halus menggunakan efek animasi **AOS** dan **Lenis (Smooth Scroll)**, memastikan perjalanan menjelajahi karya Lia terasa begitu mengalir.

---

## ⚙️ Jiwa Teknologi yang Kokoh
Di balik tampilan visualnya yang lembut, website ini ditopang oleh arsitektur teknologi yang kokoh dan aman (arsitektur MVC Next.js 15):

- **Optimasi SEO Global**: Supaya karya Lia dapat ditemukan dengan mudah di mesin pencari global (Google, Yandex, Bing, DuckDuckGo), kami membangun **Sitemap Index** dinamis berprioritas tinggi (`1.0` & `0.9`) beserta rute virtual redirect yang ramah crawler.
- **Google Analytics**: Integrasi GA4 memastikan setiap interaksi dan lalu lintas pengunjung dapat dipantau secara langsung untuk pengembangan personal branding Lia ke depan.
- **Panel Manajemen Konten Mandiri**: Lia dapat memperbarui profilnya secara langsung melalui panel admin yang aman (terautentikasi HTTP-only Signed Cookie). Bahkan, ia dapat membedakan foto utama di beranda dengan foto di lembar profil "Kenali Aku Lebih Dekat" sesuai suasana hatinya.
- **Pencatatan Audit**: Setiap perubahan data penting dicatat dengan aman untuk menjaga integritas data portofolio.

---

## 🚀 Memulai Perjalanan di Lokal

Bagi Anda yang ingin menjalankan proyek portofolio ini di komputer lokal Anda:

### 1. Persiapkan Berkas Lingkungan
Salin `.env.local.example` menjadi `.env.local` pada folder `/frontend`:
```bash
cp frontend/.env.local.example frontend/.env.local
```
Lalu konfigurasikan variabel environment Supabase, Cloudflare R2, dan Kunci Otorisasi Admin Anda di dalamnya.

### 2. Skema & Inisialisasi Database
Jalankan berkas migrasi database pada folder `supabase/migrations/` (dari tabel `001_init.sql` sampai `005_about_photo.sql`) di dashboard Supabase Anda, kemudian jalankan seed:
```bash
node supabase/seed_cv.js
```

### 3. Nyalakan Mesin Pengembangan
Masuk ke direktori frontend, instal dependensi, lalu jalankan aplikasinya:
```bash
cd frontend
npm install
npm run dev
```
Buka browser Anda di [http://localhost:3000](http://localhost:3000).

---

*Setiap kata yang tertulis, setiap nada suara yang terekam, adalah dedikasi Lia untuk terus bertumbuh dan memberi dampak bagi sekitarnya.* ✨
