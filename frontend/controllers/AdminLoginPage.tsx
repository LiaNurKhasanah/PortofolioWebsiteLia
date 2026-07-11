'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, User, Eye, EyeOff, Loader2, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader } from '../lib/shadcn/card'
import { Input } from '../lib/shadcn/input'
import { Button } from '../lib/shadcn/button'
import { Label } from '../lib/shadcn/label'
import { useLogin } from '../hooks/backend/admin'

export default function AdminLoginPage() {
  const router = useRouter()
  const { trigger, loading } = useLogin()
  const [form, setForm] = useState({ username: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [err, setErr] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErr('')
    try {
      const res = await trigger(form)
      if (res?.success) {
        router.push('/kelola/panel')
      }
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : 'Login gagal. Coba lagi.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(135deg,#F3EEF1 0%,#FAE8EE 50%,#FDF8FA 100%)' }}>
      <Card className="w-full max-w-md shadow-xl border-0 rounded-2xl overflow-hidden">
        <CardHeader className="text-center py-8"
          style={{ background: 'linear-gradient(135deg,#D56989,#C45578)' }}>
          <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-3"
            style={{ background: 'rgba(255,255,255,0.2)' }}>
            <Lock className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">Admin Panel</h1>
          <p className="text-sm text-white/70">Lia Nur Khasanah · Portfolio</p>
        </CardHeader>

        <CardContent className="p-6">
          {err && (
            <div className="flex items-center gap-2 p-3 mb-4 rounded-xl text-sm"
              style={{ background: 'rgba(239,68,68,0.08)', color: '#DC2626' }}>
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{err}</span>
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <div>
              <Label htmlFor="username" className="text-sm font-medium" style={{ color: '#1A1A1A' }}>
                Username
              </Label>
              <div className="relative mt-1.5">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#8A7080' }} />
                <Input id="username" placeholder="Masukkan username"
                  className="pl-10 rounded-xl" style={{ borderColor: 'rgba(213,105,137,0.3)' }}
                  value={form.username}
                  onChange={e => setForm(p => ({ ...p, username: e.target.value }))} />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="text-sm font-medium" style={{ color: '#1A1A1A' }}>
                Password
              </Label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#8A7080' }} />
                <Input id="password" type={showPass ? 'text' : 'password'}
                  placeholder="Masukkan password"
                  className="pl-10 pr-10 rounded-xl" style={{ borderColor: 'rgba(213,105,137,0.3)' }}
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPass(v => !v)} tabIndex={-1}>
                  {showPass
                    ? <EyeOff className="w-4 h-4" style={{ color: '#8A7080' }} />
                    : <Eye className="w-4 h-4" style={{ color: '#8A7080' }} />}
                </button>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full rounded-xl h-11 font-semibold text-white"
              style={{ background: 'linear-gradient(135deg,#D56989,#C45578)' }}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {loading ? 'Memproses...' : 'Masuk'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}