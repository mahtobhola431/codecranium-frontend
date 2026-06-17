import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

function getToken(): string | null {
  if (typeof window === 'undefined') return null
  try {
    const path = window.location.pathname
    if (path.startsWith('/admin')) {
      const s = JSON.parse(localStorage.getItem('cc-admin') || '{}')
      return s?.state?.token ?? null
    }
    if (path.startsWith('/instructor')) {
      const s = JSON.parse(localStorage.getItem('cc-instructor') || '{}')
      return s?.state?.token ?? null
    }
    // Learner portal
    const s = JSON.parse(localStorage.getItem('cc-auth') || '{}')
    return s?.state?.token ?? null
  } catch {
    return null
  }
}

api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      const path = window.location.pathname
      // Only redirect learner routes — admin/instructor portals show their own login gate
      if (!path.startsWith('/admin') && !path.startsWith('/instructor')) {
        window.location.href = '/auth/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
