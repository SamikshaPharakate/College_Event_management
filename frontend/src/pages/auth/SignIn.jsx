import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function SignIn() {
  const { login } = useAuth()
  const nav = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'
  const [form, setForm] = useState({ email:'', password:'' })
  const [error, setError] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      await login(form)
      nav(from, { replace: true })
    } catch (err) {
      setError(err.message || 'Failed to sign in')
    }
  }
  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h2 className="text-2xl font-semibold mb-6">Sign In</h2>
      {error && <p className="text-red-600 mb-3">{error}</p>}
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="Email" type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} />
        <input className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="Password" type="password" value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} />
        <button type="submit" className="w-full rounded-md bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 font-medium">Sign In</button>
      </form>
    </div>
  )
}
