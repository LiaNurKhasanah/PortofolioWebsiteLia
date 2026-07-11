'use client'

import { useState, useCallback } from 'react'
import { getSupabaseBrowser } from '../../lib/supabase'
import type { ContactMessage } from '../../models/types'

async function adminCrudRequest<T>(
  method: 'POST' | 'PATCH' | 'DELETE',
  table: string,
  body: { id?: number | string; payload?: Record<string, unknown> }
) {
  const res = await fetch('/api/admin/crud', {
    method,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ table, ...body }),
  })

  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(json.message ?? 'Operasi admin gagal')
  return json.data as T
}

/* ── Login Hook ── */
export function useLogin() {
  const [loading, setLoading] = useState(false)

  const trigger = useCallback(
    async (payload: { username: string; password: string }) => {
      setLoading(true)
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        if (!res.ok) {
          const body = await res.json().catch(() => ({}))
          throw new Error(body.message ?? 'Login gagal')
        }

        const data = await res.json()
        return { success: true, user: data.user as string }
      } finally {
        setLoading(false)
      }
    },
    []
  )

  return { trigger, loading }
}

export function useAdminSession() {
  const [loading, setLoading] = useState(false)

  const trigger = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/auth/session', { credentials: 'include' })
      if (!res.ok) return { authenticated: false }
      return await res.json() as { authenticated: boolean; user?: string }
    } finally {
      setLoading(false)
    }
  }, [])

  return { trigger, loading }
}

export function useLogout() {
  const [loading, setLoading] = useState(false)

  const trigger = useCallback(async () => {
    setLoading(true)
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
      return { success: true }
    } finally {
      setLoading(false)
    }
  }, [])

  return { trigger, loading }
}

/* ── Specific CRUD Hooks (wrappers around useCrud) ── */

function makeSaveHook(tableName: string) {
  return function useSave() {
    const { loading, error, create, update } = useCrud<{ id: number }>(tableName)

    const trigger = useCallback(
      async (payload: Record<string, unknown>) => {
        if (payload.id && typeof payload.id === 'number') {
          const { id, ...rest } = payload
          return update(id, rest)
        }
        const { id: _id, ...rest } = payload
        return create(rest as Omit<{ id: number }, 'id'>)
      },
      [create, update]
    )

    return { trigger, loading, error }
  }
}

function makeDeleteHook(tableName: string) {
  return function useDelete() {
    const { loading, error, remove } = useCrud<{ id: number }>(tableName)
    const trigger = useCallback(async (id: number) => remove(id), [remove])
    return { trigger, loading, error }
  }
}

export const useSaveProfile = makeSaveHook('profile')
export const useSaveSkill = makeSaveHook('skills')
export const useDeleteSkill = makeDeleteHook('skills')
export const useSaveExperience = makeSaveHook('experiences')
export const useDeleteExperience = makeDeleteHook('experiences')
export const useSaveProject = makeSaveHook('projects')
export const useDeleteProject = makeDeleteHook('projects')
export const useSaveVoiceOver = makeSaveHook('voice_overs')
export const useDeleteVoiceOver = makeDeleteHook('voice_overs')
export const useSaveAchievement = makeSaveHook('achievements')
export const useDeleteAchievement = makeDeleteHook('achievements')
export const useSaveCertificate = makeSaveHook('certificates')
export const useDeleteCertificate = makeDeleteHook('certificates')

export function useSaveCharacterValue() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const trigger = useCallback(async (payload: Record<string, unknown>) => {
    setLoading(true)
    setError(null)
    try {
      const { id, ...rest } = payload
      if (typeof id === 'string' && id.trim()) {
        return await adminCrudRequest('PATCH', 'character_values', { id, payload: rest })
      }
      return await adminCrudRequest('POST', 'character_values', { payload: rest })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Gagal menyimpan nilai karakter'
      setError(msg)
      throw e
    } finally {
      setLoading(false)
    }
  }, [])

  return { trigger, loading, error }
}

export function useDeleteCharacterValue() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const trigger = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      await adminCrudRequest('DELETE', 'character_values', { id })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Gagal menghapus nilai karakter'
      setError(msg)
      throw e
    } finally {
      setLoading(false)
    }
  }, [])

  return { trigger, loading, error }
}

/* ── Update Contact Status ── */
export function useUpdateContactStatus() {
  const [loading, setLoading] = useState(false)

  const trigger = useCallback(
    async (id: number, status: string) => {
      setLoading(true)
      try {
        const res = await fetch('/api/admin/contacts', {
          method: 'PATCH',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, status }),
        })

        const body = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(body.message ?? 'Gagal mengubah status pesan')
        return body.data as ContactMessage
      } finally {
        setLoading(false)
      }
    },
    []
  )

  return { trigger, loading }
}

/* ── Get Contacts Hook ── */
export function useGetContacts() {
  const [data, setData] = useState<ContactMessage[] | null>(null)
  const [loading, setLoading] = useState(false)

  const trigger = useCallback(async (_params?: Record<string, unknown>) => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/contacts', { credentials: 'include' })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(body.message ?? 'Gagal memuat pesan')

      const contacts = (body.data ?? []) as ContactMessage[]
      setData(contacts ?? [])
      return contacts
    } finally {
      setLoading(false)
    }
  }, [])

  return { data, loading, trigger }
}

/* ── Generic CRUD Helper Hook ── */
export function useCrud<T extends { id: number }>(tableName: string) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getAll = useCallback(
    async (orderBy = 'sort_order') => {
      setLoading(true)
      setError(null)
      try {
        const sb = getSupabaseBrowser()
        const { data, error: err } = await sb
          .from(tableName)
          .select('*')
          .order(orderBy)
        if (err) throw new Error(err.message)
        return (data ?? []) as T[]
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Gagal memuat data'
        setError(msg)
        return []
      } finally {
        setLoading(false)
      }
    },
    [tableName]
  )

  const create = useCallback(
    async (payload: Omit<T, 'id'>) => {
      setLoading(true)
      setError(null)
      try {
        return await adminCrudRequest<T>('POST', tableName, {
          payload: payload as Record<string, unknown>,
        })
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Gagal menambah data'
        setError(msg)
        throw e
      } finally {
        setLoading(false)
      }
    },
    [tableName]
  )

  const update = useCallback(
    async (id: number, payload: Partial<T>) => {
      setLoading(true)
      setError(null)
      try {
        return await adminCrudRequest<T>('PATCH', tableName, {
          id,
          payload: payload as Record<string, unknown>,
        })
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Gagal mengubah data'
        setError(msg)
        throw e
      } finally {
        setLoading(false)
      }
    },
    [tableName]
  )

  const remove = useCallback(
    async (id: number) => {
      setLoading(true)
      setError(null)
      try {
        await adminCrudRequest<T>('DELETE', tableName, { id })
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Gagal menghapus data'
        setError(msg)
        throw e
      } finally {
        setLoading(false)
      }
    },
    [tableName]
  )

  return { getAll, create, update, remove, loading, error }
}

/* ── Upload Hook (via API route) ── */
export function useUpload() {
  const [loading, setLoading] = useState(false)

  const trigger = useCallback(
    async (file: File, folder = 'uploads') => {
      setLoading(true)
      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('folder', folder)

        const res = await fetch('/api/upload', {
          method: 'POST',
          credentials: 'include',
          body: formData,
        })

        if (!res.ok) {
          const body = await res.json().catch(() => ({}))
          throw new Error(body.message ?? 'Upload gagal')
        }

        const data = await res.json()
        return data.url as string
      } finally {
        setLoading(false)
      }
    },
    []
  )

  return { trigger, loading }
}