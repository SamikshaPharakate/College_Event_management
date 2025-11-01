import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="py-20 text-center">
      <h2 className="text-3xl font-bold mb-2">404 - Not found</h2>
      <p className="text-gray-600 mb-6">The page you’re looking for doesn’t exist.</p>
      <div className="flex items-center justify-center gap-3">
        <Link to="/" className="inline-flex items-center rounded-md bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 font-medium shadow">Go Home</Link>
        <Link to="/signup" className="inline-flex items-center rounded-md bg-white text-brand-700 hover:bg-gray-100 px-5 py-2.5 font-medium shadow border border-gray-200">Sign Up</Link>
        <Link to="/signin" className="inline-flex items-center rounded-md bg-gray-800 hover:bg-gray-900 text-white px-5 py-2.5 font-medium shadow">Sign In</Link>
      </div>
    </div>
  )
}
