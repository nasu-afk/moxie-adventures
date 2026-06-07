import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userToken = localStorage.getItem('moxie_user_token')
    const adminToken = localStorage.getItem('moxie_admin_token')
    if (userToken) {
      try {
        const payload = JSON.parse(atob(userToken.split('.')[1]))
        if (payload.exp * 1000 > Date.now()) setUser({ ...payload, token: userToken })
      } catch {}
    }
    if (adminToken) {
      try {
        const payload = JSON.parse(atob(adminToken.split('.')[1]))
        if (payload.exp * 1000 > Date.now()) setAdmin({ ...payload, token: adminToken })
      } catch {}
    }
    setLoading(false)
  }, [])

  const loginUser = (data) => {
    localStorage.setItem('moxie_user_token', data.token)
    setUser({ ...data.user, token: data.token })
  }

  const loginAdmin = (data) => {
    localStorage.setItem('moxie_admin_token', data.token)
    setAdmin({ ...data.admin, token: data.token })
  }

  const logoutUser = () => {
    localStorage.removeItem('moxie_user_token')
    setUser(null)
  }

  const logoutAdmin = () => {
    localStorage.removeItem('moxie_admin_token')
    setAdmin(null)
  }

  return (
    <AuthContext.Provider value={{ user, admin, loading, loginUser, loginAdmin, logoutUser, logoutAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
