import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Tentang Lia Nur Khasanah | Mahasiswi Ilmu Komunikasi',
  description: 'Kenali Lia Nur Khasanah lebih dekat. Mahasiswi Ilmu Komunikasi UIN Sunan Kalijaga Yogyakarta dengan minat besar pada Voice Over, Content Writing, dan Public Speaking.',
}

export default function AboutRedirect() {
  redirect('/#about')
}
