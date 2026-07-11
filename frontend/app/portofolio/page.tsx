import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Portofolio Pilihan Lia Nur Khasanah | Hasil Karya Kreatif',
  description: 'Lihat koleksi proyek pilihan Lia Nur Khasanah - Copywriting, Content Writing, dan Social Media Management untuk klien profesional.',
}

export default function PortfolioRedirect() {
  redirect('/#portofolio')
}
