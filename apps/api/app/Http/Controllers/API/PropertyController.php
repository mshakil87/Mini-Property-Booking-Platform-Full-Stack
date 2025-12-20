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

    /**
     * @OA\Get(
     *     path="/api/properties",
     *     summary="Get all properties",
     *     tags={"Properties"},
     *     @OA\Parameter(name="location", in="query", @OA\Schema(type="string")),
     *     @OA\Parameter(name="min_price", in="query", @OA\Schema(type="number")),
     *     @OA\Parameter(name="max_price", in="query", @OA\Schema(type="number")),
     *     @OA\Parameter(name="search", in="query", @OA\Schema(type="string")),
     *     @OA\Response(response=200, description="List of properties")
     * )
     */
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

    /**
     * @OA\Get(
     *     path="/api/properties/{id}",
     *     summary="Get property details",
     *     tags={"Properties"},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Property details"),
     *     @OA\Response(response=404, description="Property not found")
     * )
     */
    public function show(Property $property)
    {
        $property->load(['availabilities', 'bookings', 'media', 'city']);
        return $property;
    }

    /**
     * @OA\Post(
     *     path="/api/properties",
     *     summary="Create a new property (Admin only)",
     *     tags={"Properties"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"title", "price_per_night", "city_id"},
     *             @OA\Property(property="title", type="string", example="Luxury Villa"),
     *             @OA\Property(property="description", type="string", example="A beautiful villa with sea view"),
     *             @OA\Property(property="price_per_night", type="number", example=150.00),
     *             @OA\Property(property="location", type="string", example="Beach Road 123"),
     *             @OA\Property(property="city_id", type="integer", example=1),
     *             @OA\Property(property="is_featured", type="boolean", example=true),
     *             @OA\Property(property="amenities", type="array", @OA\Items(type="string"), example={"WiFi", "Pool"}),
     *             @OA\Property(property="images", type="array", @OA\Items(type="string", format="binary"))
     *         )
     *     ),
     *     @OA\Response(response=201, description="Property created successfully"),
     *     @OA\Response(response=401, description="Unauthenticated"),
     *     @OA\Response(response=403, description="Forbidden"),
     *     @OA\Response(response=422, description="Validation error")
     * )
     */
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

    /**
     * @OA\Put(
     *     path="/api/properties/{property}",
     *     summary="Update an existing property (Admin only)",
     *     tags={"Properties"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="property",
     *         in="path",
     *         description="Property ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="title", type="string", example="Luxury Villa Updated"),
     *             @OA\Property(property="description", type="string", example="An updated description"),
     *             @OA\Property(property="price_per_night", type="number", example=200.00),
     *             @OA\Property(property="location", type="string", example="Beach Road 124"),
     *             @OA\Property(property="city_id", type="integer", example=1),
     *             @OA\Property(property="is_featured", type="boolean", example=false),
     *             @OA\Property(property="amenities", type="array", @OA\Items(type="string"), example={"WiFi", "Pool", "Gym"}),
     *             @OA\Property(property="images", type="array", @OA\Items(type="string", format="binary"))
     *         )
     *     ),
     *     @OA\Response(response=200, description="Property updated successfully"),
     *     @OA\Response(response=401, description="Unauthenticated"),
     *     @OA\Response(response=403, description="Forbidden"),
     *     @OA\Response(response=404, description="Property not found"),
     *     @OA\Response(response=422, description="Validation error")
     * )
     */
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

    /**
     * @OA\Delete(
     *     path="/api/properties/{property}",
     *     summary="Delete a property (Admin only)",
     *     tags={"Properties"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="property",
     *         in="path",
     *         description="Property ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(response=204, description="Property deleted successfully"),
     *     @OA\Response(response=401, description="Unauthenticated"),
     *     @OA\Response(response=403, description="Forbidden"),
     *     @OA\Response(response=404, description="Property not found")
     * )
     */
    public function destroy(Property $property)
    {
        $this->properties->delete($property);
        return response()->noContent();
    }
}
