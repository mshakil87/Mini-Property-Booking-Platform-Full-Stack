import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api, authHeader, getToken } from '../lib/api'
import { Carousel } from 'flowbite-react';

export default function PropertyDetails() {
  const { id } = useParams()
  const [property, setProperty] = useState<any>(null)
  const [token] = useState<string | undefined>(getToken())
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()
  const [lightbox, setLightbox] = useState<string | null>(null)

  useEffect(() => {
    api.get(`/properties/${id}`).then(res => setProperty(res.data))
  }, [id])

  const bookedDates = useMemo(() => {
    return (property?.bookings ?? []).flatMap((b: any) => {
      const s = new Date(b.start_date)
      const e = new Date(b.end_date)
      const dates: string[] = []
      for (let d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) {
        dates.push(d.toISOString().slice(0, 10))
      }
      return dates
    })
  }, [property])

  const propertyImages = useMemo(() => {
    const images: string[] = [];
    (property?.images ?? []).forEach((src: string) => images.push(src));
    (property?.media ?? []).forEach((m: any) => {
      if (m.type === 'image') {
        images.push(`/storage/${m.path}`);
      }
    });
    return images;
  }, [property]);

  console.log('Property Images:', propertyImages);

  function submit() {
    setMessage('')
    if (!token) {
      navigate(`/login?redirect=/properties/${id}`)
      return
    }
    api.post('/bookings', {
      property_id: Number(id),
      start_date: start,
      end_date: end,
    }, { headers: authHeader(token) })
      .then(() => setMessage('Booking requested'))
      .catch(err => setMessage(err.response?.data?.message ?? 'Error'))
  }

  return (
    <div>
      <h2 className="text-xl font-semibold">{property?.title}</h2>
      <p className="text-gray-500">{property?.location}</p>
      <p className="mt-2">${property?.price_per_night} per night</p>

      {propertyImages.length > 0 && (
        <div className="h-56 sm:h-64 xl:h-80 2xl:h-96 mt-4">
          <Carousel slideInterval={5000} onSlideChange={(index) => console.log('onSlideChange()', index)}>
            {propertyImages.map((src: string, idx: number) => (
              <img
                key={idx}
                src={src}
                alt={property?.title ?? ''}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => setLightbox(src)}
                onError={(e) => console.error('Image failed to load:', src, e)}
              />
            ))}
          </Carousel>
        </div>
      )}

      {property?.latitude && property?.longitude && (
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Location</h3>
          <iframe
            className="w-full h-64 border rounded"
            src={`https://www.google.com/maps?q=${property.latitude},${property.longitude}&z=14&output=embed`}
            loading="lazy"
          />
        </div>
      )}

      {lightbox && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setLightbox(null)}>
          <img src={lightbox} alt="" className="max-w-4xl max-h-[80vh] rounded" />
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm mb-1">Start date</label>
          <input type="date" className="border p-2 w-full" value={start}
                 onChange={e => setStart(e.target.value)}
                 disabled={bookedDates.includes(start)} />
        </div>
        <div>
          <label className="block text-sm mb-1">End date</label>
          <input type="date" className="border p-2 w-full" value={end}
                 onChange={e => setEnd(e.target.value)}
                 disabled={bookedDates.includes(end)} />
        </div>
        <div className="flex items-end">
          <button className="bg-indigo-600 text-white px-4 py-2 rounded" onClick={() => navigate(`/checkout/${id}`)}>Proceed to Checkout</button>
        </div>
      </div>

      {message && <p className="mt-4">{message}</p>}
    </div>
  )
}
