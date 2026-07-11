import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Pengalaman & Riwayat Kerja Lia Nur Khasanah | Track Record',
  description: 'Eksplorasi riwayat organisasi, magang, dan freelance yang pernah diikuti oleh Lia Nur Khasanah sebagai bekal profesional di bidang komunikasi.',
}

export default function ExperienceRedirect() {
  redirect('/#pengalaman')
}
