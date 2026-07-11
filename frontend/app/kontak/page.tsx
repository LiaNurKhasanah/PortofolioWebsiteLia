import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Kontak Lia Nur Khasanah | Mulai Kolaborasi Project',
  description: 'Hubungi Lia Nur Khasanah untuk kolaborasi, penawaran project content writing, copywriting, public speaking, dan kerja sama voice over.',
}

export default function ContactRedirect() {
  redirect('/#kontak')
}
