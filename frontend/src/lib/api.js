// API base URL: prefer explicit VITE_API_BASE, otherwise use relative '/api'
// This lets Vite's dev proxy or a reverse proxy handle routing.
const API_BASE = import.meta.env?.VITE_API_BASE || '/api'

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
  let url = `${API_BASE}${path}`
  let res
  try {
    res = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: opts.signal,
    })
  } catch (netErr) {
    // Preserve abort semantics so callers can detect and ignore
    const msg = netErr?.message || 'Failed to fetch'
    const err = new Error(`Network error: ${msg}`)
    err.cause = netErr
    err.status = 0
    err.url = url
    err.method = method
    if (netErr?.name === 'AbortError' || /aborted/i.test(msg)) {
      err.name = 'AbortError'
    }
    throw err
  }
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
    err.url = url
    err.method = method
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
