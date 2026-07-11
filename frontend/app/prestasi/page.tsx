import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Prestasi & Penghargaan Lia Nur Khasanah | Achievements',
  description: 'Daftar kompetensi dan penghargaan yang diraih Lia Nur Khasanah di tingkat nasional dan universitas dalam bidang kepenulisan, orasi, dan seni.',
}

export default function AchievementsRedirect() {
  redirect('/#prestasi')
}
