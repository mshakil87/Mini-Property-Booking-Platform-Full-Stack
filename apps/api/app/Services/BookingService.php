<?php

namespace App\Services;

use App\Jobs\SendBookingConfirmationEmail;
use App\Models\Booking;
use App\Models\Property;
use App\Models\User;
use App\Repositories\BookingRepositoryInterface;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class BookingService
{
    public function __construct(
        private BookingRepositoryInterface $bookings,
        private AvailabilityService $availabilityService,
    ) {
    }

    public function requestBooking(User $user, Property $property, string $startDate, string $endDate, array $extra = []): Booking
    {
        $start = CarbonImmutable::parse($startDate)->startOfDay();
        $end = CarbonImmutable::parse($endDate)->startOfDay();

        if ($end->lessThanOrEqualTo($start)) {
            throw new RuntimeException('End date must be after start date');
        }

        if (!$this->availabilityService->isRangeAvailable($property->id, $start->toDateString(), $end->toDateString())) {
            throw new RuntimeException('Selected dates are not available');
        }

        $overlapping = $this->bookings->forPropertyBetween(
            $property->id,
            $start->toDateString(),
            $end->toDateString()
        );

        if ($overlapping->isNotEmpty()) {
            throw new RuntimeException('Selected dates are already booked');
        }

        $nights = $start->diffInDays($end);
        $totalPrice = $property->price_per_night * $nights;

        return DB::transaction(function () use ($user, $property, $start, $end, $totalPrice, $extra) {
            $booking = $this->bookings->create([
                'property_id' => $property->id,
                'user_id' => $user->id,
                'guest_name' => $extra['guest_name'] ?? null,
                'guest_email' => $extra['guest_email'] ?? null,
                'guest_phone' => $extra['guest_phone'] ?? null,
                'start_date' => $start->toDateString(),
                'end_date' => $end->toDateString(),
                'total_price' => $totalPrice,
                'status' => 'pending',
            ]);

            return $booking;
        });
    }

    public function confirm(Booking $booking): Booking
    {
        if ($booking->status === 'confirmed') {
            return $booking;
        }

        $booking = $this->bookings->update($booking, ['status' => 'confirmed']);
        SendBookingConfirmationEmail::dispatch($booking->id);

        return $booking;
    }

    public function reject(Booking $booking): Booking
    {
        if ($booking->status === 'rejected') {
            return $booking;
        }

        return $this->bookings->update($booking, ['status' => 'rejected']);
    }
}
