<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Availability;
use App\Models\Property;
use App\Services\AvailabilityService;
use Illuminate\Http\Request;

class AvailabilityController extends Controller
{
    public function __construct(private AvailabilityService $availabilities)
    {
    }

    /**
     * @OA\Get(
     *     path="/api/properties/{property}/availability",
     *     summary="List availability for a property",
     *     tags={"Property Availability"},
     *     @OA\Parameter(
     *         name="property",
     *         in="path",
     *         description="Property ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(response=200, description="Successful operation"),
     *     @OA\Response(response=404, description="Property not found")
     * )
     */
    public function index(Property $property)
    {
        return $this->availabilities->forProperty($property->id);
    }

    /**
     * @OA\Post(
     *     path="/api/properties/{property}/availability",
     *     summary="Create availability for a property (Admin only)",
     *     tags={"Property Availability"},
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
     *             required={"start_date", "end_date"},
     *             @OA\Property(property="start_date", type="string", format="date", example="2025-12-25"),
     *             @OA\Property(property="end_date", type="string", format="date", example="2025-12-30")
     *         )
     *     ),
     *     @OA\Response(response=201, description="Availability created successfully"),
     *     @OA\Response(response=401, description="Unauthenticated"),
     *     @OA\Response(response=403, description="Forbidden"),
     *     @OA\Response(response=422, description="Validation error or overlapping range")
     * )
     */
    public function store(Request $request, Property $property)
    {
        $data = $request->validate([
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after:start_date'],
        ]);

        // Check for overlapping availability
        $overlapping = Availability::where('property_id', $property->id)
            ->where(function ($query) use ($data) {
                $query->where(function ($q) use ($data) {
                    $q->where('start_date', '<=', $data['start_date'])
                      ->where('end_date', '>=', $data['start_date']);
                })->orWhere(function ($q) use ($data) {
                    $q->where('start_date', '<=', $data['end_date'])
                      ->where('end_date', '>=', $data['end_date']);
                })->orWhere(function ($q) use ($data) {
                    $q->where('start_date', '>=', $data['start_date'])
                      ->where('end_date', '<=', $data['end_date']);
                });
            })->exists();

        if ($overlapping) {
            return response()->json(['message' => 'The selected availability range overlaps with an existing range.'], 422);
        }

        return response()->json(
            $this->availabilities->create([
                'property_id' => $property->id,
                'start_date' => $data['start_date'],
                'end_date' => $data['end_date'],
            ]),
            201
        );
    }

    /**
     * @OA\Delete(
     *     path="/api/properties/{property}/availability/{availability}",
     *     summary="Delete property availability (Admin only)",
     *     tags={"Property Availability"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="property",
     *         in="path",
     *         description="Property ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Parameter(
     *         name="availability",
     *         in="path",
     *         description="Availability ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(response=204, description="Availability deleted successfully"),
     *     @OA\Response(response=401, description="Unauthenticated"),
     *     @OA\Response(response=403, description="Forbidden"),
     *     @OA\Response(response=404, description="Availability or Property not found")
     * )
     */
    public function destroy(Property $property, Availability $availability)
    {
        if ($availability->property_id !== $property->id) {
            return response()->json(['message' => 'Not found'], 404);
        }
        $this->availabilities->delete($availability);
        return response()->noContent();
    }
}

