import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'

type Property = {
  id: number
  title: string
  location: string | null
  price_per_night: string
  images?: string[]
  featured_image?: string
  is_featured?: boolean
}

export default function Listings() {
  const [items, setItems] = useState<Property[]>([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({ location: '', min_price: '', max_price: '', date: '' })
  const [page, setPage] = useState(1)
  const [meta, setMeta] = useState<any>(null)

  useEffect(() => {
    setLoading(true)
    api.get('/properties', { params: { ...filters, page, per_page: 10 } })
      .then(res => {
        const data = res.data.data ?? res.data
        // Sort properties to prioritize featured ones
        const sortedData = [...data].sort((a: Property, b: Property) => {
          if (a.is_featured && !b.is_featured) return -1;
          if (!a.is_featured && b.is_featured) return 1;
          return 0;
        });
        setItems(sortedData)
        setMeta(res.data)
      })
      .finally(() => setLoading(false))
  }, [filters, page])

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <input className="border p-2" placeholder="Location" value={filters.location}
               onChange={e => setFilters({ ...filters, location: e.target.value })} />
        <input className="border p-2" placeholder="Min price" value={filters.min_price}
               onChange={e => setFilters({ ...filters, min_price: e.target.value })} />
        <input className="border p-2" placeholder="Max price" value={filters.max_price}
               onChange={e => setFilters({ ...filters, max_price: e.target.value })} />
        <input type="date" className="border p-2" value={filters.date}
               onChange={e => setFilters({ ...filters, date: e.target.value })} />
      </div>

      {loading ? <p>Loading...</p> : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map(p => (
            <Link to={`/properties/${p.id}`} key={p.id} className="bg-white border rounded overflow-hidden">
              { (p.featured_image || (p.images && p.images[0])) && (
                <img src={p.featured_image || p.images?.[0]} alt={p.title} className="w-full h-40 object-cover" />
              )}
              <div className="p-4">
              <h3 className="font-semibold">{p.title}</h3>
              <p className="text-sm text-gray-500">{p.location ?? 'Location not available'}</p>
              <p className="text-sm mt-2">${p.price_per_night} per night</p>
              </div>
            </Link>
          ))}
        </div>
      )}
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
