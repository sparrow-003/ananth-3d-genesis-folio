// Simple admin authentication
const ADMIN_CREDENTIALS = {
  ID: "alex@2004",
  PASS: "alex@2004"
}

export const adminAuth = {
  login: (id: string, password: string): boolean => {
    const isValid = id === ADMIN_CREDENTIALS.ID && password === ADMIN_CREDENTIALS.PASS
    if (isValid) {
      localStorage.setItem('admin_session', 'authenticated')
      localStorage.setItem('admin_login_time', Date.now().toString())
    }
    return isValid
  },

  logout: (): void => {
    localStorage.removeItem('admin_session')
    localStorage.removeItem('admin_login_time')
  },

  isAuthenticated: (): boolean => {
    const session = localStorage.getItem('admin_session')
    const loginTime = localStorage.getItem('admin_login_time')
    
    if (!session || !loginTime) return false
    
    // Session expires after 24 hours
    const sessionAge = Date.now() - parseInt(loginTime)
    const maxAge = 24 * 60 * 60 * 1000 // 24 hours
    
    if (sessionAge > maxAge) {
      adminAuth.logout()
      return false
    }
    
    return session === 'authenticated'
  }
}

// Get user IP for like tracking
export const getUserIP = async (): Promise<string> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json')
    const data = await response.json()
    return data.ip
  } catch (error) {
    // Fallback to a random identifier
    return `user_${Math.random().toString(36).substr(2, 9)}`
  }
}