import { GmailIcon, InstagramIcon, TikTokIcon, YoutubeIcon } from '../shared/BrandIcons'
import SocialButton from '../shared/SocialButton'
import { Profile } from '../../models/types'
import { SITE, COLORS } from '../../models/constants'

interface Props { profile: Profile | null }

function splitName(name: string) {
  const parts = name.trim().split(/\s+/)
  return {
    first: parts.slice(0, 2).join(' '),
    rest: parts.slice(2).join(' '),
  }
}

function instagramUrl(value: string) {
  return value.startsWith('http') ? value : `https://instagram.com/${value.replace('@','')}`
}

function youtubeUrl(value: string) {
  return value.startsWith('http') ? value : `https://www.youtube.com/${value.startsWith('@') ? value : `@${value}`}`
}

function tiktokUrl(value: string) {
  return value.startsWith('http') ? value : `https://www.tiktok.com/@${value.replace('@','')}`
}

export default function Footer({ profile }: Props) {
  const displayName = splitName(profile?.name ?? SITE.fullName)
  const instagram = profile?.instagram?.trim()
  const youtube = profile?.youtube?.trim()
  const tiktok = profile?.tiktok?.trim()
  const email = profile?.email?.trim()

  return (
    <footer className="py-8" style={{ background: COLORS.orchid }}>
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-baseline">
          <span className="text-2xl font-bold tracking-tight" style={{ color: '#F3EEF1' }}>
            {displayName.first}
          </span>
          {displayName.rest && (
            <span className="text-2xl font-medium tracking-tight ml-1.5" style={{ color: COLORS.green }}>
              {displayName.rest}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          {instagram ? (
            <SocialButton
              href={instagramUrl(instagram)}
              icon={<InstagramIcon className="w-5 h-5" />}
              color={COLORS.orchid}
              hoverBg={COLORS.pink}
              ariaLabel="Instagram"
            />
          ) : null}
          {youtube ? (
            <SocialButton
              href={youtubeUrl(youtube)}
              icon={<YoutubeIcon className="w-5 h-5" />}
              color={COLORS.orchid}
              hoverBg={COLORS.pink}
              ariaLabel="YouTube"
            />
          ) : null}
          {tiktok ? (
            <SocialButton
              href={tiktokUrl(tiktok)}
              icon={<TikTokIcon className="w-5 h-5" />}
              color={COLORS.orchid}
              hoverBg={COLORS.pink}
              ariaLabel="TikTok"
            />
          ) : null}
          {email ? (
            <SocialButton
              href={`mailto:${email}`}
              icon={<GmailIcon className="w-5 h-5" />}
              color={COLORS.orchid}
              hoverBg={COLORS.pink}
              ariaLabel="Email"
            />
          ) : null}
        </div>

        <p className="text-xs text-center" style={{ color: 'rgba(255,255,255,0.45)' }}>
          © {new Date().getFullYear()} {profile?.name ?? SITE.fullName}. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
