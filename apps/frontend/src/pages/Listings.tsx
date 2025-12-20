import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { api } from '../lib/api'

type Property = {
  id: number
  title: string
  location: string | null
  price_per_night: string
  images?: string[]
  featured_image?: string
  is_featured?: boolean
  city?: {
    name: string
  }
}

export default function Listings() {
  const [items, setItems] = useState<Property[]>([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({ location: '', min_price: '', max_price: '', date: '' })
  const [page, setPage] = useState(1)
  const [meta, setMeta] = useState<any>(null)

  const hasFilters = filters.location || filters.min_price || filters.max_price || filters.date;

  const clearFilters = () => {
    setFilters({ location: '', min_price: '', max_price: '', date: '' });
    setPage(1);
  };

  useEffect(() => {
    // If location is provided but less than 3 characters, don't trigger search
    if (filters.location && filters.location.length > 0 && filters.location.length < 3) {
      return;
    }

    const controller = new AbortController();
    setLoading(true)
    
    api.get('/properties', { 
      params: { ...filters, page, per_page: 10 },
      signal: controller.signal
    })
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
      .catch(err => {
        if (axios.isCancel(err)) {
          // Silent catch for cancelled requests
        } else {
          console.error('Error fetching properties:', err)
        }
      })
      .finally(() => setLoading(false))

    return () => controller.abort();
  }, [filters, page])

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
          <input className="border p-2 rounded-lg" placeholder="Search by name or city..." value={filters.location}
                 onChange={e => setFilters({ ...filters, location: e.target.value })} />
          <input className="border p-2 rounded-lg" placeholder="Min price" value={filters.min_price}
                 onChange={e => setFilters({ ...filters, min_price: e.target.value })} />
          <input className="border p-2 rounded-lg" placeholder="Max price" value={filters.max_price}
                 onChange={e => setFilters({ ...filters, max_price: e.target.value })} />
          <input type="date" className="border p-2 rounded-lg" value={filters.date}
                 onChange={e => setFilters({ ...filters, date: e.target.value })} />
        </div>
        {hasFilters && (
          <button 
            onClick={clearFilters}
            className="ml-4 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors flex items-center space-x-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            <span>Clear</span>
          </button>
        )}
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
              <p className="text-sm text-gray-500">{p.city?.name ?? p.location ?? 'Location not available'}</p>
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
