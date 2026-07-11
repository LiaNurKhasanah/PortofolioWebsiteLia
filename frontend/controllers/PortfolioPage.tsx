'use client'

import { MessageCircle } from 'lucide-react'
import { PortfolioData } from '../models/types'
import { COLORS } from '../models/constants'
import Navbar from '../views/public/Navbar'
import HeroSection from '../views/public/HeroSection'
import AboutSection from '../views/public/AboutSection'
import SkillsSection from '../views/public/SkillsSection'
import ExperienceSection from '../views/public/ExperienceSection'
import PortfolioSection from '../views/public/PortfolioSection'
import VoiceOverSection from '../views/public/VoiceOverSection'
import AchievementsSection from '../views/public/AchievementsSection'
import ContactSection from '../views/public/ContactSection'
import Footer from '../views/public/Footer'

interface Props {
  initialData: PortfolioData
}

export default function PortfolioPage({ initialData }: Props) {
  const data = initialData
  const whatsapp = data.profile?.whatsapp?.trim()
  const waUrl = whatsapp ? `https://wa.me/62${whatsapp.replace(/^0/, '')}` : null

  return (
    <div>
      <Navbar profile={data.profile} />
      <HeroSection 
        profile={data.profile} 
        projectsCount={data.projects.length}
        experiencesCount={data.experiences.filter(e => e.role_type === 'organization').length}
        voiceOversCount={data.voiceOvers.length}
      />
      <AboutSection profile={data.profile} characterValues={data.characterValues} />
      <SkillsSection skills={data.skills} />
      <ExperienceSection experiences={data.experiences} />
      <PortfolioSection projects={data.projects} />
      <VoiceOverSection voiceOvers={data.voiceOvers} whatsapp={data.profile?.whatsapp} />
      <AchievementsSection achievements={data.achievements} certificates={data.certificates} />
      <ContactSection profile={data.profile} />
      <Footer profile={data.profile} />

      {waUrl && (
        <a href={waUrl} target="_blank" rel="noopener noreferrer"
          className="fixed bottom-7 right-7 z-50 w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-110"
          style={{ background: 'linear-gradient(135deg,#25D366,#128C7E)', boxShadow: '0 4px 20px rgba(37,211,102,0.5)' }}
          aria-label="WhatsApp">
          <MessageCircle className="w-6 h-6 text-white" />
        </a>
      )}
    </div>
  )
}