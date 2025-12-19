import { useEffect, useState } from 'react'
import { api, authHeader } from '../lib/api'

export default function Bookings() {
  const [items, setItems] = useState<any[]>([])
  const [token] = useState(localStorage.getItem('token') || undefined)
  const [page, setPage] = useState(1)
  const [meta, setMeta] = useState<any>(null)
  const [openId, setOpenId] = useState<number | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    const params: any = { page }
    if (search) {
      params.search = search
    }
    if (statusFilter !== 'all') {
      params.status = statusFilter
    }
    api.get('/bookings', { headers: authHeader(token), params })
      .then(res => {
        const data = res.data.data ?? res.data
        setItems(data)
        setMeta(res.data.meta ?? null)
      })
  }, [token, page, search, statusFilter])

  function action(id: number, type: 'confirm'|'reject') {
    api.post(`/bookings/${id}/${type}`, {}, { headers: authHeader(token) })
      .then(() => api.get('/bookings', { headers: authHeader(token), params: { page, search, status: statusFilter !== 'all' ? statusFilter : undefined } }).then(res => setItems(res.data.data ?? res.data)))
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Bookings</h2>
      <div className="flex space-x-4 mb-4">
        <input
          type="text"
          placeholder="Search bookings..."
          className="border p-2 rounded"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
        />
        <select
          className="border p-2 rounded"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value)
            setPage(1)
          }}
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      <div className="space-y-3">
        {items.map(b => (
          <div key={b.id} className="bg-white border rounded p-4">
            <div className="flex justify-between">
              <div>
                <p className="font-semibold">{b.property?.title}</p>
                <p className="text-sm text-gray-500">{b.user?.email} • {b.start_date} - {b.end_date}</p>
              </div>
              <div className="space-x-2">
                <span className="mr-4">{b.status}</span>
                <button className="text-green-600" onClick={() => action(b.id, 'confirm')}>Confirm</button>
                <button className="text-red-600" onClick={() => action(b.id, 'reject')}>Reject</button>
                <button className="text-indigo-600" onClick={() => setOpenId(openId === b.id ? null : b.id)}>View Details</button>
              </div>
            </div>
            {openId === b.id && (
              <div className="mt-3 text-sm text-gray-700 grid grid-cols-1 md:grid-cols-3 gap-2">
                <div>Property: {b.property?.title}</div>
                <div>Location: {b.property?.location}</div>
                <div>Price/Night: ${b.property?.price_per_night}</div>
                <div>Total Price: ${b.total_price}</div>
                <div>Status: {b.status}</div>
                <div>Guest: {b.user?.email}</div>
                <div>Booking ID: {b.id}</div>
              </div>
            )}
          </div>
        ))}
      </div>
      {meta && (
        <div className="flex justify-center items-center space-x-4 mt-6">
          <button className="px-3 py-1 border rounded" disabled={meta.current_page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Prev</button>
          <span>Page {meta.current_page} / {meta.last_page}</span>
          <button className="px-3 py-1 border rounded" disabled={meta.current_page >= meta.last_page} onClick={() => setPage(p => p + 1)}>Next</button>
        </div>
      )}
    </div>
  )
}
