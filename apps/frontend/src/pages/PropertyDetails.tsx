import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { api, authHeader, getToken } from '../lib/api'
import { initFlowbite } from 'flowbite';
import ImageSlider from '../components/ImageSlider';

export default function PropertyDetails() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const [property, setProperty] = useState<any>(null)
  const [token] = useState<string | undefined>(getToken())
  const navigate = useNavigate()

  const bookingSuccess = searchParams.get('bookingSuccess') === 'true'

  useEffect(() => {
    initFlowbite();
    api.get(`/properties/${id}`).then(res => setProperty(res.data))
  }, [id])



  const propertyImages = useMemo(() => {
    const images: string[] = [];
    (property?.images ?? []).forEach((src: string) => {
      if (src) images.push(src);
    });
    (property?.media ?? []).forEach((m: any) => {
      if (m.type === 'image' && m.path) {
        images.push(`${api.defaults.baseURL!.replace('/api', '')}/storage/${m.path}`);
      }
    });
    return images;
  }, [property]);

  console.log('Property Images:', propertyImages);




  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {bookingSuccess && (
        <div className="mb-6 p-4 bg-green-100 border border-green-200 text-green-700 rounded-xl flex items-center shadow-sm">
          <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          <span className="font-semibold">Booking successful! We've received your request.</span>
        </div>
      )}
      <h2 className="text-2xl font-bold text-gray-900">{property?.title}</h2>
      <p className="text-gray-600 mb-4">{property?.location}</p>
      
      <div className="mb-6">
        <ImageSlider images={propertyImages} altText={property?.title} />
      </div>

      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div>
          <p className="text-2xl font-bold text-indigo-600">${property?.price_per_night}</p>
          <p className="text-sm text-gray-500">per night</p>
        </div>
        <button 
          onClick={() => navigate(`/checkout/${id}`)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors shadow-md active:scale-95"
        >
          Book Now
        </button>
      </div>

      {property?.description && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-2">About this place</h3>
          <p className="text-gray-700 leading-relaxed">{property.description}</p>
        </div>
      )}

      {property?.latitude && property?.longitude && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Where you'll be</h3>
          <div className="overflow-hidden rounded-xl border border-gray-200">
            <iframe
              className="w-full h-72"
              src={`https://www.google.com/maps?q=${property.latitude},${property.longitude}&z=14&output=embed`}
              loading="lazy"
              title="Property location map"
            />
          </div>
        </div>
      )}
    </div>
  )
}
