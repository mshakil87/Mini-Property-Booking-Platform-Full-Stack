import { useState } from 'react'
import { api } from '../lib/api'

export default function Login() {
  const [email, setEmail] = useState('admin@example.com')
  const [password, setPassword] = useState('password')
  const [message, setMessage] = useState('')

  function submit() {
    setMessage('')
    api.post('/auth/login', { email, password }).then(res => {
      localStorage.setItem('token', res.data.token)
      setMessage('Logged in')
    }).catch(() => setMessage('Invalid credentials'))
  }

  return (
    <div className="max-w-sm">
      <h2 className="text-xl font-semibold mb-4">Admin Login</h2>
      <input className="border p-2 w-full mb-2" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" className="border p-2 w-full mb-2" value={password} onChange={e => setPassword(e.target.value)} />
      <button className="bg-indigo-600 text-white px-4 py-2 rounded" onClick={submit}>Login</button>
      {message && <p className="mt-3">{message}</p>}
    </div>
  )
}
