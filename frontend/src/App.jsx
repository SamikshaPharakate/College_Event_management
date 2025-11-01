import './App.css'
import { Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'
import ProtectedRoute from './components/ProtectedRoute'
import RoleRoute from './components/RoleRoute'
import Home from './pages/Home'
import SignIn from './pages/auth/SignIn'
import SignUp from './pages/auth/SignUp'
import UserDashboard from './pages/dashboard/UserDashboard'
import AdminDashboard from './pages/dashboard/AdminDashboard'
import EventsList from './pages/events/EventsList'
import EventCreate from './pages/events/EventCreate'
import EventDetail from './pages/events/EventDetail'
import NotFound from './pages/NotFound'

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />
      <div className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 w-full">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          <Route element={<ProtectedRoute />}> {/* must be signed in */}
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route element={<RoleRoute allow={["admin"]} />}> {/* admin only */}
              <Route path="/dashboard/admin" element={<AdminDashboard />} />
              <Route path="/events/new" element={<EventCreate />} />
            </Route>
          </Route>

          <Route path="/events" element={<EventsList />} />
          <Route path="/events/:id" element={<EventDetail />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
