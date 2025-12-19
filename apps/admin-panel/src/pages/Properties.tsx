import { useEffect, useState } from 'react'
import { api, authHeader } from '../lib/api'
import { Link, useNavigate } from 'react-router-dom'

export default function Properties() {
  const navigate = useNavigate()
  const [items, setItems] = useState<any[]>([])
  const [token] = useState(localStorage.getItem('token') || undefined)
  const [page, setPage] = useState(1)
  const [meta, setMeta] = useState<any>(null)
  const [search, setSearch] = useState('')
  const [isFeatured, setIsFeatured] = useState(false)

  useEffect(() => {
    const params: any = { page, per_page: 10 }
    if (search) {
      params.search = search
    }
    if (isFeatured) {
      params.is_featured = true
    }
    api.get('/properties', { params }).then(res => {
      const data = res.data.data ?? res.data
      setItems(data)
      setMeta(res.data)
    })
  }, [page, search, isFeatured])

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Properties</h2>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Search properties..."
            className="border p-2 rounded"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
          />
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              className="form-checkbox"
              checked={isFeatured}
              onChange={(e) => {
                setIsFeatured(e.target.checked)
                setPage(1)
              }}
            />
            <span>Featured</span>
          </label>
          <button
            className="bg-indigo-600 text-white px-4 py-2 rounded"
            onClick={() => navigate('/properties/add')}
          >
            Add Property
          </button>
        </div>
      </div>
      <div className="space-y-3">
        {items.map(p => (
          <div key={p.id} className="bg-white border rounded p-4 flex justify-between">
            <div>
              <p className="font-semibold">{p.title}</p>
              <p className="text-sm text-gray-500">${p.price_per_night} • {p.location}</p>
              {p.is_featured && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">Featured</span>}
            </div>
            <div className="space-x-4">
              <button className="text-gray-700" onClick={() => navigate(`/properties/edit/${p.id}`)}>Edit</button>
              <Link to={`/properties/${p.id}/availability`} className="text-indigo-600">Manage Availability</Link>
              <Link to={`/properties/${p.id}/media`} className="text-indigo-600">Manage Media</Link>
            </div>
          </div>
        ))}
      </div>
      {meta && meta.last_page > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-6">
          <button className="px-3 py-1 border rounded" disabled={meta.current_page <= 1} onClick={() => setPage(1)}>First</button>
          <button className="px-3 py-1 border rounded" disabled={meta.current_page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Prev</button>
          {[...Array(meta.last_page)].map((_, i) => {
            const pageNumber = i + 1;
            // Only show a limited number of page links around the current page
            if (pageNumber === 1 || pageNumber === meta.last_page || (pageNumber >= meta.current_page - 2 && pageNumber <= meta.current_page + 2)) {
              return (
                <button
                  key={pageNumber}
                  className={`px-3 py-1 border rounded ${pageNumber === meta.current_page ? 'bg-indigo-600 text-white' : ''}`}
                  onClick={() => setPage(pageNumber)}
                >
                  {pageNumber}
                </button>
              );
            } else if (pageNumber === meta.current_page - 3 || pageNumber === meta.current_page + 3) {
              return <span key={pageNumber} className="px-3 py-1">...</span>;
            }
            return null;
          })}
          <button className="px-3 py-1 border rounded" disabled={meta.current_page >= meta.last_page} onClick={() => setPage(p => p + 1)}>Next</button>
          <button className="px-3 py-1 border rounded" disabled={meta.current_page >= meta.last_page} onClick={() => setPage(meta.last_page)}>Last</button>
        </div>
      )}
    </div>
  )
}
