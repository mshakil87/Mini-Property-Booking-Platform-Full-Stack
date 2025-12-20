import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api, authHeader } from '../lib/api'

export default function Availability() {
  const { id } = useParams()
  const [items, setItems] = useState<any[]>([])
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [error, setError] = useState('')
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
    setError('')
    api.post(`/properties/${id}/availability`, { start_date: start, end_date: end }, { headers: authHeader(token) })
      .then(() => {
        setStart('')
        setEnd('')
        return api.get(`/properties/${id}/availability`, { headers: authHeader(token) }).then(res => setItems(res.data))
      })
      .catch(err => {
        setError(err.response?.data?.message || 'Failed to add availability range')
      })
  }

  function remove(availabilityId: number) {
    setError('')
    api.delete(`/properties/${id}/availability/${availabilityId}`, { headers: authHeader(token) })
      .then(() => api.get(`/properties/${id}/availability`, { headers: authHeader(token) }).then(res => setItems(res.data)))
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Manage Availability</h2>
      
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
        <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wider">Add New Range</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Start Date</label>
            <input 
              type="date" 
              className="w-full border border-gray-200 p-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" 
              value={start} 
              onChange={e => { setStart(e.target.value); setError(''); }} 
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">End Date</label>
            <input 
              type="date" 
              className="w-full border border-gray-200 p-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" 
              value={end} 
              onChange={e => { setEnd(e.target.value); setError(''); }} 
            />
          </div>
          <div className="flex items-end">
            <button 
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-bold transition-all shadow-md active:scale-95" 
              onClick={add}
            >
              Add Range
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-100 text-red-700 text-sm font-medium rounded-xl">
            {error}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider px-2">Current Available Dates</h3>
        {items.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 text-gray-500">
            No availability ranges added yet.
          </div>
        ) : (
          items.map((a: any) => (
            <div key={a.id} className="bg-white border border-gray-100 rounded-2xl p-4 flex justify-between items-center shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3">
                <div className="bg-indigo-50 p-2 rounded-lg">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-gray-800 font-semibold">{formatDate(a.start_date)} — {formatDate(a.end_date)}</span>
              </div>
              <button 
                className="text-red-600 hover:text-red-700 font-bold px-4 py-2 rounded-xl hover:bg-red-50 transition-all active:scale-95" 
                onClick={() => remove(a.id)}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
