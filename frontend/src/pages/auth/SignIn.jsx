import { useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function SignIn() {
  const { login } = useAuth()
  const nav = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'
  const [form, setForm] = useState({ email:'', password:'' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError('')
      const user = await login(form)
      // Redirect admin to admin dashboard, others to intended destination or home
      if (user.role === 'admin') {
        nav('/dashboard/admin', { replace: true })
      } else {
      nav(from, { replace: true })
      }
    } catch (err) {
      setError(err.message || 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="rounded-2xl bg-white shadow-xl border border-white/40 p-8">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-semibold">Sign In</h2>
          <p className="text-sm text-gray-500">Access your UniEvent account to manage registrations and events</p>
        </div>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4" role="alert">
            {error}
          </div>
        )}
        <form onSubmit={onSubmit} className="space-y-4">
          <input required className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Email" type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} />
          <input required className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Password" type="password" value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} />
          <button type="submit" disabled={loading} className="w-full rounded-md bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 font-medium disabled:opacity-70">
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="text-indigo-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
