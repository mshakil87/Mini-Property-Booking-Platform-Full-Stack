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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

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
        <input type="date" className="border p-2 rounded-lg" value={start} onChange={e => setStart(e.target.value)} />
        <input type="date" className="border p-2 rounded-lg" value={end} onChange={e => setEnd(e.target.value)} />
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm" onClick={add}>Add Range</button>
      </div>
      <div className="space-y-3">
        {items.map((a: any) => (
          <div key={a.id} className="bg-white border rounded-xl p-4 flex justify-between items-center shadow-sm">
            <span className="text-gray-700 font-medium">{formatDate(a.start_date)} - {formatDate(a.end_date)}</span>
            <button className="text-red-600 hover:text-red-700 font-medium px-3 py-1 rounded-md hover:bg-red-50 transition-colors" onClick={() => remove(a.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}
