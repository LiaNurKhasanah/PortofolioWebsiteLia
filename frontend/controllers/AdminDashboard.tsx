'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ExternalLink, Loader2, Menu } from 'lucide-react'
import { Button } from '../lib/shadcn/button'
import AdminSidebar from '../views/admin/AdminSidebar'
import { AdminMenu } from '../models/types'
import ProfileEditor from '../views/admin/ProfileEditor'
import SkillsManager from '../views/admin/SkillsManager'
import ExperienceManager from '../views/admin/ExperienceManager'
import ProjectsManager from '../views/admin/ProjectsManager'
import VoiceOverManager from '../views/admin/VoiceOverManager'
import AchievementsManager from '../views/admin/AchievementsManager'
import CertificatesManager from '../views/admin/CertificatesManager'
import ContactsManager from '../views/admin/ContactsManager'
import CharacterValuesManager from '../views/admin/CharacterValuesManager'
import { useAdminSession, useGetContacts, useLogout } from '../hooks/backend/admin'

export default function AdminDashboard() {
  const router = useRouter()
  const [activeMenu, setActiveMenu] = useState<AdminMenu>('profil')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)
  const { data: contacts, trigger: loadContacts } = useGetContacts()
  const { trigger: checkSession } = useAdminSession()
  const { trigger: logoutSession } = useLogout()

  useEffect(() => {
    let active = true
    checkSession().then(session => {
      if (!active) return
      if (!session.authenticated) router.push('/kelola')
      else setCheckingSession(false)
    })
    return () => { active = false }
  }, [checkSession, router])

  useEffect(() => {
    if (!checkingSession) loadContacts({})
  }, [checkingSession, loadContacts])

  const unread = Array.isArray(contacts) ? contacts.filter((m: { status: string }) => m.status === 'unread').length : 0

  const logout = async () => {
    await logoutSession()
    router.push('/kelola')
  }

  const handleMenuChange = (m: AdminMenu) => {
    setActiveMenu(m)
    setSidebarOpen(false)
  }

  const content: Record<AdminMenu, React.ReactNode> = {
    profil:      <ProfileEditor />,
    karakter:    <CharacterValuesManager />,
    keahlian:    <SkillsManager />,
    pengalaman:  <ExperienceManager />,
    portofolio:  <ProjectsManager />,
    voiceover:   <VoiceOverManager />,
    prestasi:    <AchievementsManager />,
    sertifikat:  <CertificatesManager />,
    pesan:       <ContactsManager />,
  }

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F3EEF1', color: '#D56989' }}>
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen" style={{ background: '#F3EEF1' }}>
      {/* Sidebar desktop */}
      <div className="hidden md:block flex-shrink-0">
        <div className="sticky top-0 h-screen overflow-y-auto">
          <AdminSidebar active={activeMenu} onChange={handleMenuChange} onLogout={logout} unreadCount={unread} />
        </div>
      </div>

      {/* Sidebar mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <div className="relative z-10 flex-shrink-0">
            <AdminSidebar active={activeMenu} onChange={handleMenuChange} onLogout={logout} unreadCount={unread} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-10 flex items-center justify-between px-5 md:px-8 py-4 border-b"
          style={{ background: '#FFFFFF', borderColor: 'rgba(213,105,137,0.12)' }}>
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden p-1.5 rounded-lg"
              style={{ color: '#D56989', background: 'rgba(213,105,137,0.08)' }}
              aria-label="Buka menu">
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-bold text-sm md:text-base capitalize" style={{ color: '#1A1A1A' }}>
                {activeMenu === 'voiceover' ? 'Voice Over' : activeMenu.charAt(0).toUpperCase() + activeMenu.slice(1)}
              </h1>
              <p className="text-xs hidden sm:block" style={{ color: '#8A7080' }}>
                Panel Admin · Lia Nur Khasanah
              </p>
            </div>
          </div>
          <Button asChild variant="outline" size="sm" className="gap-1.5 rounded-xl text-xs"
            style={{ borderColor: 'rgba(213,105,137,0.3)', color: '#D56989' }}>
            <a href="/" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-3.5 h-3.5" /> Lihat Website
            </a>
          </Button>
        </header>

        {/* Page content */}
        <main className="flex-1 p-5 md:p-8 overflow-y-auto">
          {content[activeMenu]}
        </main>
      </div>
    </div>
  )
}