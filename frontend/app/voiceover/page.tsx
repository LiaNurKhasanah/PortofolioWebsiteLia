import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Demo Voice Over Lia Nur Khasanah | Suara Hangat & Profesional',
  description: 'Dengarkan contoh suara & demo voice over (VO) Lia Nur Khasanah untuk iklan komersial, video profil perusahaan, narasi, dan materi edukasi.',
}

export default function VoiceOverRedirect() {
  redirect('/#voiceover')
}
