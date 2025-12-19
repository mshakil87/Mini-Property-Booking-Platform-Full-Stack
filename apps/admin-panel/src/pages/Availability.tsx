import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api, authHeader } from '../lib/api'

export default function Availability() {
  const { id } = useParams()
  const [items, setItems] = useState<any[]>([])
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [token] = useState(localStorage.getItem('token') || undefined)

  useEffect(() => {
    api.get(`/properties/${id}/availability`, { headers: authHeader(token) }).then(res => setItems(res.data))
  }, [id, token])

  function add() {
    api.post(`/properties/${id}/availability`, { start_date: start, end_date: end }, { headers: authHeader(token) })
      .then(() => api.get(`/properties/${id}/availability`, { headers: authHeader(token) }).then(res => setItems(res.data)))
  }

  function remove(availabilityId: number) {
    api.delete(`/properties/${id}/availability/${availabilityId}`, { headers: authHeader(token) })
      .then(() => api.get(`/properties/${id}/availability`, { headers: authHeader(token) }).then(res => setItems(res.data)))
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Availability</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input type="date" className="border p-2" value={start} onChange={e => setStart(e.target.value)} />
        <input type="date" className="border p-2" value={end} onChange={e => setEnd(e.target.value)} />
        <button className="bg-indigo-600 text-white px-4 py-2 rounded" onClick={add}>Add Range</button>
      </div>
      <div className="space-y-3">
        {items.map((a: any) => (
          <div key={a.id} className="bg-white border rounded p-4 flex justify-between">
            <span>{a.start_date} - {a.end_date}</span>
            <button className="text-red-600" onClick={() => remove(a.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}
