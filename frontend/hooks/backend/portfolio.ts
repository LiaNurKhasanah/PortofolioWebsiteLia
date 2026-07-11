'use client'

import { useState, useCallback } from 'react'
import { getSupabaseBrowser } from '../../lib/supabase'
import type {
  Profile,
  Skill,
  Experience,
  Project,
  VoiceOver,
  Achievement,
  Certificate,
  CharacterValue,
} from '../../models/types'

/* ── Public Portfolio Data ── */
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

/**
 * Hook: useGetData
 * Fetches all portfolio data from Supabase for the public site.
 * Replaces the old Retool-hosted useGetData hook.
 */
export function useGetData() {
  const [data, setData] = useState<PortfolioData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const trigger = useCallback(async (_params?: Record<string, unknown>) => {
    setLoading(true)
    setError(null)
    try {
      const sb = getSupabaseBrowser()

      const [
        profileRes,
        skillsRes,
        experiencesRes,
        projectsRes,
        voiceOversRes,
        achievementsRes,
        certificatesRes,
        cvRes,
      ] = await Promise.all([
        sb.from('profile').select('*').order('id', { ascending: true }).limit(1).single(),
        sb.from('skills').select('*').eq('is_active', true).order('sort_order'),
        sb.from('experiences').select('*').order('sort_order'),
        sb.from('projects').select('*').order('sort_order'),
        sb.from('voice_overs').select('*').order('sort_order'),
        sb.from('achievements').select('*').order('year', { ascending: false }),
        sb.from('certificates').select('*').order('sort_order'),
        (async () => {
          try {
            const res = await sb.from('character_values').select('*').order('order_index')
            return res.error ? { data: [] as CharacterValue[] } : res
          } catch { return { data: [] as CharacterValue[] } }
        })()
      ])

      const result: PortfolioData = {
        profile: profileRes.data ?? null,
        skills: skillsRes.data ?? [],
        experiences: experiencesRes.data ?? [],
        projects: projectsRes.data ?? [],
        voiceOvers: voiceOversRes.data ?? [],
        achievements: achievementsRes.data ?? [],
        certificates: certificatesRes.data ?? [],
        characterValues: cvRes?.data ?? [],
      }

      setData(result)
      return result
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Gagal memuat data'
      setError(msg)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return { data, loading, error, trigger }
}

/**
 * Hook: useSendContact
 * Sends a contact message through the server API so validation stays centralized.
 */
export function useSendContact() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const trigger = useCallback(
    async (payload: { name: string; email: string; subject: string; message: string; service_type?: string }) => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        if (!res.ok) {
          const body = await res.json().catch(() => ({}))
          throw new Error(body.message ?? 'Gagal mengirim pesan')
        }

        return { success: true }
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Gagal mengirim pesan'
        setError(msg)
        throw err
      } finally {
        setLoading(false)
      }
    },
    []
  )

  return { loading, error, trigger }
}

// Alias for backward compatibility
export const useSubmitContact = useSendContact
