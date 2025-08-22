const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

export const api = {
  async login(username, password){
    const res = await fetch(`${BASE}/api/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
    if(!res.ok) throw new Error('Invalid credentials')
    return res.json()
  },
  async authFetch(path, token){
    const res = await fetch(`${BASE}${path}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if(!res.ok) throw new Error('Auth failed')
    return res.json()
  }
}
