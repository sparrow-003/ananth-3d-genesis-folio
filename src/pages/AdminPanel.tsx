import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/integrations/supabase/client'
import AdminLogin from '@/components/AdminLogin'
import AdminDashboard from '@/components/AdminDashboard'

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  const checkAdminRole = useCallback(async (userId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .maybeSingle()

      return !error && !!data
    } catch {
      return false
    }
  }, [])

  useEffect(() => {
    let mounted = true

    const checkAuth = async () => {
      try {
        // First get session (faster than getUser)
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session?.user) {
          if (mounted) {
            setIsAuthenticated(false)
            setLoading(false)
          }
          return
        }

        // Check admin role
        const isAdmin = await checkAdminRole(session.user.id)
        
        if (mounted) {
          setIsAuthenticated(isAdmin)
          setLoading(false)
        }
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
        return
      }

      if (session?.user) {
        setLoading(true)
        const isAdmin = await checkAdminRole(session.user.id)
        if (mounted) {
          setIsAuthenticated(isAdmin)
          setLoading(false)
        }
      } else {
        setIsAuthenticated(false)
        setLoading(false)
      }
    })

    return () => {
      mounted = false
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
