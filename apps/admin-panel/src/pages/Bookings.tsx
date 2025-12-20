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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Bookings Management</h2>
      <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4 mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search bookings..."
            className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
          />
        </div>
        <div className="w-full md:w-48">
          <select
            className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
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
      </div>
      <div className="space-y-4">
        {items.map(b => (
          <div key={b.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{b.property?.title}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  <span className="font-medium text-gray-700">{b.user?.email}</span>
                  <span className="mx-2">•</span>
                  <span>{formatDate(b.start_date)} - {formatDate(b.end_date)}</span>
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                  b.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                  b.status === 'rejected' ? 'bg-red-100 text-red-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {b.status}
                </span>
                
                {b.status === 'pending' && (
                  <>
                    <button 
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
                      onClick={() => action(b.id, 'confirm')}
                    >
                      Confirm
                    </button>
                    <button 
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
                      onClick={() => action(b.id, 'reject')}
                    >
                      Reject
                    </button>
                  </>
                )}
                
                <button 
                  className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
                  onClick={() => setOpenId(openId === b.id ? null : b.id)}
                >
                  {openId === b.id ? 'Hide Details' : 'View Details'}
                </button>
              </div>
            </div>
            {openId === b.id && (
              <div className="mt-6 pt-6 border-t border-gray-100 text-sm text-gray-700 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg"><span className="font-semibold block text-gray-500 mb-1">Property</span> {b.property?.title}</div>
                <div className="bg-gray-50 p-3 rounded-lg"><span className="font-semibold block text-gray-500 mb-1">Location</span> {b.property?.location}</div>
                <div className="bg-gray-50 p-3 rounded-lg"><span className="font-semibold block text-gray-500 mb-1">Price/Night</span> ${b.property?.price_per_night}</div>
                <div className="bg-gray-50 p-3 rounded-lg"><span className="font-semibold block text-gray-500 mb-1">Total Price</span> ${b.total_price}</div>
                <div className="bg-gray-50 p-3 rounded-lg"><span className="font-semibold block text-gray-500 mb-1">Guest</span> {b.user?.email}</div>
                <div className="bg-gray-50 p-3 rounded-lg"><span className="font-semibold block text-gray-500 mb-1">Booking ID</span> #{b.id}</div>
              </div>
            )}
          </div>
        ))}
      </div>
      {meta && (
        <div className="flex justify-center items-center space-x-4 mt-10">
          <button 
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            disabled={meta.current_page <= 1} 
            onClick={() => setPage(p => Math.max(1, p - 1))}
          >
            Previous
          </button>
          <span className="text-sm text-gray-600 font-medium">Page {meta.current_page} of {meta.last_page}</span>
          <button 
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            disabled={meta.current_page >= meta.last_page} 
            onClick={() => setPage(p => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
