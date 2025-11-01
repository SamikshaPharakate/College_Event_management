import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Home() {
  const { user } = useAuth()
  return (
    <div>
      <section className="relative text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(rgba(67,97,238,0.80), rgba(63,55,201,0.90)), url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1470&auto=format&fit=crop')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-600 to-brand-700 opacity-30" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-brand-100 via-white to-brand-100 bg-clip-text text-transparent">Manage Your College Events</h1>
          <p className="mt-4 text-white/90 max-w-2xl mx-auto">Discover, create, and manage all campus events in one place. From academic seminars to social gatherings, never miss out on what's happening at your college.</p>
          <div className="mt-8">
            {user?.role === 'admin' ? (
              <Link to="/events/new" className="inline-flex items-center rounded-md bg-brand-500 hover:bg-brand-600 text-white px-5 py-2.5 font-medium shadow">Create New Event</Link>
            ) : (
              <Link to="/events" className="inline-flex items-center rounded-md bg-brand-500 hover:bg-brand-600 text-white px-5 py-2.5 font-medium shadow">Browse Events</Link>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <aside className="lg:col-span-1">
            <div className="rounded-lg bg-white shadow-sm border border-gray-200 p-5">
              <h3 className="text-gray-900 font-semibold">Filter Events</h3>
              <div className="mt-5">
                <p className="text-xs font-semibold text-gray-500 tracking-wider">Event Type</p>
                <ul className="mt-3 space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                    <span>All Events</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span>Academic</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span>Cultural</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span>Sports</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span>Workshops</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6">
                <p className="text-xs font-semibold text-gray-500 tracking-wider">Department</p>
                <ul className="mt-3 space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                    <span>All Departments</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span>Computer Science</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span>Engineering</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span>Business</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span>Arts & Sciences</span>
                  </li>
                </ul>
              </div>
              <button className="mt-6 w-full rounded-md bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 text-sm font-medium">Apply Filters</button>
            </div>
          </aside>

          <div className="lg:col-span-3">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🗓️</span>
              <h2 className="text-xl font-semibold">Upcoming Events</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="h-40 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1470&auto=format&fit=crop')" }} />
                <div className="p-5">
                  <span className="inline-block text-xs px-3 py-1 rounded-full bg-brand-100 text-brand-700 font-semibold">Oct 15, 2025</span>
                  <h3 className="mt-3 text-lg font-semibold">Campus Meetup</h3>
                  <div className="mt-2 text-sm text-gray-600 space-y-1">
                    <div className="flex items-center gap-2"><span>📍</span><span>Auditorium A</span></div>
                    <div className="flex items-center gap-2"><span>⏰</span><span>10:00 AM - 1:00 PM</span></div>
                  </div>
                  <p className="mt-3 text-sm text-gray-600">A networking session for students to connect with clubs and organizers.</p>
                  <div className="mt-4 flex items-center gap-3">
                    <Link to="/events" className="inline-flex items-center rounded-md bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 text-sm font-medium">Register</Link>
                  </div>
                </div>
              </article>

              <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="h-40 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1515165562835-c3b8afee9a6a?q=80&w=1470&auto=format&fit=crop')" }} />
                <div className="p-5">
                  <span className="inline-block text-xs px-3 py-1 rounded-full bg-brand-100 text-brand-700 font-semibold">Oct 20, 2025</span>
                  <h3 className="mt-3 text-lg font-semibold">Cultural Night</h3>
                  <div className="mt-2 text-sm text-gray-600 space-y-1">
                    <div className="flex items-center gap-2"><span>📍</span><span>Main Grounds</span></div>
                    <div className="flex items-center gap-2"><span>⏰</span><span>6:00 PM - 9:00 PM</span></div>
                  </div>
                  <p className="mt-3 text-sm text-gray-600">An evening of performances and food celebrating diverse cultures.</p>
                  <div className="mt-4 flex items-center gap-3">
                    <Link to="/events" className="inline-flex items-center rounded-md bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 text-sm font-medium">Register</Link>
                  </div>
                </div>
              </article>

              <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="h-40 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1470&auto=format&fit=crop')" }} />
                <div className="p-5">
                  <span className="inline-block text-xs px-3 py-1 rounded-full bg-brand-100 text-brand-700 font-semibold">Nov 5, 2025</span>
                  <h3 className="mt-3 text-lg font-semibold">AI & ML Workshop</h3>
                  <div className="mt-2 text-sm text-gray-600 space-y-1">
                    <div className="flex items-center gap-2"><span>📍</span><span>Computer Lab 3B</span></div>
                    <div className="flex items-center gap-2"><span>⏰</span><span>1:00 PM - 5:00 PM</span></div>
                  </div>
                  <p className="mt-3 text-sm text-gray-600">Hands-on workshop covering fundamentals with practical examples.</p>
                  <div className="mt-4 flex items-center gap-3">
                    <Link to="/events" className="inline-flex items-center rounded-md bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 text-sm font-medium">Register</Link>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
