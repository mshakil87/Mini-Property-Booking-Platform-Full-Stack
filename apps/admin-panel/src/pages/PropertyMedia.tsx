import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api, authHeader } from '../lib/api'

export default function PropertyMedia() {
  const { id } = useParams()
  const [items, setItems] = useState<any[]>([])
  const [caption, setCaption] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [token] = useState(localStorage.getItem('token') || undefined)

  useEffect(() => {
    api.get(`/properties/${id}/media`).then(res => setItems(res.data))
  }, [id])

  function upload() {
    if (!file) return
    const form = new FormData()
    form.append('file', file)
    if (caption) form.append('caption', caption)
    api.post(`/properties/${id}/media`, form, {
      headers: { ...authHeader(token), 'Content-Type': 'multipart/form-data' }
    }).then(() => api.get(`/properties/${id}/media`).then(res => setItems(res.data)))
      .finally(() => {
        setFile(null)
        setCaption('')
      })
  }

  function remove(mediaId: number) {
    api.delete(`/properties/${id}/media/${mediaId}`, { headers: authHeader(token) })
      .then(() => api.get(`/properties/${id}/media`).then(res => setItems(res.data)))
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Property Media</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">File</label>
          <input 
            type="file" 
            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
            onChange={e => setFile(e.target.files?.[0] ?? null)} 
            accept="image/*,video/*" 
          />
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Caption (Optional)</label>
          <input 
            className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
            placeholder="Enter image caption..." 
            value={caption} 
            onChange={e => setCaption(e.target.value)} 
          />
        </div>
        <div className="flex items-end">
          <button 
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed" 
            onClick={upload}
            disabled={!file}
          >
            Upload Media
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((m: any) => (
          <div key={m.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="relative group">
              {m.type === 'image' ? (
                <img src={`/storage/${m.path}`} alt={m.caption ?? ''} className="w-full h-48 object-cover" />
              ) : (
                <video controls className="w-full h-48">
                  <source src={`/storage/${m.path}`} type={m.mime_type ?? 'video/mp4'} />
                </video>
              )}
            </div>
            <div className="p-4 flex justify-between items-center bg-gray-50 border-t border-gray-100">
              <span className="text-sm font-medium text-gray-700 truncate mr-4">{m.caption || 'No caption'}</span>
              <button 
                className="text-red-600 hover:text-red-700 font-medium px-3 py-1.5 rounded-md hover:bg-red-50 transition-colors text-sm" 
                onClick={() => remove(m.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
