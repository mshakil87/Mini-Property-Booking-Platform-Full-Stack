<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Property;
use App\Services\BookingService;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function __construct(private BookingService $bookings)
    {
    }

    public function index(Request $request)
    {
        $filters = [
            'search' => $request->query('search'),
            'status' => $request->query('status'),
        ];
        return app(\App\Repositories\BookingRepositoryInterface::class)->paginateAll(array_filter($filters, fn ($v) => $v !== null), 10);
    }

    public function myBookings(Request $request)
    {
        $user = $request->user();
        return app(\App\Repositories\BookingRepositoryInterface::class)->paginateForUser($user->id, 10);
    }

    public function store(Request $request)
    {
        $user = $request->user();
        $data = $request->validate([
            'property_id' => ['required', 'integer', 'exists:properties,id'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after:start_date'],
        ]);
        $property = Property::findOrFail($data['property_id']);

        try {
            $booking = $this->bookings->requestBooking(
                $user,
                $property,
                $data['start_date'],
                $data['end_date'],
                [
                    'guest_name' => $request->input('guest_name'),
                    'guest_email' => $request->input('guest_email'),
                    'guest_phone' => $request->input('guest_phone'),
                ]
            );
        } catch (\RuntimeException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }

        return response()->json($booking, 201);
    }

    public function confirm(Booking $booking)
    {
        return $this->bookings->confirm($booking);
    }

    public function reject(Booking $booking)
    {
        return $this->bookings->reject($booking);
    }
}
