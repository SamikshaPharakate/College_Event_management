import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function EventsList() {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({ search: '', upcoming: true })

  async function load() {
    setLoading(true)
    setError('')
    try {
      const { api } = await import('../../lib/api.js')
      const params = new URLSearchParams()
      if (filters.search) params.set('search', filters.search)
      if (filters.upcoming) params.set('upcoming', 'true')
      const res = await api.get(`/api/events?${params.toString()}`)
      setItems(res.items || [])
    } catch (e) {
      setError(e.message || 'Failed to load events')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Events</h2>
        {user?.role === 'admin' && <Link to="/events/new" className="rounded-md bg-brand-600 hover:bg-brand-700 text-white px-4 py-2">Create Event</Link>}
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Sidebar */}
        <aside className="lg:col-span-1 card p-5">
          <h3 className="text-lg font-semibold pb-3 border-b">Filter Events</h3>
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Search</label>
              <input
                value={filters.search}
                onChange={e=>setFilters(f=>({...f, search: e.target.value}))}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="Search by title, location..."
              />
            </div>
            <div className="flex items-center gap-2">
              <input id="upcoming" type="checkbox" checked={filters.upcoming} onChange={e=>setFilters(f=>({...f, upcoming: e.target.checked}))} />
              <label htmlFor="upcoming" className="text-sm">Upcoming only</label>
            </div>
            <button onClick={load} className="w-full rounded-md bg-brand-600 hover:bg-brand-700 text-white px-4 py-2">Apply Filters</button>
          </div>
        </aside>

        {/* Grid */}
        <section className="lg:col-span-3">
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-600">{error}</p>}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {items.map(e => (
              <Link key={e.id} to={`/events/${e.id}`} className="rounded-xl bg-white shadow-card p-0 hover:shadow-lg transition overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-brand-600 to-brand-700" />
                <div className="p-4">
                  <span className="inline-block text-xs text-white bg-brand-600 rounded px-2 py-0.5">{new Date(e.start_time).toLocaleDateString()}</span>
                  <h3 className="text-lg font-medium mt-2">{e.title}</h3>
                  {e.location && <p className="text-sm text-gray-600">{e.location}</p>}
                  <p className="text-sm text-gray-700 mt-2">Available: {e.available_seats}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
