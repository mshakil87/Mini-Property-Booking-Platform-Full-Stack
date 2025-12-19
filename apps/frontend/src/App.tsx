import { Route, Routes, Link, useNavigate } from 'react-router-dom'
import Listings from './pages/Listings'
import PropertyDetails from './pages/PropertyDetails'
import MyBookings from './pages/MyBookings'
import Login from './pages/Login'
import Checkout from './pages/Checkout'
import { getToken } from './lib/api'

export default function App() {
  const navigate = useNavigate()
  const token = getToken()
  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="container mx-auto px-4 py-4 flex justify-between">
          <Link to="/" className="font-semibold text-white">LivedIn</Link>
          <nav className="space-x-4">
            <Link to="/" className="text-white/90">Listings</Link>
            <Link to="/bookings" className="text-white/90">My Bookings</Link>
            {!token ? (
              <Link to="/login" className="text-white">Login</Link>
            ) : (
              <button className="text-white" onClick={logout}>Logout</button>
            )}
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Listings />} />
          <Route path="/properties/:id" element={<PropertyDetails />} />
          <Route path="/bookings" element={<MyBookings />} />
          <Route path="/login" element={<Login />} />
          <Route path="/checkout/:id" element={<Checkout />} />
        </Routes>
      </main>
    </div>
  )
}
