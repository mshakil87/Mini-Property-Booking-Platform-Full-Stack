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
            className="border p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
          />
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-indigo-600 rounded"
              checked={isFeatured}
              onChange={(e) => {
                setIsFeatured(e.target.checked)
                setPage(1)
              }}
            />
            <span className="text-gray-700">Featured</span>
          </label>
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm active:scale-95"
            onClick={() => navigate('/properties/add')}
          >
            Add Property
          </button>
        </div>
      </div>
      <div className="space-y-3">
        {items.map(p => (
          <div key={p.id} className="bg-white border rounded-xl p-4 flex justify-between items-center shadow-sm hover:shadow-md transition-shadow">
            <div>
              <p className="font-semibold text-gray-800 text-lg">{p.title}</p>
              <p className="text-sm text-gray-500">${p.price_per_night} • {p.location}</p>
              {p.is_featured && <span className="inline-block mt-2 text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-medium">Featured</span>}
            </div>
            <div className="flex items-center space-x-3">
              <button 
                className="text-indigo-600 hover:text-indigo-700 font-medium px-3 py-1.5 rounded-md hover:bg-indigo-50 transition-colors"
                onClick={() => navigate(`/properties/edit/${p.id}`)}
              >
                Edit
              </button>
              <Link 
                to={`/properties/${p.id}/availability`} 
                className="text-indigo-600 hover:text-indigo-700 font-medium px-3 py-1.5 rounded-md hover:bg-indigo-50 transition-colors"
              >
                Availability
              </Link>
              <Link 
                to={`/properties/${p.id}/media`} 
                className="text-indigo-600 hover:text-indigo-700 font-medium px-3 py-1.5 rounded-md hover:bg-indigo-50 transition-colors"
              >
                Media
              </Link>
            </div>
          </div>
        ))}
      </div>
      {meta && meta.last_page > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-8">
          <button 
            className="px-3 py-1.5 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-gray-600" 
            disabled={meta.current_page <= 1} 
            onClick={() => setPage(1)}
          >
            First
          </button>
          <button 
            className="px-3 py-1.5 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-gray-600" 
            disabled={meta.current_page <= 1} 
            onClick={() => setPage(p => Math.max(1, p - 1))}
          >
            Prev
          </button>
          {[...Array(meta.last_page)].map((_, i) => {
            const pageNumber = i + 1;
            if (pageNumber === 1 || pageNumber === meta.last_page || (pageNumber >= meta.current_page - 2 && pageNumber <= meta.current_page + 2)) {
              return (
                <button
                  key={pageNumber}
                  className={`px-3 py-1.5 border rounded-lg font-medium transition-colors ${pageNumber === meta.current_page ? 'bg-indigo-600 text-white border-indigo-600' : 'hover:bg-gray-50 text-gray-600'}`}
                  onClick={() => setPage(pageNumber)}
                >
                  {pageNumber}
                </button>
              );
            } else if (pageNumber === meta.current_page - 3 || pageNumber === meta.current_page + 3) {
              return <span key={pageNumber} className="px-3 py-1.5 text-gray-400">...</span>;
            }
            return null;
          })}
          <button 
            className="px-3 py-1.5 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-gray-600" 
            disabled={meta.current_page >= meta.last_page} 
            onClick={() => setPage(p => Math.min(meta.last_page, p + 1))}
          >
            Next
          </button>
          <button 
            className="px-3 py-1.5 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-gray-600" 
            disabled={meta.current_page >= meta.last_page} 
            onClick={() => setPage(meta.last_page)}
          >
            Last
          </button>
        </div>
      )}
    </div>
  )
}
