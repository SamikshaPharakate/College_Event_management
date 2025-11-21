import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import Landing from './pages/Landing'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import NotFound from './pages/NotFound'
import SignIn from './pages/auth/SignIn'
import SignUp from './pages/auth/SignUp'

import EventsList from './pages/events/EventsList'
import EventDetail from './pages/events/EventDetail'
import EventCreate from './pages/events/EventCreate'
import AdminDashboard from './pages/dashboard/AdminDashboard'
import UserDashboard from './pages/dashboard/UserDashboard'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/home" element={<Home />} />
      {/* legacy routes redirect to canonical auth pages */}
      <Route path="/login" element={<Navigate to="/signin" replace />} />
      <Route path="/register" element={<Navigate to="/signup" replace />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />

      {/* Events routes */}
      <Route path="/events" element={<EventsList />} />
      <Route path="/events/new" element={<EventCreate />} />
      <Route path="/events/:id" element={<EventDetail />} />

      {/* Dashboards / user pages */}
      <Route path="/dashboard/admin" element={<AdminDashboard />} />
      <Route path="/dashboard" element={<UserDashboard />} />
      <Route path="/my-events" element={<UserDashboard />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}