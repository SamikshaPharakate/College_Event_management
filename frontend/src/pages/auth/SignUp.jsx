import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function SignUp() {
  const { register } = useAuth()
  const nav = useNavigate()
  const [form, setForm] = useState({ name:'', email:'', password:'', role:'user' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      await register(form)
      nav('/')
    } catch (err) {
      setError(err.message || 'Failed to sign up')
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-600 via-indigo-600 to-fuchsia-600" />
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
      <div
        className="pointer-events-none absolute -inset-[40%] rounded-full opacity-20 blur-2xl animate-spin"
        style={{
          background:
            'conic-gradient(from 0deg, rgba(255,255,255,0.15), rgba(255,255,255,0), rgba(255,255,255,0.15))',
          animationDuration: '20s',
        }}
      />
      <div className="pointer-events-none absolute left-10 top-16 w-24 h-24 rounded-full bg-white/10 blur-xl animate-pulse" />
      <div className="pointer-events-none absolute right-14 bottom-24 w-20 h-20 rounded-full bg-white/10 blur-xl animate-pulse" />

      <div className="relative mx-auto max-w-md px-4 py-16">
        <div className="rounded-2xl bg-white shadow-xl border border-white/40 p-8">
          <h2 className="text-2xl font-semibold mb-6 text-center">Create your account</h2>
          {error && <p className="text-red-600 mb-3 text-center">{error}</p>}
          <form onSubmit={onSubmit} className="space-y-3">
            <input required minLength={2} className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="Name" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} />
            <input required className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="Email" type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} />
            <input required minLength={6} className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="Password" type="password" value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} />
            <select className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500" value={form.role} onChange={e=>setForm(f=>({...f,role:e.target.value}))}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <button type="submit" disabled={loading} className={`w-full rounded-md bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 font-medium ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}>
              {loading ? 'Submitting…' : 'Sign up'}
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-600">Already have an account? <a className="text-brand-600 hover:underline" href="/signin">Sign in</a></p>
        </div>
      </div>
    </div>
  )
}
