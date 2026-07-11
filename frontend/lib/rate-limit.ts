// A simple in-memory rate limiter for serverless environments (best-effort)
// In production Vercel edge/lambda, this will reset on cold starts, but provides 
// a basic first layer of defense. For robust production, redis/upstash is recommended.

interface RateLimitRecord {
  count: number
  resetTime: number
}

const cache = new Map<string, RateLimitRecord>()

interface RateLimiterOptions {
  windowMs: number
  max: number
}

export function rateLimit(ip: string, options: RateLimiterOptions): { success: boolean; limit: number; remaining: number; reset: number } {
  const now = Date.now()
  const record = cache.get(ip)

  if (!record) {
    const newRecord = { count: 1, resetTime: now + options.windowMs }
    cache.set(ip, newRecord)
    return {
      success: true,
      limit: options.max,
      remaining: options.max - 1,
      reset: newRecord.resetTime,
    }
  }

  if (now > record.resetTime) {
    record.count = 1
    record.resetTime = now + options.windowMs
    return {
      success: true,
      limit: options.max,
      remaining: options.max - 1,
      reset: record.resetTime,
    }
  }

  record.count += 1

  if (record.count > options.max) {
    return {
      success: false,
      limit: options.max,
      remaining: 0,
      reset: record.resetTime,
    }
  }

  return {
    success: true,
    limit: options.max,
    remaining: options.max - record.count,
    reset: record.resetTime,
  }
}

// Clean up expired records every 5 minutes to prevent memory leaks
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    cache.forEach((value, key) => {
      if (now > value.resetTime) {
        cache.delete(key)
      }
    })
  }, 1000 * 60 * 5)
}
