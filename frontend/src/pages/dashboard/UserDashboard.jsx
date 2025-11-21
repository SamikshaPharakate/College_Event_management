import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

export default function UserDashboard() {
  const [regs, setRegs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    (async () => {
      setLoading(true)
      setError('')
      try {
        const { api } = await import('../../lib/api.js')
        const res = await api.get('/me/registrations')
        setRegs(res.items || [])
      } catch (e) {
        setError(e.message || 'Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const upcoming = useMemo(() => {
    const now = new Date()
    return regs.filter(r => r.start_time && new Date(r.start_time) > now)
  }, [regs])

  const nextEvent = useMemo(() => {
    return [...upcoming].sort((a,b)=> new Date(a.start_time) - new Date(b.start_time))[0] || null
  }, [upcoming])

  const daysToNext = useMemo(() => {
    if (!nextEvent) return null
    const ms = new Date(nextEvent.start_time) - new Date()
    return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)))
  }, [nextEvent])

  return (
    <div className="space-y-10">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-700 shadow-xl">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative px-6 py-10 sm:px-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">Your Dashboard</h2>
              <p className="text-white/90 mt-1">Track your registrations and upcoming events</p>
            </div>
            <Link
              to="/events"
              className="inline-flex items-center gap-2 rounded-lg bg-white/95 hover:bg-white text-slate-900 px-5 py-2.5 font-semibold shadow-md"
            >
              Browse Events →
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl bg-white shadow-sm border border-slate-200 p-5">
          <div className="text-sm text-slate-600">Total Registrations</div>
          <div className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">{regs.length}</div>
          <div className="mt-3 h-1 rounded bg-indigo-100">
            <div className="h-1 w-2/3 rounded bg-indigo-500" />
          </div>
        </div>
        <div className="rounded-xl bg-white shadow-sm border border-slate-200 p-5">
          <div className="text-sm text-slate-600">Upcoming</div>
          <div className="mt-2 text-3xl font-extrabold tracking-tight text-emerald-600">{upcoming.length}</div>
          <div className="mt-3 h-1 rounded bg-emerald-100">
            <div className="h-1 w-1/2 rounded bg-emerald-500" />
          </div>
        </div>
        <div className="rounded-xl bg-white shadow-sm border border-slate-200 p-5">
          <div className="text-sm text-slate-600">Days to next event</div>
          <div className="mt-2 text-3xl font-extrabold tracking-tight text-indigo-600">{daysToNext ?? '—'}</div>
          {nextEvent && (
            <div className="mt-2 text-sm text-slate-600">{new Date(nextEvent.start_time).toLocaleDateString()}</div>
          )}
        </div>
      </section>

      {/* Featured Next Event */}
      {nextEvent && (
        <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-r from-emerald-50 via-cyan-50 to-indigo-50">
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-emerald-300/20 blur-3xl" />
          <div className="relative p-6 sm:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 text-emerald-800 px-3 py-1 text-xs font-semibold">
                <span>Next Up</span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </div>
              <h3 className="mt-3 text-2xl font-bold text-slate-900">{nextEvent.title}</h3>
              <p className="mt-1 text-slate-600 flex flex-wrap gap-3 text-sm">
                <span className="inline-flex items-center gap-1"><span>📅</span>{new Date(nextEvent.start_time).toLocaleString()}</span>
                {nextEvent.location && <span className="inline-flex items-center gap-1"><span>📍</span>{nextEvent.location}</span>}
              </p>
            </div>
            <Link to={`/events/${nextEvent.event_id || nextEvent.id}`} className="inline-flex w-max self-start no-underline items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 font-semibold shadow">
              View details
              <span>→</span>
            </Link>
          </div>
        </section>
      )}

      {/* Registrations */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-slate-900">Your registrations</h3>
        </div>

        {loading && (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-xl bg-white shadow-sm border border-slate-200 overflow-hidden animate-pulse">
                <div className="h-24 bg-slate-200" />
                <div className="p-4 space-y-2">
                  <div className="h-4 w-24 bg-slate-200 rounded" />
                  <div className="h-5 w-3/4 bg-slate-200 rounded" />
                  <div className="h-4 w-1/2 bg-slate-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && !loading && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">{error}</div>
        )}

        {!loading && !error && !regs.length && (
          <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center bg-white">
            <div className="text-6xl mb-3">🗓️</div>
            <p className="text-slate-800 text-lg">You haven’t registered for any events yet.</p>
            <p className="text-slate-600">Discover and join upcoming events now.</p>
            <Link to="/events" className="inline-block mt-4 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 font-semibold shadow-sm">Find events</Link>
          </div>
        )}

        {!loading && !error && !!regs.length && (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {regs.map(r => (
              <Link key={r.id} to={`/events/${r.event_id}`} className="group no-underline rounded-xl bg-white shadow-sm border border-slate-200 hover:shadow-lg transition overflow-hidden">
                <div className="h-24 bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-violet-600 group-hover:brightness-110" />
                <div className="p-4">
                  <span className="inline-block text-xs text-white bg-indigo-600 rounded px-2 py-0.5">
                    {r.start_time ? new Date(r.start_time).toLocaleDateString() : '—'}
                  </span>
                  <h4 className="text-lg font-semibold mt-2 text-slate-900">{r.title}</h4>
                  {r.location && <p className="text-sm text-slate-600">📍 {r.location}</p>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
