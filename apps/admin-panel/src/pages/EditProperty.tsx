import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api, authHeader, getToken } from '../lib/api';
import { AxiosError } from 'axios';

interface ErrorResponse {
  message: string;
}

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
      navigate('/');
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
          location: prop.city.name, // Use city name for location
          latitude: prop.latitude,
          longitude: prop.longitude,
          city_id: prop.city.id, // Use city ID
          images: [],
          existing_images: prop.images.map((img: any) => img.path),
        });
        setCityQuery(prop.city.name); // Initialize cityQuery with city name
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
      navigate('/');
      return;
    }

    const formData = new FormData();
    formData.append('_method', 'PUT'); // For Laravel or similar backends to handle PUT with FormData
    formData.append('title', editProperty.title);
    formData.append('description', editProperty.description);
    formData.append('price_per_night', editProperty.price_per_night);
    formData.append('city_id', editProperty.city_id);
    formData.append('latitude', editProperty.latitude);
    formData.append('longitude', editProperty.longitude);

    if (editProperty.images.length > 0) {
      // If new images are selected, send them
      editProperty.images.forEach((image, index) => {
        formData.append(`images[${index}]`, image);
      });
    } else {
      // If no new images are selected, send existing image paths to keep them
      editProperty.existing_images.forEach((imagePath, index) => {
        formData.append(`existing_images[${index}]`, imagePath);
      });
    }

    api.post(`/properties/${id}`, formData, {
      headers: {
        ...authHeader(token),
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(() => {
        alert('Property updated successfully!');
        navigate('/properties');
      })
      .catch((err: AxiosError) => {
        console.error('Error updating property:', err);
        const errorMessage = (err.response?.data as ErrorResponse)?.message || 'Failed to update property.';
        alert(errorMessage);
      });
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Edit Property</h1>
      {property ? (
        <form onSubmit={(e) => { e.preventDefault(); updateProperty(); }} className="space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={editProperty.title}
                onChange={handleEditPropertyChange}
                className="block w-full rounded-xl border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                placeholder="Enter property title"
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={editProperty.description}
                onChange={handleEditPropertyChange}
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
                value={editProperty.price_per_night}
                onChange={handleEditPropertyChange}
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
                    setEditProperty(prev => ({ ...prev, location: e.target.value, city_id: '' }));
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
                value={editProperty.latitude}
                onChange={handleEditPropertyChange}
                className="block w-full rounded-xl border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                placeholder="e.g. 40.7128"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Longitude</label>
              <input
                type="text"
                name="longitude"
                value={editProperty.longitude}
                onChange={handleEditPropertyChange}
                className="block w-full rounded-xl border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                placeholder="e.g. -74.0060"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Existing Images</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                {editProperty.existing_images.map((src, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-300 shadow-sm">
                    <img src={`/storage/${src}`} alt="Property" className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">New Images (Optional)</label>
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
                  <p className="text-xs text-gray-500 text-center">New images will replace existing ones</p>
                  {editProperty.images.length > 0 && (
                    <p className="text-sm font-medium text-indigo-600 mt-2">
                      {editProperty.images.length} file(s) selected
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
              Update Property
            </button>
          </div>
        </form>
      ) : (
        <div className="flex items-center justify-center h-64 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <span className="ml-4 text-gray-600 font-medium">Loading property details...</span>
        </div>
      )}
    </div>
  );
}
