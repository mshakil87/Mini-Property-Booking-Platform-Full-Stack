import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../lib/api'

export default function SignUp() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (password !== passwordConfirmation) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    api.post('/auth/register', { 
      name, 
      email, 
      password, 
      password_confirmation: passwordConfirmation 
    })
      .then(res => {
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('user', JSON.stringify(res.data.user))
        navigate('/')
      })
      .catch(err => {
        const message = err.response?.data?.message || 'Registration failed. Please check your details.'
        setError(message)
      })
      .finally(() => setLoading(false))
  }

  return (
    <div className="max-w-md mx-auto bg-white border border-gray-100 rounded-2xl shadow-xl p-8 mt-10">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
        <p className="text-gray-500 mt-2">Join LivedIn to book your next stay</p>
      </div>
      
      <form onSubmit={submit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
          <input 
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" 
            placeholder="John Doe" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            required 
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
          <input 
            type="email"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" 
            placeholder="john@example.com" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
          <input 
            type="password" 
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" 
            placeholder="••••••••" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
            minLength={8}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password</label>
          <input 
            type="password" 
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" 
            placeholder="••••••••" 
            value={passwordConfirmation} 
            onChange={e => setPasswordConfirmation(e.target.value)} 
            required 
          />
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm font-medium border border-red-100">
            {error}
          </div>
        )}

        <div className="text-center pt-4 border-t border-gray-100">
          <p className="text-gray-600">
            Already have an account? {' '}
            <Link to="/login" className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors">
              Log In
            </Link>
          </p>
        </div>
      </form>
    </div>
  )
}
