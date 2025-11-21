// src/pages/Landing.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Landing() {
  const { user, logout } = useAuth()
  const nav = useNavigate()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  // Reference images for hero and event cards
  const heroBgUrl = 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'
  const cardImageUrls = [
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
    'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
    'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
    'https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
    'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
    'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
  ]

  // Generate fallback sample events when DB has few/none
  const generateSampleEvents = () => {
    const base = new Date()
    const mk = (i, title, days, location) => ({
      id: `sample-${i}`,
      title,
      description: 'Sample event for preview purposes. Create real events to replace these.',
      location,
      start_time: new Date(base.getTime() + days * 24 * 60 * 60 * 1000).toISOString(),
      end_time: new Date(base.getTime() + (days * 24 + 2) * 60 * 60 * 1000).toISOString(),
      available_seats: 50,
      capacity: 100,
    })
    return [
      mk(1, 'Tech Talk: Modern Web', 2, 'Auditorium A'),
      mk(2, 'Cultural Night', 5, 'Main Hall'),
      mk(3, 'AI Workshop', 7, 'Lab 3'),
      mk(4, 'Entrepreneurship Panel', 9, 'Seminar Room 2'),
      mk(5, 'Sports Meet', 12, 'Ground 1'),
      mk(6, 'Alumni Meetup', 15, 'Conference Center'),
    ]
  }

  const fetchAll = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const { api } = await import('../lib/api.js')
      const res = await api.get('/events?upcoming=false')
      let items = (res.items || [])
        .sort((a,b) => new Date(a.start_time) - new Date(b.start_time))
      // Ensure we always show a decent list on Home
      if (items.length < 6) {
        const samples = generateSampleEvents()
        const need = 6 - items.length
        items = items.concat(samples.slice(0, need))
      }
      setEvents(items)
    } catch (e) {
      setError(e.message || 'Failed to load events')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  const [selectedTypes, setSelectedTypes] = useState(new Set(['All']))
  const [dateRange, setDateRange] = useState('upcoming') // upcoming | week | month | past

  // Compute filtered events based on selected date range
  const filteredEvents = (() => {
    const now = new Date()
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const endOfWeek = (() => {
      const d = new Date(startOfToday)
      const day = d.getDay() // 0..6
      const add = 6 - day
      d.setDate(d.getDate() + add)
      d.setHours(23,59,59,999)
      return d
    })()
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)

    let list = events
    if (dateRange === 'upcoming') {
      list = list.filter(e => new Date(e.start_time) >= startOfToday)
    } else if (dateRange === 'week') {
      list = list.filter(e => {
        const t = new Date(e.start_time)
        return t >= startOfToday && t <= endOfWeek
      })
    } else if (dateRange === 'month') {
      list = list.filter(e => {
        const t = new Date(e.start_time)
        return t >= startOfToday && t <= endOfMonth
      })
    } else if (dateRange === 'past') {
      list = list.filter(e => new Date(e.start_time) < startOfToday)
    }
    // Always sort ascending by date
    list = [...list].sort((a,b) => new Date(a.start_time) - new Date(b.start_time))
    return list
  })()

  const handleRegister = (title) => {
    const q = encodeURIComponent(title)
    nav(`/events?search=${q}&time=all`)
  };

  return (
    <>
      {/* Header */}
      <header>
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <i className="fas fa-calendar-alt"></i>
              <h1>UniEvents</h1>
            </div>
            <nav>
              <ul>
                <li><Link to="#" className="active">Home</Link></li>
                <li><Link to="/events">Events</Link></li>
                {user && <li><Link to="/my-events">My Events</Link></li>}
                {user?.role === 'admin' && <li><Link to="/dashboard/admin">Admin</Link></li>}
              </ul>
            </nav>
            <div className="user-actions">
              {!user && (
                <>
                  <Link to="/signin" className="btn btn-outline">Login</Link>
                  <Link to="/signup" className="btn btn-primary">Sign Up</Link>
                </>
              )}
              {user && (
                <>
                  <span style={{ color: '#fff', fontWeight: 600 }}>Hi, {user.name || user.email}{user.role === 'admin' ? ' (Admin)' : ''}</span>
                  <button onClick={logout} className="btn btn-outline">Logout</button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        className="hero"
        style={{
          backgroundImage: `linear-gradient(rgba(67, 97, 238, 0.8), rgba(63, 55, 201, 0.9)), url(${heroBgUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="container">
          <h2>Manage Your College Events</h2>
          <p>
            Discover, create, and manage all campus events in one place. From academic seminars to social gatherings,
            never miss out on what's happening at your college.
          </p>
          {user?.role === 'admin' ? (
            <Link to="/events/new" className="btn btn-primary">Create New Event</Link>
          ) : (
            <Link to="/events" className="btn btn-primary">Browse Events</Link>
          )}
        </div>
      </section>

      {/* Main Content */}
      <div className="container">
        <div className="main-content">
          {/* Sidebar with Filters */}
          <aside className="sidebar">
            <h3>Filter Events</h3>

            <div className="filter-group">
              <h4>Event Type</h4>
              <div className="filter-options">
                <label>
                  <input
                    type="checkbox"
                    checked={selectedTypes.has('All')}
                    onChange={(e) => setSelectedTypes(new Set(e.target.checked ? ['All'] : []))}
                  />{' '}All Events
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedTypes.has('Academic')}
                    onChange={(e) => setSelectedTypes(prev => { const n = new Set(prev); n.delete('All'); if (e.target.checked) n.add('Academic'); else n.delete('Academic'); return n })}
                  />{' '}Academic
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedTypes.has('Cultural')}
                    onChange={(e) => setSelectedTypes(prev => { const n = new Set(prev); n.delete('All'); if (e.target.checked) n.add('Cultural'); else n.delete('Cultural'); return n })}
                  />{' '}Cultural
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedTypes.has('Sports')}
                    onChange={(e) => setSelectedTypes(prev => { const n = new Set(prev); n.delete('All'); if (e.target.checked) n.add('Sports'); else n.delete('Sports'); return n })}
                  />{' '}Sports
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedTypes.has('Workshops')}
                    onChange={(e) => setSelectedTypes(prev => { const n = new Set(prev); n.delete('All'); if (e.target.checked) n.add('Workshops'); else n.delete('Workshops'); return n })}
                  />{' '}Workshops
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedTypes.has('Social')}
                    onChange={(e) => setSelectedTypes(prev => { const n = new Set(prev); n.delete('All'); if (e.target.checked) n.add('Social'); else n.delete('Social'); return n })}
                  />{' '}Social
                </label>
              </div>
            </div>

            <div className="filter-group">
              <h4>Date Range</h4>
              <div className="filter-options">
                <label><input type="radio" name="date" checked={dateRange==='upcoming'} onChange={() => setDateRange('upcoming')} /> Upcoming</label>
                <label><input type="radio" name="date" checked={dateRange==='week'} onChange={() => setDateRange('week')} /> This Week</label>
                <label><input type="radio" name="date" checked={dateRange==='month'} onChange={() => setDateRange('month')} /> This Month</label>
                <label><input type="radio" name="date" checked={dateRange==='past'} onChange={() => setDateRange('past')} /> Past Events</label>
              </div>
            </div>

            <div className="filter-group">
              <h4>Department</h4>
              <div className="filter-options">
                <label><input type="checkbox" defaultChecked /> All Departments</label>
                <label><input type="checkbox" /> Computer Science</label>
                <label><input type="checkbox" /> Engineering</label>
                <label><input type="checkbox" /> Business</label>
                <label><input type="checkbox" /> Arts & Sciences</label>
              </div>
            </div>

            <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => { /* filters apply instantly */ }}>
              Apply Filters
            </button>
          </aside>

          {/* All Events (dynamic) */}
          <section className="events-section">
            <h2>
              <i className="fas fa-calendar-week"></i> All Events
              {user && (
                <span style={{ marginLeft: '12px', fontSize: '0.9em', fontWeight: 600 }}>
                  · <Link to="/my-events">My Events</Link>
                </span>
              )}
            </h2>
            {error && (
              <div className="events-empty" style={{ margin: '12px 0' }}>
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-5 rounded-md" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ fontSize: 20 }}>⚠️</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, marginBottom: 6 }}>Could not load events</div>
                    <div style={{ color: '#9f1239' }}>{error}</div>
                  </div>
                  <div>
                    <button className="btn btn-primary btn-small" onClick={fetchAll}>Retry</button>
                  </div>
                </div>
                <div style={{ marginTop: 10, color: '#6b7280', fontSize: 13 }}>
                  Tip: ensure the backend server is running (default port 4000) so the app can fetch events.
                </div>
              </div>
            )}

            <div className="events-grid">
              {loading && Array.from({ length: 6 }).map((_, i) => (
                <div className="event-card" key={i}>
                  <div
                    className="event-image"
                    style={{
                      backgroundImage: `url(${cardImageUrls[i % cardImageUrls.length]})`,
                    }}
                  ></div>
                  <div className="event-content">
                    <div className="event-date" style={{ background: '#e2e8f0', color: '#475569' }}>Loading…</div>
                    <div className="event-title" style={{ height: 20, background: '#e5e7eb', borderRadius: 6 }}></div>
                  </div>
                </div>
              ))}
              {!loading && !error && filteredEvents.map((e) => (
                <div className="event-card" key={e.id}>
                  <div
                    className="event-image"
                    style={{
                      backgroundImage: `url(${cardImageUrls[Number(String(e.id).replace(/\D/g, '')) % cardImageUrls.length] || cardImageUrls[0]})`,
                    }}
                  ></div>
                  <div className="event-content">
                    <span className="event-date">{new Date(e.start_time).toLocaleDateString()}</span>
                    <h3 className="event-title">{e.title}</h3>
                    {e.location && (
                      <div className="event-details">
                        <i className="fas fa-map-marker-alt"></i>
                        <span>{e.location}</span>
                      </div>
                    )}
                    <div className="event-details">
                      <i className="fas fa-clock"></i>
                      <span>{new Date(e.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    {e.description && <p className="event-description">{e.description}</p>}
                    <div className="event-actions">
                      <button className="btn btn-primary btn-small" onClick={() => handleRegister(e.title)}>Register</button>
                      {String(e.id).startsWith('sample-') ? (
                        <button className="btn btn-outline btn-small" disabled>Details</button>
                      ) : (
                        <Link to={`/events/${e.id}`} className="btn btn-outline btn-small">Details</Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {!loading && !error && filteredEvents.length === 0 && (
              <p className="events-empty" style={{ textAlign: 'center', color: '#64748b', marginTop: 12 }}>
                No events found. Try checking back later or browse <Link to="/events">all events</Link>.
              </p>
            )}
          </section>

          
        </div>
      </div>

      {/* Footer */}
      <footer>
        <div className="container">
          <div className="footer-content">
            <div className="footer-column">
              <h3>UniEvents</h3>
              <p>Your comprehensive platform for managing all college events, activities, and gatherings in one place.</p>
              <div className="social-links">
                <a href="#"><i className="fab fa-facebook-f"></i></a>
                <a href="#"><i className="fab fa-twitter"></i></a>
                <a href="#"><i className="fab fa-instagram"></i></a>
                <a href="#"><i className="fab fa-linkedin-in"></i></a>
              </div>
            </div>
            <div className="footer-column">
              <h3>Quick Links</h3>
              <ul>
                <li><a href="#">Home</a></li>
                <li><a href="#">Events</a></li>
                <li><a href="#">My Events</a></li>
                <li><a href="#">Calendar</a></li>
                <li><a href="#">Create Event</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h3>Support</h3>
              <ul>
                <li><a href="#">Help Center</a></li>
                <li><a href="#">Contact Us</a></li>
                <li><a href="#">FAQs</a></li>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h3>Contact Info</h3>
              <ul>
                <li><i className="fas fa-map-marker-alt"></i> 123 University Ave, Campus Town</li>
                <li><i className="fas fa-phone"></i> (555) 123-4567</li>
                <li><i className="fas fa-envelope"></i> info@unievents.edu</li>
              </ul>
            </div>
          </div>
          <div className="copyright">
            <p>&copy; 2025 UniEvents. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Landing;
