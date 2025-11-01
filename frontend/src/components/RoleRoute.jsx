import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function RoleRoute({ allow = [] }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/signin" replace />
  if (allow.length && !allow.includes(user.role)) return <Navigate to="/" replace />
  return <Outlet />
}
