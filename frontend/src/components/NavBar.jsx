import { NavLink, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function NavBar() {
  const { user, logout } = useAuth()
  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'text-indigo-600 bg-indigo-50'
        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
    }`
  return (
    <header className="sticky top-0 z-50 bg-white/80 supports-backdrop-filter:bg-white/60 backdrop-blur border-b border-gray-200 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center gap-4">
          <Link to="/" className="font-semibold tracking-tight text-slate-900">
            <span className="bg-linear-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Uni</span>
            <span>Events</span>
          </Link>
          <nav className="flex items-center gap-1">
            <NavLink to="/" className={linkClass} end>Home</NavLink>
            <NavLink to="/events" className={linkClass}>Events</NavLink>
            {user?.role === 'admin' && <NavLink to="/dashboard/admin" className={linkClass}>Admin</NavLink>}
            {user && <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            {!user && (
              <>
                <Link to="/signin" className="text-slate-700 hover:text-slate-900 px-3 py-1.5">Login</Link>
                <Link to="/signup" className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-md font-medium shadow-sm">Sign Up</Link>
              </>
            )}
            {user && (
              <>
                <span className="hidden sm:block text-slate-700">Hi, {user.name || user.email}</span>
                <button onClick={logout} className="px-3 py-1.5 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-100">Logout</button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
