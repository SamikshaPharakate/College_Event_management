import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function EventCreate() {
  const nav = useNavigate()
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    start_time: '',
    end_time: '',
    capacity: 0,
  })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
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
      const created = await api.post('/admin/events', payload)
      nav(`/events/${created.id}`)
    } catch (e) {
      setError(e.message || 'Failed to create event')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Create Event</h2>
        <Link
          to="/events"
          className="text-gray-600 hover:text-gray-800 text-sm font-medium"
        >
          ← Back to Events
        </Link>
      </div>

      <div className="max-w-2xl rounded-xl bg-white shadow-sm border border-slate-200 p-6">
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <form onSubmit={onSubmit} className="space-y-4">
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
              rows={4}
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
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className={`rounded-md bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 font-medium transition-colors ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {saving ? 'Creating...' : 'Create Event'}
            </button>
            <Link
              to="/events"
              className="rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 font-medium transition-colors"
            >
              Cancel
            </Link>
          </div>
      </form>
      </div>
    </div>
  )
}
