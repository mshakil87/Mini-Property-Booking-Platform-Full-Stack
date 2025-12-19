import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api, authHeader, getToken } from '../lib/api';

export default function EditProperty() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = getToken();

  const [property, setProperty] = useState<any>(null);
  const [editProperty, setEditProperty] = useState({
    title: '',
    description: '',
    price_per_night: '',
    location: '',
    latitude: '',
    longitude: '',
    city_id: '',
    images: [] as File[],
    existing_images: [] as string[],
  });

  const [cities, setCities] = useState<any[]>([]);
  const [cityQuery, setCityQuery] = useState('');
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }
    api.get(`/properties/${id}`, { headers: authHeader(token) })
      .then(res => {
        const prop = res.data;
        setProperty(prop);
        setEditProperty({
          title: prop.title,
          description: prop.description,
          price_per_night: prop.price_per_night,
          location: prop.location,
          latitude: prop.latitude,
          longitude: prop.longitude,
          city_id: prop.city_id,
          images: [],
          existing_images: prop.images.map((img: any) => img.path),
        });
        setCityQuery(prop.location);
      })
      .catch(err => {
        console.error('Error fetching property:', err);
        alert('Failed to fetch property details.');
      });
  }, [id, token, navigate]);

  useEffect(() => {
    if (cityQuery.length > 0 && showCityDropdown) {
      api.get(`/cities?query=${cityQuery}`).then(res => setCities(res.data));
    } else {
      setCities([]);
    }
  }, [cityQuery, showCityDropdown]);

  const handleEditPropertyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditProperty(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setEditProperty(prev => ({
        ...prev,
        images: Array.from(e.target.files as FileList),
      }));
    }
  };

  const handleCitySelect = (city: any) => {
    setEditProperty(prev => ({ ...prev, location: city.name, city_id: city.id }));
    setCityQuery(city.name);
    setShowCityDropdown(false);
  };

  const updateProperty = () => {
    if (!token) {
      navigate('/admin/login');
      return;
    }

    const formData = new FormData();
    formData.append('_method', 'PUT'); // Laravel expects _method for PUT requests with FormData
    formData.append('title', editProperty.title);
    formData.append('description', editProperty.description);
    formData.append('price_per_night', editProperty.price_per_night);
    formData.append('location', editProperty.location);
    formData.append('latitude', editProperty.latitude);
    formData.append('longitude', editProperty.longitude);
    formData.append('city_id', editProperty.city_id);
    editProperty.images.forEach((image, index) => {
      formData.append(`images[${index}]`, image);
    });

    api.post(`/properties/${id}`, formData, {
      headers: {
        ...authHeader(token),
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(() => {
        alert('Property updated successfully!');
        navigate('/admin/properties');
      })
      .catch(err => {
        console.error('Error updating property:', err);
        alert('Failed to update property.');
      });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Property</h1>
      {property ? (
        <form onSubmit={(e) => { e.preventDefault(); updateProperty(); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={editProperty.title}
              onChange={handleEditPropertyChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={editProperty.description}
              onChange={handleEditPropertyChange}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Price per Night</label>
            <input
              type="number"
              name="price_per_night"
              value={editProperty.price_per_night}
              onChange={handleEditPropertyChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Location (City)</label>
            <div className="relative">
              <input
                type="text"
                name="location"
                value={cityQuery}
                onChange={(e) => {
                  setCityQuery(e.target.value);
                  setShowCityDropdown(true);
                  setEditProperty(prev => ({ ...prev, location: e.target.value, city_id: '' }));
                }}
                onFocus={() => setShowCityDropdown(true)}
                onBlur={() => setTimeout(() => setShowCityDropdown(false), 100)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                required
              />
              {showCityDropdown && cities.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                  {cities.map(city => (
                    <li
                      key={city.id}
                      onMouseDown={() => handleCitySelect(city)}
                      className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                    >
                      {city.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Latitude</label>
            <input
              type="text"
              name="latitude"
              value={editProperty.latitude}
              onChange={handleEditPropertyChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Longitude</label>
            <input
              type="text"
              name="longitude"
              value={editProperty.longitude}
              onChange={handleEditPropertyChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Existing Images</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {editProperty.existing_images.map((src, index) => (
                <img key={index} src={`/storage/${src}`} alt="Property" className="h-20 w-20 object-cover rounded" />
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">New Images (will replace existing)</label>
            <input
              type="file"
              name="images"
              onChange={handleImageChange}
              multiple
              className="mt-1 block w-full text-gray-700"
            />
          </div>
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Update Property
          </button>
        </form>
      ) : (
        <p>Loading property details...</p>
      )}
    </div>
  );
}
