import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { api } from '../lib/api'

export default function Login() {
  const [email, setEmail] = useState('guest@example.com')
  const [password, setPassword] = useState('password')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const [params] = useSearchParams()

  function submit() {
    setError('')
    api.post('/auth/login', { email, password })
      .then(res => {
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('user', JSON.stringify(res.data.user))
        const redirect = params.get('redirect')
        navigate(redirect || '/')
      })
      .catch(() => setError('Invalid credentials'))
  }

  return (
    <div className="max-w-md mx-auto bg-white border rounded p-6">
      <h2 className="text-xl font-semibold mb-4">Login</h2>
      <input className="border p-2 w-full mb-2" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" className="border p-2 w-full mb-4" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button className="bg-indigo-600 text-white px-4 py-2 rounded w-full" onClick={submit}>Login</button>
      {error && <p className="text-red-600 mt-3">{error}</p>}
    </div>
  )
}
