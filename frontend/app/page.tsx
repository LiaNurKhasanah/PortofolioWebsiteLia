import { getSupabaseServer } from '../lib/supabase'
import PortfolioPage from '../controllers/PortfolioPage'
import { CharacterValue, PortfolioData } from '../models/types'

export const revalidate = 60 // ISR: regenerate page every 60 seconds for max performance

async function getPortfolioData(): Promise<PortfolioData> {
  const sb = getSupabaseServer()

  try {
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

    return {
      profile: profileRes.data ?? null,
      skills: skillsRes.data ?? [],
      experiences: experiencesRes.data ?? [],
      projects: projectsRes.data ?? [],
      voiceOvers: voiceOversRes.data ?? [],
      achievements: achievementsRes.data ?? [],
      certificates: certificatesRes.data ?? [],
      characterValues: cvRes?.data ?? [],
    }
  } catch (error) {
    console.error('Failed to fetch portfolio data server-side:', error)
    return {
      profile: null, skills: [], experiences: [], projects: [], voiceOvers: [], achievements: [], certificates: [], characterValues: []
    }
  }
}

export default async function HomePage() {
  const data = await getPortfolioData()
  return <PortfolioPage initialData={data} />
}
