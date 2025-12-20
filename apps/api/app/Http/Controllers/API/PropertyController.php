<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Property;
use App\Services\PropertyService;
use Illuminate\Http\Request;

class PropertyController extends Controller
{
    public function __construct(private PropertyService $properties)
    {
    }

    public function index(Request $request)
    {
        $filters = [
            'location' => $request->query('location'),
            'min_price' => $request->query('min_price'),
            'max_price' => $request->query('max_price'),
            'date' => $request->query('date'),
            'search' => $request->query('search'),
            'is_featured' => $request->query('is_featured'),
        ];
        return $this->properties->list(array_filter($filters, fn ($v) => $v !== null));
    }

    public function show(Property $property)
    {
        $property->load(['availabilities', 'bookings', 'media', 'city']);
        return $property;
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'price_per_night' => ['required', 'numeric', 'min:0'],
            'location' => ['nullable', 'string', 'max:255'],
            'city_id' => ['required', 'exists:cities,id'],
            'is_featured' => ['sometimes', 'boolean'],
            'amenities' => ['array'],
            'images' => ['array'],
        ]);
        return response()->json($this->properties->create($data), 201);
    }

    public function update(Request $request, Property $property)
    {
        $data = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'price_per_night' => ['sometimes', 'numeric', 'min:0'],
            'location' => ['nullable', 'string', 'max:255'],
            'city_id' => ['sometimes', 'exists:cities,id'],
            'is_featured' => ['sometimes', 'boolean'],
            'amenities' => ['array'],
            'images' => ['array'],
        ]);
        return $this->properties->update($property, $data);
    }

    public function destroy(Property $property)
    {
        $this->properties->delete($property);
        return response()->noContent();
    }
}
