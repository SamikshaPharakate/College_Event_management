// src/pages/events/EventsList.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import EventCard from '../../components/EventCard';

function EventsList() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [items, setItems] = useState([])

  useEffect(() => {
    let abort = new AbortController()
    ;(async () => {
      try {
        setError('')
        setLoading(true)
        const { api } = await import('../../lib/api.js')
        const res = await api.get('/events', { signal: abort.signal })
        setItems(res.items || [])
      } catch (e) {
        if (e.name !== 'AbortError') setError(e.message || 'Failed to load events')
      } finally {
        setLoading(false)
      }
    })()
    return () => abort.abort()
  }, [])

  const cards = useMemo(() => {
    const fmtDate = (iso) => {
      try {
        const d = new Date(iso)
        return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
      } catch { return '' }
    }
    const fmtTime = (start, end) => {
      try {
        const s = new Date(start).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
        const e = new Date(end).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
        return `${s} - ${e}`
      } catch { return '' }
    }
    return items.map(ev => ({
      id: ev.id,
      title: ev.title,
      description: ev.description || '',
      location: ev.location || 'TBD',
      date: fmtDate(ev.start_time),
      time: fmtTime(ev.start_time, ev.end_time),
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1470&q=80',
    }))
  }, [items])

  const handleRegister = async (event) => {
    if (!user) {
      navigate('/signin', { state: { from: { pathname: '/events' } } })
      return
    }
    try {
      const { api } = await import('../../lib/api.js')
      await api.post(`/events/${event.id}/register`)
      navigate('/my-events')
    } catch (e) {
      throw e
    }
  }

  return (
    <div className="main-content">
      <Sidebar />
      <section className="events-section">
        <h2><i className="fas fa-calendar-week"></i> Upcoming Events</h2>
        {loading && <p>Loading events...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div className="events-grid">
          {cards.map(event => (
            <EventCard key={event.id} event={event} onRegister={handleRegister} />
          ))}
        </div>
      </section>
    </div>
  )
}

export default EventsList;
