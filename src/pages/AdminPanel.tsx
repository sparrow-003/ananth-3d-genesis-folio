import { useState, useEffect, useCallback, useRef } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '@/integrations/supabase/client'
import AdminLogin from '@/components/AdminLogin'
import AdminDashboard from '@/components/AdminDashboard'

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const lastUserIdRef = useRef<string | null>(null)

  const checkAdminRole = useCallback(async (userId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.rpc('has_role', {
        _user_id: userId,
        _role: 'admin',
      })
      if (error) return false
      return Boolean(data)
    } catch {
      return false
    }
  }, [])

  useEffect(() => {
    let mounted = true

    const resolveFromSession = async (
      session: Session | null,
      options?: { force?: boolean; showLoader?: boolean }
    ) => {
      const { force = false, showLoader = false } = options ?? {}

      if (!mounted) return

      const userId = session?.user?.id ?? null

      if (!userId) {
        lastUserIdRef.current = null
        setIsAuthenticated(false)
        setLoading(false)
        return
      }

      const userUnchanged = lastUserIdRef.current === userId
      if (userUnchanged && !force) {
        // Avoid a loading flicker/loop on events like TOKEN_REFRESHED.
        setLoading(false)
        return
      }

      if (showLoader) setLoading(true)
      const isAdmin = await checkAdminRole(userId)

      if (!mounted) return

      lastUserIdRef.current = userId
      setIsAuthenticated(isAdmin)
      setLoading(false)
    }

    const checkAuth = async () => {
      try {
        // First get session (faster than getUser)
        const { data: { session } } = await supabase.auth.getSession()
        await resolveFromSession(session, { force: true, showLoader: true })
      } catch (error) {
        console.error('Auth check failed:', error)
        if (mounted) {
          setIsAuthenticated(false)
          setLoading(false)
        }
      }
    }

    // Initial auth check
    checkAuth()

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return

      if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false)
        setLoading(false)
        lastUserIdRef.current = null
        return
      }

      // Prevent continuous loading loops caused by periodic token refreshes.
      if (event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') {
        return
      }

      await resolveFromSession(session, {
        force: event === 'USER_UPDATED',
        showLoader: event === 'SIGNED_IN' || event === 'USER_UPDATED',
      })
    })

    return () => {
      mounted = false
      clearTimeout(safetyTimeout)
      subscription?.unsubscribe()
    }
  }, [checkAdminRole])

  const handleLogin = useCallback(() => {
    setIsAuthenticated(true)
  }, [])

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut()
    setIsAuthenticated(false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="fixed inset-0 bg-gradient-to-br from-emerald-950/20 via-black to-teal-950/20 -z-10" />
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-emerald-500/30" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-emerald-500 animate-spin" />
        </div>
      </div>
    )
  }

  return isAuthenticated ? (
    <AdminDashboard onLogout={handleLogout} />
  ) : (
    <AdminLogin onLogin={handleLogin} />
  )
}

export default AdminPanel
