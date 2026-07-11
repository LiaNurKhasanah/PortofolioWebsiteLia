import { User, Wrench, Briefcase, FolderOpen, Mic, Trophy, Award, MessageSquare, LogOut, LayoutDashboard, Heart } from 'lucide-react'
import { Button } from '../../lib/shadcn/button'
import { Badge } from '../../lib/shadcn/badge'
import { AdminMenu } from '../../models/types'

interface Props {
  active: AdminMenu
  onChange: (m: AdminMenu) => void
  onLogout: () => void
  unreadCount?: number
}

const menus: { key: AdminMenu; label: string; icon: React.ReactNode }[] = [
  { key: 'profil',      label: 'Profil',      icon: <User className="w-4 h-4" />         },
  { key: 'karakter',    label: 'Nilai Karakter', icon: <Heart className="w-4 h-4" />     },
  { key: 'keahlian',   label: 'Keahlian',    icon: <Wrench className="w-4 h-4" />       },
  { key: 'pengalaman', label: 'Pengalaman',  icon: <Briefcase className="w-4 h-4" />    },
  { key: 'portofolio', label: 'Portofolio',  icon: <FolderOpen className="w-4 h-4" />   },
  { key: 'voiceover',  label: 'Voice Over',  icon: <Mic className="w-4 h-4" />          },
  { key: 'prestasi',   label: 'Prestasi',    icon: <Trophy className="w-4 h-4" />       },
  { key: 'sertifikat', label: 'Sertifikat',  icon: <Award className="w-4 h-4" />        },
  { key: 'pesan',      label: 'Pesan Masuk', icon: <MessageSquare className="w-4 h-4" /> },
]

export default function AdminSidebar({ active, onChange, onLogout, unreadCount = 0 }: Props) {
  return (
    <aside className="w-60 min-h-screen flex flex-col border-r"
      style={{ background: '#FFFFFF', borderColor: 'rgba(213,105,137,0.12)' }}>

      {/* Logo */}
      <div className="px-6 py-5 border-b" style={{ borderColor: 'rgba(213,105,137,0.12)' }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#D56989,#EA9CAF)' }}>
            <LayoutDashboard className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-bold text-sm" style={{ color: '#1A1A1A' }}>Panel Admin</p>
            <p className="text-xs" style={{ color: '#8A7080' }}>Lia Nur Khasanah</p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {menus.map(({ key, label, icon }) => {
          const isActive = active === key
          return (
            <button key={key} onClick={() => onChange(key)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{
                background: isActive ? 'rgba(213,105,137,0.1)' : 'transparent',
                color: isActive ? '#D56989' : '#6B5B65',
              }}>
              <span className="flex items-center gap-2.5">
                {icon} {label}
              </span>
              {key === 'pesan' && unreadCount > 0 && (
                <Badge className="text-xs px-1.5 py-0 h-4 min-w-4"
                  style={{ background: '#D56989', color: '#fff', border: 'none' }}>
                  {unreadCount}
                </Badge>
              )}
            </button>
          )
        })}
      </nav>

      {/* Keluar */}
      <div className="px-3 py-4 border-t" style={{ borderColor: 'rgba(213,105,137,0.12)' }}>
        <Button variant="ghost" onClick={onLogout}
          className="w-full justify-start gap-2.5 text-sm rounded-xl"
          style={{ color: '#8A7080' }}>
          <LogOut className="w-4 h-4" /> Keluar
        </Button>
      </div>
    </aside>
  )
}
