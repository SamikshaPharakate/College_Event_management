const API_BASE = import.meta.env?.VITE_API_BASE || 'http://localhost:4000'

let token = null

export function setToken(t) {
  token = t || null
  if (token) localStorage.setItem('auth_token', token)
  else localStorage.removeItem('auth_token')
}

export function getToken() {
  return token || localStorage.getItem('auth_token') || null
}

async function request(method, path, body, opts = {}) {
  const headers = { 'Content-Type': 'application/json', ...(opts.headers || {}) }
  const t = getToken()
  if (t) headers['Authorization'] = `Bearer ${t}`
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    signal: opts.signal,
  })
  const isJson = res.headers.get('content-type')?.includes('application/json')
  const data = isJson ? await res.json() : await res.text()
  if (!res.ok) {
    let msg = 'Request failed'
    if (typeof data === 'string') {
      msg = data
    } else if (Array.isArray(data?.errors)) {
      msg = data.errors.map(e => e.msg || e).join(', ')
    } else if (data?.error) {
      msg = data.error
    }
    const err = new Error(msg)
    err.status = res.status
    err.data = data
    throw err
  }
  return data
}

export const api = {
  get: (path, opts) => request('GET', path, undefined, opts),
  post: (path, body, opts) => request('POST', path, body, opts),
  put: (path, body, opts) => request('PUT', path, body, opts),
  del: (path, opts) => request('DELETE', path, undefined, opts),
}

export { API_BASE }
