import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function AdminDashboard() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedEvent, setExpandedEvent] = useState(null)
  const [registrations, setRegistrations] = useState({})
  const [loadingRegs, setLoadingRegs] = useState({})
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [deletingEvent, setDeletingEvent] = useState(null)
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    start_time: '',
    end_time: '',
    capacity: 0,
  })
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    location: '',
    start_time: '',
    end_time: '',
    capacity: 0,
  })
  const [saving, setSaving] = useState(false)
  const [createError, setCreateError] = useState('')
  const [editError, setEditError] = useState('')

  const loadEvents = async () => {
    setLoading(true)
    setError('')
    try {
      const { api } = await import('../../lib/api.js')
      // Use the new admin endpoint to get events with registrations
      const res = await api.get('/events/admin/with-registrations')
      const events = res.events || []
      
      // Transform the data to match the existing format
      const formattedEvents = events.map(event => ({
        ...event,
        available_seats: event.capacity - (event.registrations?.length || 0)
      }))
      setEvents(formattedEvents)
      setLoading(false)
    } catch (err) {
      console.error('Failed to load events:', err)
      if (err?.status === 401) {
        setError('You must be signed in to view the admin dashboard.')
      } else if (err?.status === 403) {
        setError('Access denied. Admin only. Please sign in with an admin account.')
      } else {
        setError(err?.message || 'Failed to load events. Please try again later.')
      }
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEvents()
  }, [])

  const loadRegistrations = async (eventId) => {
    if (registrations[eventId]) return // Already loaded
    
    setLoadingRegs(prev => ({ ...prev, [eventId]: true }))
    try {
      const { api } = await import('../../lib/api.js')
      const res = await api.get(`/admin/events/${eventId}/registrations`)
      setRegistrations(prev => ({ ...prev, [eventId]: res.items || [] }))
    } catch (e) {
      console.error('Failed to load registrations', e)
      setRegistrations(prev => ({ ...prev, [eventId]: [] }))
    } finally {
      setLoadingRegs(prev => ({ ...prev, [eventId]: false }))
    }
  }

  const toggleEventExpanded = (eventId) => {
    if (expandedEvent === eventId) {
      setExpandedEvent(null)
    } else {
      setExpandedEvent(eventId)
      loadRegistrations(eventId)
    }
  }

  const handleCreateSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setCreateError('')
    try {
      const { api } = await import('../../lib/api.js')
      const payload = {
        title: form.title,
        description: form.description || undefined,
        location: form.location || undefined,
        start_time: form.start_time,
        end_time: form.end_time,
        capacity: Number(form.capacity),
      }
      await api.post('/admin/events', payload)
      // Reset form and reload events
      setForm({ title: '', description: '', location: '', start_time: '', end_time: '', capacity: 0 })
      setShowCreateForm(false)
      loadEvents()
    } catch (e) {
      setCreateError(e.message || 'Failed to create event')
    } finally {
      setSaving(false)
    }
  }

  const handleEditClick = (event) => {
    setDeletingEvent(null) // Clear delete confirmation if any
    setEditingEvent(event.id)
    // Format datetime for input fields
    const formatDateTime = (dateString) => {
      const date = new Date(dateString)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      return `${year}-${month}-${day}T${hours}:${minutes}`
    }
    setEditForm({
      title: event.title,
      description: event.description || '',
      location: event.location || '',
      start_time: formatDateTime(event.start_time),
      end_time: formatDateTime(event.end_time),
      capacity: event.capacity,
    })
    setEditError('')
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setEditError('')
    try {
      const { api } = await import('../../lib/api.js')
      const payload = {}
      if (editForm.title) payload.title = editForm.title
      if (editForm.description !== undefined) payload.description = editForm.description || undefined
      if (editForm.location !== undefined) payload.location = editForm.location || undefined
      if (editForm.start_time) payload.start_time = editForm.start_time
      if (editForm.end_time) payload.end_time = editForm.end_time
      if (editForm.capacity !== undefined) payload.capacity = Number(editForm.capacity)
      
      await api.put(`/admin/events/${editingEvent}`, payload)
      setEditingEvent(null)
      setEditForm({ title: '', description: '', location: '', start_time: '', end_time: '', capacity: 0 })
      loadEvents()
    } catch (e) {
      setEditError(e.message || 'Failed to update event')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteClick = (event) => {
    setEditingEvent(null) // Clear edit mode if any
    setDeletingEvent(event.id)
  }

  const handleDeleteConfirm = async () => {
    if (!deletingEvent) return
    setSaving(true)
    try {
      const { api } = await import('../../lib/api.js')
      await api.del(`/admin/events/${deletingEvent}`)
      setDeletingEvent(null)
      loadEvents()
      // Clear registrations for deleted event
      setRegistrations(prev => {
        const newRegs = { ...prev }
        delete newRegs[deletingEvent]
        return newRegs
      })
      if (expandedEvent === deletingEvent) {
        setExpandedEvent(null)
      }
    } catch (e) {
      setError(e.message || 'Failed to delete event')
      setDeletingEvent(null)
    } finally {
      setSaving(false)
    }
  }

  const handleCancelEdit = () => {
    setEditingEvent(null)
    setEditForm({ title: '', description: '', location: '', start_time: '', end_time: '', capacity: 0 })
    setEditError('')
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }
    return new Date(dateString).toLocaleDateString('en-US', options)
  }

  const renderRegistrations = (event) => {
    const eventRegistrations = event.registrations || []
    if (eventRegistrations.length === 0) {
      return <div className="p-4 text-center text-gray-500">No registrations yet.</div>
    }
    return (
      <div className="mt-2 bg-gray-50 p-4 rounded-md">
        <h4 className="font-medium mb-2">Registrations ({eventRegistrations.length}/{event.capacity})</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Name</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Email</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Registration Date</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {eventRegistrations.map(reg => (
                <tr key={reg._id || reg.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm text-gray-900">{reg.user?.name || 'Unknown User'}</td>
                  <td className="px-4 py-2 text-sm text-gray-600">{reg.user?.email || 'No email'}</td>
                  <td className="px-4 py-2 text-sm text-gray-600">
                    {formatDate(reg.created_at || reg.registrationDate)}
                  </td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      reg.status === 'registered' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {reg.status || 'registered'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 admin-page">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-700 shadow-xl">
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]"></div>
        <div className="relative px-8 py-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 drop-shadow-md">
                Admin Dashboard
              </h1>
              <p className="text-lg text-white/90">
                Manage all events, create new ones, and track user registrations
              </p>
            </div>
            <button
              onClick={() => {
                setShowCreateForm(!showCreateForm)
                setEditingEvent(null)
              }}
              className="bg-cyan-400 hover:bg-cyan-300 text-slate-900 px-6 py-3 rounded-lg font-semibold shadow-lg transition-colors whitespace-nowrap"
            >
              {showCreateForm ? '✕ Cancel' : '+ Create New Event'}
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {!loading && events.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="text-sm text-gray-600 mb-1">Total Events</div>
            <div className="text-3xl font-bold text-gray-900">{events.length}</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="text-sm text-gray-600 mb-1">Upcoming Events</div>
            <div className="text-3xl font-bold text-green-600">
              {events.filter(e => new Date(e.start_time) > new Date()).length}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="text-sm text-gray-600 mb-1">Total Registrations</div>
            <div className="text-3xl font-bold text-indigo-600">
              {events.reduce((sum, e) => sum + (e.capacity - e.available_seats), 0)}
            </div>
          </div>
        </div>
      )}

      {/* Create Event Form */}
      {showCreateForm && (
        <div className="rounded-xl bg-white shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Create New Event</h3>
          {createError && <p className="text-red-600 mb-4">{createError}</p>}
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input
                required
                minLength={3}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Event title"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Event description"
                rows={3}
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Event location"
                value={form.location}
                onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time *</label>
                <input
                  required
                  type="datetime-local"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={form.start_time}
                  onChange={e => setForm(f => ({ ...f, start_time: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Time *</label>
                <input
                  required
                  type="datetime-local"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={form.end_time}
                  onChange={e => setForm(f => ({ ...f, end_time: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Capacity *</label>
              <input
                required
                type="number"
                min="0"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Maximum number of attendees"
                value={form.capacity}
                onChange={e => setForm(f => ({ ...f, capacity: e.target.value }))}
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className={`rounded-md bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 font-medium transition-colors ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {saving ? 'Creating...' : 'Create Event'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false)
                  setCreateError('')
                  setForm({ title: '', description: '', location: '', start_time: '', end_time: '', capacity: 0 })
                }}
                className="rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Events List Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">All Events</h2>
          <span className="text-sm text-gray-500">
            {events.length} {events.length === 1 ? 'event' : 'events'}
          </span>
        </div>

        {loading && <p className="text-center py-12 text-gray-500">Loading events...</p>}
        {error && <p className="text-red-600 text-center py-12">{error}</p>}
        
        {!loading && !error && (
          <>
            {events.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📅</div>
                <p className="text-lg text-gray-700 mb-2">No events found</p>
                <p className="text-gray-500 mb-4">Create your first event to get started!</p>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Create Event
                </button>
              </div>
            ) : (
              <div className="space-y-4">
              {events.map(event => {
                const isExpanded = expandedEvent === event.id
                const regs = registrations[event.id] || []
                const loadingReg = loadingRegs[event.id]
                // Calculate registered count from available seats, or from loaded registrations if available
                const registeredCount = regs.length > 0 
                  ? regs.filter(r => r.status === 'registered').length
                  : event.capacity - event.available_seats
                const isUpcoming = new Date(event.start_time) > new Date()

                return (
                  <div key={event.id} className="rounded-xl bg-white shadow-sm border border-slate-200 overflow-hidden">
                    {/* Colored top accent */}
                    <div style={{ height: 6, background: isUpcoming ? 'linear-gradient(90deg,#10b981,#14b8a6)' : 'linear-gradient(90deg,#64748b,#94a3b8)' }} />
                    {editingEvent === event.id ? (
                      // Edit Form
                      <div className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Edit Event</h3>
                        {editError && <p className="text-red-600 mb-4">{editError}</p>}
                        <form onSubmit={handleEditSubmit} className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                            <input
                              required
                              minLength={3}
                              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              value={editForm.title}
                              onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              rows={3}
                              value={editForm.description}
                              onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                            <input
                              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              value={editForm.location}
                              onChange={e => setEditForm(f => ({ ...f, location: e.target.value }))}
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Start Time *</label>
                              <input
                                required
                                type="datetime-local"
                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                value={editForm.start_time}
                                onChange={e => setEditForm(f => ({ ...f, start_time: e.target.value }))}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">End Time *</label>
                              <input
                                required
                                type="datetime-local"
                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                value={editForm.end_time}
                                onChange={e => setEditForm(f => ({ ...f, end_time: e.target.value }))}
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Capacity *</label>
                            <input
                              required
                              type="number"
                              min="0"
                              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              value={editForm.capacity}
                              onChange={e => setEditForm(f => ({ ...f, capacity: e.target.value }))}
                            />
                          </div>
                          <div className="flex gap-3">
                            <button
                              type="submit"
                              disabled={saving}
                              className={`rounded-md bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 font-medium transition-colors ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                              {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button
                              type="button"
                              onClick={handleCancelEdit}
                              className="rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 font-medium transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    ) : (
                      // Event Display
                      <div className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-semibold">{event.title}</h3>
                              <span className={`text-xs px-2 py-1 rounded ${
                                new Date(event.start_time) > new Date() 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {new Date(event.start_time) > new Date() ? 'Upcoming' : 'Past'}
                              </span>
                            </div>
                            {event.description && (
                              <p className="text-gray-600 mb-2">{event.description}</p>
                            )}
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                              {event.location && (
                                <span>📍 {event.location}</span>
                              )}
                              <span>📅 {new Date(event.start_time).toLocaleString()}</span>
                              <span>👥 Capacity: {event.capacity}</span>
                              <span className="text-indigo-600 font-medium">
                                Registered: {registeredCount}/{event.capacity}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <Link
                              to={`/events/${event.id}`}
                              className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                            >
                              View →
                            </Link>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3 mt-4 flex-wrap">
                          <button
                            onClick={() => toggleEventExpanded(event.id)}
                            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
                          >
                            {isExpanded ? '▼' : '▶'} {isExpanded ? 'Hide' : 'Show'} Registrations ({registeredCount})
                          </button>
                          <span className="text-gray-300">|</span>
                          <button
                            onClick={() => handleEditClick(event)}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                          >
                            ✏️ Edit Event
                          </button>
                          <span className="text-gray-300">|</span>
                          <button
                            onClick={() => handleDeleteClick(event)}
                            className="text-sm text-red-600 hover:text-red-700 font-medium"
                          >
                            🗑️ Delete Event
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Delete Confirmation Modal */}
                    {deletingEvent === event.id && (
                      <div className="border-t border-red-200 bg-red-50 p-4">
                        <p className="text-sm text-red-800 font-medium mb-3">
                          Are you sure you want to delete "{event.title}"? This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                          <button
                            onClick={handleDeleteConfirm}
                            disabled={saving}
                            className={`rounded-md bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-sm font-medium transition-colors ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
                          >
                            {saving ? 'Deleting...' : 'Yes, Delete'}
                          </button>
                          <button
                            onClick={() => setDeletingEvent(null)}
                            className="rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 text-sm font-medium transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Registrations Section - Only show when not editing */}
                    {isExpanded && editingEvent !== event.id && (
                      <div className="border-t border-gray-200 bg-gray-50 p-6">
                        {renderRegistrations(event)}
                        
                        {/* Show cancelled registrations if any */}
                        {event.registrations && event.registrations.some(r => r.status === 'cancelled') && (
                          <div className="mt-6">
                            <h4 className="font-semibold mb-3 text-gray-700">
                              Cancelled Registrations ({event.registrations.filter(r => r.status === 'cancelled').length})
                            </h4>
                            <div className="space-y-2">
                              {event.registrations
                                .filter(r => r.status === 'cancelled')
                                .map(reg => (
                                  <div
                                    key={reg._id || reg.id}
                                    className="bg-white rounded-md border border-gray-200 p-3 flex items-center justify-between opacity-75"
                                  >
                                    <div>
                                      <p className="font-medium text-gray-900">{reg.user?.name || 'Unknown User'}</p>
                                      <p className="text-sm text-gray-600">{reg.user?.email || 'No email'}</p>
                                    </div>
                                    <span className="text-xs px-2 py-1 rounded bg-red-100 text-red-800">
                                      {reg.status}
                                    </span>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
