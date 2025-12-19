import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, authHeader, getToken } from '../lib/api'

export default function MyBookings() {
  const [items, setItems] = useState<any[]>([])
  const [token] = useState<string | undefined>(getToken())
  const [page, setPage] = useState(1)
  const [meta, setMeta] = useState<any>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!token) {
      navigate('/login?redirect=/bookings')
      return
    }
    api.get('/bookings/me', { headers: authHeader(token), params: { page } }).then(res => {
      const data = res.data.data ?? res.data
      setItems(data)
      setMeta(res.data.meta ?? null)
    })
  }, [token, page])

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">My Bookings</h2>
      <div className="space-y-3">
        {items.map(b => (
          <div key={b.id} className="bg-white border rounded p-4">
            <div className="flex justify-between">
              <div>
                <p className="font-semibold">{b.property?.title}</p>
                <p className="text-sm text-gray-500">{b.start_date} - {b.end_date}</p>
              </div>
              <span className="text-sm">{b.status}</span>
            </div>
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
