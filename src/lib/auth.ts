import { supabase } from '@/integrations/supabase/client'

// Admin authentication using Supabase Auth exclusively (secure approach)
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
    // Try multiple IP services for reliability
    const ipServices = [
      'https://api.ipify.org?format=json',
      'https://ipapi.co/json/',
      'https://api.ip.sb/jsonip'
    ]
    
    for (const service of ipServices) {
      try {
        const response = await fetch(service, { 
          timeout: 5000,
          headers: {
            'Accept': 'application/json'
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          const ip = data.ip || data.query
          
          if (ip && ip !== '127.0.0.1' && ip !== 'localhost') {
            // Hash the IP for privacy
            const hashedIP = await hashString(ip)
            return hashedIP
          }
        }
      } catch (error) {
        console.warn(`IP service ${service} failed:`, error)
        continue
      }
    }
    
    // Fallback to stored anonymous ID
    const storedId = localStorage.getItem('anonymous_user_id')
    if (storedId) return storedId
    
    // Generate new anonymous ID
    const newId = `anon_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`
    localStorage.setItem('anonymous_user_id', newId)
    return newId
    
  } catch (error) {
    console.error('Error getting user IP:', error)
    
    // Final fallback
    const fallbackId = localStorage.getItem('anonymous_user_id') || 
                      `fallback_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`
    localStorage.setItem('anonymous_user_id', fallbackId)
    return fallbackId
  }
}

// Simple hash function for IP privacy
const hashString = async (str: string): Promise<string> => {
  try {
    if (crypto.subtle) {
      const encoder = new TextEncoder()
      const data = encoder.encode(str + 'blog_salt_2024')
      const hashBuffer = await crypto.subtle.digest('SHA-256', data)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    }
  } catch (error) {
    console.warn('Crypto API not available, using simple hash')
  }
  
  // Fallback simple hash
  let hash = 0
  const saltedStr = str + 'blog_salt_2024'
  for (let i = 0; i < saltedStr.length; i++) {
    const char = saltedStr.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16)
}
