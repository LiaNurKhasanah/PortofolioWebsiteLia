'use client'

import { Skeleton } from '../../lib/shadcn/skeleton'

/* ── Hero Skeleton ── */
export function HeroSkeleton() {
  return (
    <section className="min-h-screen flex items-center pt-16 px-6" style={{ background: '#FDF8FA' }}>
      <div className="max-w-6xl mx-auto w-full">
        <div className="flex flex-col-reverse md:flex-row items-center gap-12">
          <div className="flex-1 space-y-4 w-full">
            <Skeleton className="h-8 w-48 rounded-full bg-pink-100/50" />
            <Skeleton className="h-14 w-80 rounded-2xl bg-pink-100/40" />
            <Skeleton className="h-5 w-64 rounded-lg bg-pink-100/30" />
            <Skeleton className="h-4 w-72 rounded-lg bg-pink-100/20" />
            <div className="flex gap-3 pt-4">
              <Skeleton className="h-11 w-32 rounded-full bg-pink-100/50" />
              <Skeleton className="h-11 w-28 rounded-full bg-pink-100/40" />
              <Skeleton className="h-11 w-28 rounded-full bg-green-100/40" />
            </div>
          </div>
          <Skeleton className="w-56 h-56 md:w-72 md:h-72 rounded-full bg-pink-100/40 flex-shrink-0" />
        </div>
      </div>
    </section>
  )
}

/* ── About Skeleton ── */
export function AboutSkeleton() {
  return (
    <section className="py-24 px-6" style={{ background: '#FFFFFF' }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 space-y-3">
          <Skeleton className="h-6 w-32 mx-auto rounded-full bg-pink-100/40" />
          <Skeleton className="h-10 w-64 mx-auto rounded-2xl bg-pink-100/30" />
        </div>
        <div className="grid md:grid-cols-2 gap-12">
          <Skeleton className="w-72 h-80 rounded-[2.5rem] bg-pink-100/30 mx-auto" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full rounded bg-pink-100/20" />
            <Skeleton className="h-4 w-5/6 rounded bg-pink-100/20" />
            <Skeleton className="h-4 w-4/6 rounded bg-pink-100/20" />
            <div className="grid grid-cols-2 gap-4 pt-6">
              {[1,2,3,4].map(i => (
                <Skeleton key={i} className="h-28 rounded-[1.5rem] bg-pink-100/20" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Skills Skeleton ── */
export function SkillsSkeleton() {
  return (
    <section className="py-24 px-6" style={{ background: '#F3EEF1' }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 space-y-3">
          <Skeleton className="h-6 w-28 mx-auto rounded-full bg-pink-100/40" />
          <Skeleton className="h-10 w-48 mx-auto rounded-2xl bg-pink-100/30" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1,2,3,4,5,6,7,8].map(i => (
            <Skeleton key={i} className="h-24 rounded-2xl bg-white/60" />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Portfolio Skeleton ── */
export function PortfolioSkeleton() {
  return (
    <section className="py-24 px-6" style={{ background: '#F3EEF1' }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 space-y-3">
          <Skeleton className="h-6 w-28 mx-auto rounded-full bg-pink-100/40" />
          <Skeleton className="h-10 w-52 mx-auto rounded-2xl bg-pink-100/30" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => (
            <div key={i} className="rounded-3xl overflow-hidden bg-white">
              <Skeleton className="h-44 w-full bg-pink-100/20" />
              <div className="p-5 space-y-3">
                <Skeleton className="h-5 w-3/4 rounded bg-pink-100/20" />
                <Skeleton className="h-3 w-1/2 rounded bg-pink-100/15" />
                <Skeleton className="h-4 w-full rounded bg-pink-100/10" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Full page skeleton ── */
export default function PortfolioPageSkeleton() {
  return (
    <div className="animate-in fade-in duration-300">
      <HeroSkeleton />
      <AboutSkeleton />
      <SkillsSkeleton />
      <PortfolioSkeleton />
    </div>
  )
}