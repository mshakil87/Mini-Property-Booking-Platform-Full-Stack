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

    public function index(Property $property)
    {
        return $this->availabilities->forProperty($property->id);
    }

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

    public function destroy(Property $property, Availability $availability)
    {
        if ($availability->property_id !== $property->id) {
            return response()->json(['message' => 'Not found'], 404);
        }
        $this->availabilities->delete($availability);
        return response()->noContent();
    }
}

