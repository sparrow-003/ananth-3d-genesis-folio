import { supabase } from '@/integrations/supabase/client'

// Admin authentication using Supabase Auth
export const adminAuth = {
  // Login with email/password via Supabase Auth
  login: async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error('Login error:', error.message)
        return { success: false, error: error.message }
      }

      if (!data.user) {
        return { success: false, error: 'Login failed' }
      }

      // Check if user has admin role
      const hasAdminRole = await adminAuth.checkAdminRole(data.user.id)
      if (!hasAdminRole) {
        // Sign out if not admin
        await supabase.auth.signOut()
        return { success: false, error: 'Access denied. Admin privileges required.' }
      }

      return { success: true }
    } catch (err) {
      console.error('Unexpected login error:', err)
      return { success: false, error: 'An unexpected error occurred' }
    }
  },

  // Logout via Supabase Auth
  logout: async (): Promise<void> => {
    await supabase.auth.signOut()
  },

  // Check if user is authenticated as admin (server-verified)
  isAuthenticated: async (): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return false
      
      // Verify admin role from database
      return await adminAuth.checkAdminRole(user.id)
    } catch {
      return false
    }
  },

  // Check admin role from database (secure server-side check)
  checkAdminRole: async (userId: string): Promise<boolean> => {
    try {
      const { data, error } = await (supabase as any)
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .single()

      if (error || !data) return false
      return true
    } catch {
      return false
    }
  },

  // Get current session
  getSession: async () => {
    const { data: { session } } = await supabase.auth.getSession()
    return session
  },

  // Get current user
  getUser: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  },

  // Subscribe to auth state changes
  onAuthStateChange: (callback: (isAuthenticated: boolean) => void) => {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const isAdmin = await adminAuth.checkAdminRole(session.user.id)
        callback(isAdmin)
      } else {
        callback(false)
      }
    })
  }
}

// Get user IP for like tracking (anonymous tracking)
export const getUserIP = async (): Promise<string> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json')
    const data = await response.json()
    return data.ip
  } catch (error) {
    // Fallback to a random identifier stored in localStorage
    const storedId = localStorage.getItem('anonymous_user_id')
    if (storedId) return storedId
    
    const newId = `anon_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem('anonymous_user_id', newId)
    return newId
  }
}
