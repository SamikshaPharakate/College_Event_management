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

  useEffect(() => {
    (async () => {
      try {
        const { api } = await import('../../lib/api.js')
        const data = await api.get(`/api/events/${id}`)
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
      await api.del(`/api/admin/events/${id}`)
      nav('/events')
    } catch (e) {
      alert(e.message || 'Failed to delete')
    }
  }

  if (loading) return <div className="py-8"><p>Loading...</p></div>
  if (error) return <div className="py-8"><p className="text-red-600">{error}</p></div>
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
        {user?.role === 'admin' && (
          <button onClick={onDelete} className="w-full rounded-md bg-red-600 hover:bg-red-700 text-white px-4 py-2 font-medium">Delete Event</button>
        )}
      </aside>
    </div>
  )
}
