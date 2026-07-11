/* ── Data Model Interfaces ── */

export interface Profile {
  id: number
  name: string
  tagline: string
  headline: string
  bio: string
  photo_url: string
  about_photo_url?: string
  cv_url: string
  email: string
  whatsapp: string
  instagram: string
  linkedin: string
  youtube: string
  tiktok: string
  location: string
}

export interface Skill {
  id: number
  name: string
  category: string
  icon: string
  sort_order: number
  is_active: boolean
}

export interface Experience {
  id: number
  title: string
  organization: string
  role_type: string
  period_start: string
  period_end: string
  description: string
  logo_url: string
  is_current: boolean
  sort_order: number
}

export interface Project {
  id: number
  title: string
  slug: string
  category: string
  role: string
  period: string
  description: string
  responsibilities: string
  tools: string
  results: string
  thumbnail_url: string
  project_url: string
  images: string
  is_featured: boolean
  sort_order: number
}

export interface VoiceOver {
  id: number
  title: string
  category: string
  description: string
  voice_style: string
  use_case: string
  audio_url: string
  duration_seconds: number
  is_featured: boolean
  sort_order: number
}

export interface Achievement {
  id: number
  title: string
  type: string
  year: number
  level: string
  organizer: string
  description: string
  is_featured: boolean
  sort_order: number
}

export interface Certificate {
  id: number
  title: string
  issuer: string
  issued_date: string
  credential_url: string
  image_url: string
  category: string
  is_featured: boolean
  sort_order: number
}

export interface ContactMessage {
  id: number
  name: string
  email: string
  subject: string
  message: string
  service_type: string
  status: string
  created_at: string
}

export interface PortfolioData {
  profile: Profile | null
  skills: Skill[]
  experiences: Experience[]
  projects: Project[]
  voiceOvers: VoiceOver[]
  achievements: Achievement[]
  certificates: Certificate[]
  characterValues: CharacterValue[]
}

export interface CharacterValue {
  id: string
  title: string
  description: string
  icon_name: string
  order_index: number
}

export interface AdminAuditLog {
  id: number
  admin_user: string
  action: 'create' | 'update' | 'delete' | 'upload' | 'login'
  table_name: string | null
  record_id: string | null
  metadata: Record<string, unknown> | null
  created_at: string
}

/* ── Admin Menu Type ── */
export type AdminMenu =
  | 'profil'
  | 'karakter'
  | 'keahlian'
  | 'pengalaman'
  | 'portofolio'
  | 'voiceover'
  | 'prestasi'
  | 'sertifikat'
  | 'pesan'