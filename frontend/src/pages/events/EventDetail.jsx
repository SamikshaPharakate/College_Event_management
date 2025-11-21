import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function EventDetail() {
  const { id } = useParams()
  const nav = useNavigate()
  const { user } = useAuth()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionMsg, setActionMsg] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    (async () => {
      try {
        const { api } = await import('../../lib/api.js')
        const data = await api.get(`/events/${id}`)
        setEvent(data)
      } catch (e) {
        setError(e.message || 'Failed to load event')
      } finally {
        setLoading(false)
      }
    })()
  }, [id])

  const onDelete = async () => {
    if (!confirm('Delete this event?')) return
    try {
      const { api } = await import('../../lib/api.js')
      await api.del(`/admin/events/${id}`)
      nav('/events')
    } catch (e) {
      alert(e.message || 'Failed to delete')
    }
  }

  const onRegister = async () => {
    if (!user) {
      nav('/signin', { replace: true, state: { from: { pathname: `/events/${id}` } } })
      return
    }
    if (user.role === 'admin') return
    try {
      setSaving(true)
      setActionMsg('')
      const { api } = await import('../../lib/api.js')
      await api.post(`/events/${id}/register`)
      setActionMsg('Registered')
      // Optimistically update available seats
      setEvent(e => (e ? { ...e, available_seats: Math.max(0, (e.available_seats || 0) - 1) } : e))
    } catch (e) {
      setActionMsg(e.message || 'Failed to register')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="py-8"><p>Loading...</p></div>
  if (error) return (
    <div className="py-8 container">
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-4 rounded-md">
        <strong className="block">Failed to load event</strong>
        <p className="mt-2">{error}</p>
        <div className="mt-3">
          <button onClick={() => window.location.reload()} className="btn btn-primary btn-small">Reload</button>
        </div>
      </div>
    </div>
  )
  if (!event) return <div className="py-8"><p>Not found</p></div>

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-3 rounded-xl bg-white shadow-card p-6">
        <h2 className="text-2xl font-semibold">{event.title}</h2>
        <div className="text-sm text-gray-700 grid sm:grid-cols-2 gap-y-1">
          <div><span className="font-medium">Starts:</span> {new Date(event.start_time).toLocaleString()}</div>
          <div><span className="font-medium">Ends:</span> {new Date(event.end_time).toLocaleString()}</div>
          <div><span className="font-medium">Location:</span> {event.location || 'TBD'}</div>
          <div><span className="font-medium">Capacity:</span> {event.capacity} · <span className="font-medium">Available:</span> {event.available_seats}</div>
        </div>
        {event.description && <p className="text-gray-800 pt-2">{event.description}</p>}
      </div>
      <aside className="space-y-3 rounded-xl bg-white shadow-card p-6">
        <h3 className="font-semibold">Actions</h3>
        {actionMsg && <p className={`text-sm ${actionMsg === 'Registered' ? 'text-green-600' : 'text-red-600'}`}>{actionMsg}{actionMsg === 'Registered' ? ' ✓' : ''}</p>}
        {(!user || user?.role !== 'admin') && (
          <>
            <button onClick={onRegister} disabled={saving} className={`w-full rounded-md bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 font-medium ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}>{saving ? 'Registering…' : 'Register'}</button>
            {actionMsg === 'Registered' && (
              <button onClick={() => nav('/my-events')} className="w-full rounded-md bg-green-600 hover:bg-green-700 text-white px-4 py-2 font-medium">Go to My Events</button>
            )}
          </>
        )}
        {user?.role === 'admin' && (
          <button onClick={onDelete} className="w-full rounded-md bg-red-600 hover:bg-red-700 text-white px-4 py-2 font-medium">Delete Event</button>
        )}
      </aside>
    </div>
  )
}
