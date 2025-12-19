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
      <h2 className="text-xl font-semibold mb-4">Media</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input type="file" className="border p-2" onChange={e => setFile(e.target.files?.[0] ?? null)} accept="image/*,video/*" />
        <input className="border p-2" placeholder="Caption" value={caption} onChange={e => setCaption(e.target.value)} />
        <button className="bg-indigo-600 text-white px-4 py-2 rounded" onClick={upload}>Upload</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((m: any) => (
          <div key={m.id} className="bg-white border rounded p-4">
            {m.type === 'image' ? (
              <img src={`/storage/${m.path}`} alt={m.caption ?? ''} className="w-full h-40 object-cover mb-2" />
            ) : (
              <video controls className="w-full h-40 mb-2">
                <source src={`/storage/${m.path}`} type={m.mime_type ?? 'video/mp4'} />
              </video>
            )}
            <div className="flex justify-between items-center">
              <span className="text-sm">{m.caption}</span>
              <button className="text-red-600" onClick={() => remove(m.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
