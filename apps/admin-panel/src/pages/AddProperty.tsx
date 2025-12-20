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
      navigate('/');
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
        navigate('/properties');
      })
      .catch(err => {
        console.error('Error creating property:', err);
        alert('Failed to create property.');
      });
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Add New Property</h1>
      <form onSubmit={(e) => { e.preventDefault(); createProperty(); }} className="space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={newProperty.title}
              onChange={handleNewPropertyChange}
              className="block w-full rounded-xl border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              placeholder="Enter property title"
              required
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={newProperty.description}
              onChange={handleNewPropertyChange}
              rows={4}
              className="block w-full rounded-xl border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              placeholder="Describe the property..."
              required
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Price per Night ($)</label>
            <input
              type="number"
              name="price_per_night"
              value={newProperty.price_per_night}
              onChange={handleNewPropertyChange}
              className="block w-full rounded-xl border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Location (City)</label>
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
                className="block w-full rounded-xl border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                placeholder="Search city..."
                required
              />
              {showCityDropdown && cities.length > 0 && (
                <ul className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-auto py-1">
                  {cities.map(city => (
                    <li
                      key={city.id}
                      onMouseDown={() => handleCitySelect(city)}
                      className="px-4 py-2.5 cursor-pointer hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                    >
                      {city.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Latitude</label>
            <input
              type="text"
              name="latitude"
              value={newProperty.latitude}
              onChange={handleNewPropertyChange}
              className="block w-full rounded-xl border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              placeholder="e.g. 40.7128"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Longitude</label>
            <input
              type="text"
              name="longitude"
              value={newProperty.longitude}
              onChange={handleNewPropertyChange}
              className="block w-full rounded-xl border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              placeholder="e.g. -74.0060"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Images</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-indigo-400 transition-colors">
              <div className="space-y-1 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                    <span>Upload files</span>
                    <input
                      type="file"
                      name="images"
                      onChange={handleImageChange}
                      multiple
                      className="sr-only"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                {newProperty.images.length > 0 && (
                  <p className="text-sm font-medium text-indigo-600 mt-2">
                    {newProperty.images.length} file(s) selected
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-6">
          <button
            type="button"
            onClick={() => navigate('/properties')}
            className="mr-4 px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-8 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors shadow-md active:scale-95"
          >
            Create Property
          </button>
        </div>
      </form>
    </div>
  );
}
