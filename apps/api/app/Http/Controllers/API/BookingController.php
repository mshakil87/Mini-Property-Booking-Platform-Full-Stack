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

    /**
     * @OA\Get(
     *     path="/api/bookings",
     *     summary="List all bookings (Admin only)",
     *     tags={"Bookings"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="search",
     *         in="query",
     *         description="Search by property title or user email",
     *         required=false,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Parameter(
     *         name="status",
     *         in="query",
     *         description="Filter by status (pending, confirmed, rejected)",
     *         required=false,
     *         @OA\Schema(type="string", enum={"pending", "confirmed", "rejected"})
     *     ),
     *     @OA\Response(response=200, description="Successful operation"),
     *     @OA\Response(response=401, description="Unauthenticated"),
     *     @OA\Response(response=403, description="Forbidden")
     * )
     */
    public function index(Request $request)
    {
        $filters = [
            'search' => $request->query('search'),
            'status' => $request->query('status'),
        ];
        return app(\App\Repositories\BookingRepositoryInterface::class)->paginateAll(array_filter($filters, fn ($v) => $v !== null), 10);
    }

    /**
     * @OA\Get(
     *     path="/api/bookings/me",
     *     summary="List authenticated user's bookings",
     *     tags={"Bookings"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(response=200, description="Successful operation"),
     *     @OA\Response(response=401, description="Unauthenticated")
     * )
     */
    public function myBookings(Request $request)
    {
        $user = $request->user();
        return app(\App\Repositories\BookingRepositoryInterface::class)->paginateForUser($user->id, 10);
    }

    /**
     * @OA\Post(
     *     path="/api/bookings",
     *     summary="Create a new booking request",
     *     tags={"Bookings"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"property_id", "start_date", "end_date"},
     *             @OA\Property(property="property_id", type="integer", example=1),
     *             @OA\Property(property="start_date", type="string", format="date", example="2025-12-25"),
     *             @OA\Property(property="end_date", type="string", format="date", example="2025-12-30"),
     *             @OA\Property(property="guest_name", type="string", example="John Doe"),
     *             @OA\Property(property="guest_email", type="string", format="email", example="john@example.com"),
     *             @OA\Property(property="guest_phone", type="string", example="+1234567890")
     *         )
     *     ),
     *     @OA\Response(response=201, description="Booking requested successfully"),
     *     @OA\Response(response=401, description="Unauthenticated"),
     *     @OA\Response(response=422, description="Validation error or dates unavailable")
     * )
     */
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

    /**
     * @OA\Post(
     *     path="/api/bookings/{booking}/confirm",
     *     summary="Confirm a booking request (Admin only)",
     *     tags={"Bookings"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="booking",
     *         in="path",
     *         description="Booking ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(response=200, description="Booking confirmed successfully"),
     *     @OA\Response(response=401, description="Unauthenticated"),
     *     @OA\Response(response=403, description="Forbidden"),
     *     @OA\Response(response=404, description="Booking not found")
     * )
     */
    public function confirm(Booking $booking)
    {
        return $this->bookings->confirm($booking);
    }

    /**
     * @OA\Post(
     *     path="/api/bookings/{booking}/reject",
     *     summary="Reject a booking request (Admin only)",
     *     tags={"Bookings"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="booking",
     *         in="path",
     *         description="Booking ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(response=200, description="Booking rejected successfully"),
     *     @OA\Response(response=401, description="Unauthenticated"),
     *     @OA\Response(response=403, description="Forbidden"),
     *     @OA\Response(response=404, description="Booking not found")
     * )
     */
    public function reject(Booking $booking)
    {
        return $this->bookings->reject($booking);
    }
}
