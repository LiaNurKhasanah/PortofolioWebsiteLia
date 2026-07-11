import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Keahlian & Layanan Lia Nur Khasanah | Digital Communication',
  description: 'Daftar kemampuan dan keahlian Lia Nur Khasanah: Copywriting, Social Media Specialist, MC/Public Speaking, dan Voice Over talent.',
}

export default function SkillsRedirect() {
  redirect('/#keahlian')
}
