import { Route, Routes, Link, useNavigate } from 'react-router-dom'
import Listings from './pages/Listings'
import PropertyDetails from './pages/PropertyDetails'
import MyBookings from './pages/MyBookings'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import ForgotPassword from './pages/ForgotPassword'
import ChangePassword from './pages/ChangePassword'
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
          <nav className="space-x-4 flex items-center">
            <Link to="/" className="text-white/90 hover:text-white transition-colors">Listings</Link>
            <Link to="/bookings" className="text-white/90 hover:text-white transition-colors">My Bookings</Link>
            {!token ? (
              <>
                <Link to="/login" className="text-white hover:text-white/80 transition-colors">Login</Link>
                <Link to="/signup" className="text-white bg-white/20 px-3 py-1.5 rounded-lg hover:bg-white/30 transition-colors">Sign Up</Link>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/change-password" title="Change Password" className="text-white/90 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </Link>
                <button className="text-white/90 hover:text-white transition-colors" onClick={logout}>Logout</button>
              </div>
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
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/checkout/:id" element={<Checkout />} />
        </Routes>
      </main>
    </div>
  )
}
