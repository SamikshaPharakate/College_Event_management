import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="py-20 text-center">
      <h2 className="mb-2 text-3xl font-bold">404 - Not found</h2>
      <p className="mb-6 text-gray-600">The page you’re looking for doesn’t exist.</p>
      <div className="flex items-center justify-center gap-3">
        <Link to="/" className="inline-flex items-center rounded-md bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 font-medium shadow">Go Home</Link>
        <Link to="/signup" className="inline-flex items-center rounded-md bg-white text-indigo-700 hover:bg-gray-100 px-5 py-2.5 font-medium shadow border border-gray-200">Sign Up</Link>
        <Link to="/signin" className="inline-flex items-center rounded-md bg-gray-800 hover:bg-gray-900 text-white px-5 py-2.5 font-medium shadow">Sign In</Link>
      </div>
    </div>
  )
}
