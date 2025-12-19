import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, authHeader, getToken } from '../lib/api';

export default function AddProperty() {
  const navigate = useNavigate();
  const token = getToken();

  // State for the new property form
  const [newProperty, setNewProperty] = useState({
    title: '',
    description: '',
    price_per_night: '',
    location: '',
    latitude: '',
    longitude: '',
    city_id: '',
    images: [] as File[],
  });

  const [cities, setCities] = useState<any[]>([]);
  const [cityQuery, setCityQuery] = useState('');
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  useEffect(() => {
    if (cityQuery.length > 0) {
      api.get(`/cities?query=${cityQuery}`).then(res => setCities(res.data));
    } else {
      setCities([]);
    }
  }, [cityQuery]);

  const handleNewPropertyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewProperty(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewProperty(prev => ({
        ...prev,
        images: Array.from(e.target.files as FileList),
      }));
    }
  };

  const handleCitySelect = (city: any) => {
    setNewProperty(prev => ({ ...prev, location: city.name, city_id: city.id }));
    setCityQuery(city.name);
    setShowCityDropdown(false);
  };

  const createProperty = () => {
    if (!token) {
      navigate('/admin/login');
      return;
    }

    const formData = new FormData();
    formData.append('title', newProperty.title);
    formData.append('description', newProperty.description);
    formData.append('price_per_night', newProperty.price_per_night);
    formData.append('location', newProperty.location);
    formData.append('latitude', newProperty.latitude);
    formData.append('longitude', newProperty.longitude);
    formData.append('city_id', newProperty.city_id);
    newProperty.images.forEach((image, index) => {
      formData.append(`images[${index}]`, image);
    });

    api.post('/properties', formData, {
      headers: {
        ...authHeader(token),
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(() => {
        alert('Property created successfully!');
        navigate('/admin/properties');
      })
      .catch(err => {
        console.error('Error creating property:', err);
        alert('Failed to create property.');
      });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add New Property</h1>
      <form onSubmit={(e) => { e.preventDefault(); createProperty(); }} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            value={newProperty.title}
            onChange={handleNewPropertyChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={newProperty.description}
            onChange={handleNewPropertyChange}
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
            value={newProperty.price_per_night}
            onChange={handleNewPropertyChange}
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
                setNewProperty(prev => ({ ...prev, location: e.target.value, city_id: '' }));
              }}
              onFocus={() => setShowCityDropdown(true)}
              onBlur={() => setTimeout(() => setShowCityDropdown(false), 100)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
            {showCityDropdown && cities.length > 0 && ( // Only show if there are cities to display
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
            value={newProperty.latitude}
            onChange={handleNewPropertyChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Longitude</label>
          <input
            type="text"
            name="longitude"
            value={newProperty.longitude}
            onChange={handleNewPropertyChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Images</label>
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
          Add Property
        </button>
      </form>
    </div>
  );
}
