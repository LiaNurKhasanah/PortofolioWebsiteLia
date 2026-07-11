/* ── Site Configuration & Constants ── */

export const SITE = {
  brandName: 'Lia.',
  fullName: 'Lia Nur Khasanah',
  tagline: 'Mahasiswi Ilmu Komunikasi | Content Writer | Voice Over Enthusiast',
  headline:
    'Saya membantu menyampaikan pesan melalui tulisan, konten digital, public speaking, dan suara yang komunikatif, hangat, serta profesional.',
} as const

export const COLORS = {
  green: '#C2DC80',       // Sorbet Stem
  pink: '#EA9CAF',        // Petal Glaze
  orchid: '#D56989',      // Dusty Orchid (primary)
  bgLight: '#F3EEF1',     // Powdered Lilac Grey
  text: '#1A1A1A',
  textMuted: '#6B5B65',
  white: '#FFFFFF',
  cream: '#FDF8FA',
} as const

export const NAV_LINKS = [
  { label: 'Beranda', href: '#home' },
  { label: 'Tentang', href: '#about' },
  { label: 'Portofolio', href: '#portofolio' },
  { label: 'Kontak', href: '#kontak' },
] as const

export const SKILL_CATEGORIES = [
  'Content Writing',
  'Copywriting',
  'Social Media Management',
  'Voice Over',
  'Public Speaking',
  'Content Planning',
  'Leadership',
  'Event Management',
] as const

export const VO_CATEGORIES = [
  'Commercial Voice Over',
  'Company Profile',
  'Event Promotion',
  'Educational Content',
  'Storytelling',
] as const

export const VALUE_CARDS = [
  {
    icon: '💬',
    title: 'Komunikatif',
    desc: 'Menyampaikan pesan dengan jelas dan efektif',
  },
  {
    icon: '🎨',
    title: 'Kreatif',
    desc: 'Menghadirkan ide segar dan inovatif',
  },
  {
    icon: '💼',
    title: 'Profesional',
    desc: 'Berkomitmen pada kualitas dan ketepatan waktu',
  },
  {
    icon: '🤝',
    title: 'Terbuka untuk Proyek',
    desc: 'Siap berkolaborasi dan menerima tantangan baru',
  },
] as const

export const ADMIN_MENU_ITEMS = [
  { key: 'profil', label: 'Profil', icon: 'User' },
  { key: 'keahlian', label: 'Keahlian', icon: 'Sparkles' },
  { key: 'pengalaman', label: 'Pengalaman', icon: 'Briefcase' },
  { key: 'portofolio', label: 'Portofolio', icon: 'FolderOpen' },
  { key: 'voiceover', label: 'Voice Over', icon: 'Mic' },
  { key: 'prestasi', label: 'Prestasi', icon: 'Award' },
  { key: 'sertifikat', label: 'Sertifikat', icon: 'ScrollText' },
  { key: 'pesan', label: 'Pesan', icon: 'MessageSquare' },
] as const