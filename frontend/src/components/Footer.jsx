export default function Footer() {
  return (
    <footer className="mt-12 bg-gray-900 text-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 grid gap-8 md:grid-cols-4">
        <div>
          <h3 className="text-white text-lg font-semibold">UniEvents</h3>
          <p className="mt-3 text-gray-400">Your comprehensive platform for managing all college events, activities, and gatherings in one place.</p>
          <div className="flex gap-3 mt-4">
            <a className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 grid place-items-center" href="#" aria-label="Facebook">f</a>
            <a className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 grid place-items-center" href="#" aria-label="Twitter">t</a>
            <a className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 grid place-items-center" href="#" aria-label="Instagram">ig</a>
            <a className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 grid place-items-center" href="#" aria-label="LinkedIn">in</a>
          </div>
        </div>
        <div>
          <h3 className="text-white text-lg font-semibold">Quick Links</h3>
          <ul className="mt-3 space-y-2 text-gray-400">
            <li><a href="/">Home</a></li>
            <li><a href="/events">Events</a></li>
            <li><a href="/dashboard">My Events</a></li>
            <li><a href="#">Calendar</a></li>
            <li><a href="/events/new">Create Event</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white text-lg font-semibold">Support</h3>
          <ul className="mt-3 space-y-2 text-gray-400">
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">FAQs</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white text-lg font-semibold">Contact Info</h3>
          <ul className="mt-3 space-y-2 text-gray-400">
            <li>123 University Ave, Campus Town</li>
            <li>(555) 123-4567</li>
            <li>info@unievents.edu</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-6">
        <p className="text-center text-gray-500">© {new Date().getFullYear()} UniEvents. All rights reserved.</p>
      </div>
    </footer>
  )
}
