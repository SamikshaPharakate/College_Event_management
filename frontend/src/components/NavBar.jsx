import { NavLink, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function NavBar() {
  const { user, logout } = useAuth()
  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-full text-sm font-medium transition-colors ${
      isActive
        ? 'bg-white/20 text-white'
        : 'text-white/90 hover:text-white hover:bg-white/10'
    }`
  return (
    <header className="sticky top-0 z-50 bg-linear-to-r from-indigo-600 to-violet-600 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center gap-4">
          <Link to="/" className="font-semibold tracking-tight text-white flex items-center gap-2">
            <span className="text-lg">📅</span>
            <span>UniEvents</span>
          </Link>
          <nav className="flex items-center gap-1">
            <NavLink to="/" className={linkClass} end>Home</NavLink>
            <NavLink to="/events" className={linkClass}>Events</NavLink>
            {user?.role === 'admin' && <NavLink to="/dashboard/admin" className={linkClass}>Admin</NavLink>}
            {user && <NavLink to="/my-events" className={linkClass}>My Events</NavLink>}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            {!user && (
              <>
                <Link to="/signin" className="text-white px-3 py-1.5 rounded-full border border-white/60 hover:bg-white/10">Login</Link>
                <Link to="/signup" className="bg-cyan-400 hover:bg-cyan-300 text-slate-900 px-3 py-1.5 rounded-full font-medium shadow-sm">Sign Up</Link>
              </>
            )}
            {user && (
              <>
                <span className="hidden sm:block text-white/90">Hi, {user.name || user.email}{user.role === 'admin' ? ' (Admin)' : ''}</span>
                <button onClick={logout} className="px-3 py-1.5 rounded-full border border-white/60 text-white hover:bg-white/10">Logout</button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
