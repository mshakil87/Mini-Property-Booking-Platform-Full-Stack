import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api, authHeader, getToken } from '../lib/api';

export default function Checkout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState<any>(null);
  const [token] = useState<string | undefined>(getToken());
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate(`/login?redirect=/checkout/${id}`);
      return;
    }
    api.get(`/properties/${id}`).then(res => setProperty(res.data));
  }, [id, navigate, token]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    api.post('/bookings', {
      property_id: Number(id),
      start_date: start,
      end_date: end,
      guest_name: guestName,
      guest_email: guestEmail,
    }, { headers: authHeader(token) })
      .then(() => {
        setMessage('Booking successful!');
        // Optionally navigate to a confirmation page or property details
        navigate(`/properties/${id}?bookingSuccess=true`);
      })
      .catch(err => {
        setMessage(err.response?.data?.message ?? 'Error requesting booking.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (!property) {
    return <div>Loading property details...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Checkout for {property.title}</h2>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="guestName">
            Your Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="guestName"
            type="text"
            placeholder="Full Name"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="guestEmail">
            Your Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="guestEmail"
            type="email"
            placeholder="Email Address"
            value={guestEmail}
            onChange={(e) => setGuestEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="startDate">
            Start Date
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="startDate"
            type="date"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="endDate">
            End Date
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="endDate"
            type="date"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Booking...' : 'Confirm Booking'}
          </button>
        </div>
        {message && <p className="mt-4 text-sm text-red-500">{message}</p>}
      </form>
    </div>
  );
}
