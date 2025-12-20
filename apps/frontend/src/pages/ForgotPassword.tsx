import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState({ type: '', text: '' })
  const [loading, setLoading] = useState(false)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    setMessage({ type: '', text: '' })
    setLoading(true)

    api.post('/auth/forgot-password', { email })
      .then(res => {
        setMessage({ type: 'success', text: res.data.message })
      })
      .catch(err => {
        const text = err.response?.data?.message || 'Something went wrong. Please try again.'
        setMessage({ type: 'error', text })
      })
      .finally(() => setLoading(false))
  }

  return (
    <div className="max-w-md mx-auto bg-white border border-gray-100 rounded-2xl shadow-xl p-8 mt-10">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Reset Password</h2>
        <p className="text-gray-500 mt-2">Enter your email to receive a reset link</p>
      </div>
      
      <form onSubmit={submit} className="space-y-6">
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

        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Sending Link...' : 'Send Reset Link'}
        </button>

        {message.text && (
          <div className={`p-4 rounded-xl text-sm font-medium border ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-700 border-green-100' 
              : 'bg-red-50 text-red-700 border-red-100'
          }`}>
            {message.text}
          </div>
        )}

        <div className="text-center pt-4 border-t border-gray-100">
          <Link to="/login" className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors">
            Back to Login
          </Link>
        </div>
      </form>
    </div>
  )
}
