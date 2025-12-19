<?php

namespace App\Repositories\Eloquent;

use App\Models\Booking;
use App\Repositories\BookingRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class BookingRepository implements BookingRepositoryInterface
{
    public function create(array $data): Booking
    {
        return Booking::create($data);
    }

    public function update(Booking $booking, array $data): Booking
    {
        $booking->update($data);
        return $booking;
    }

    public function find(int $id): ?Booking
    {
        return Booking::find($id);
    }

    public function paginateAll(array $filters = [], int $perPage = 10): LengthAwarePaginator
    {
        $query = Booking::with(['property', 'user']);

        if (isset($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->whereHas('property', function ($q) use ($search) {
                    $q->where('title', 'like', '%'.$search.'%');
                })
                ->orWhereHas('user', function ($q) use ($search) {
                    $q->where('email', 'like', '%'.$search.'%');
                });
            });
        }

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query->orderByDesc('created_at')->paginate($perPage);
    }

    public function paginateForUser(int $userId, int $perPage = 10): LengthAwarePaginator
    {
        return Booking::with('property')
            ->where('user_id', $userId)
            ->orderByDesc('created_at')
            ->paginate($perPage);
    }

    public function forPropertyBetween(int $propertyId, string $startDate, string $endDate): Collection
    {
        return Booking::where('property_id', $propertyId)
            ->whereIn('status', ['pending', 'confirmed'])
            ->where(function ($q) use ($startDate, $endDate) {
                $q->whereBetween('start_date', [$startDate, $endDate])
                  ->orWhereBetween('end_date', [$startDate, $endDate])
                  ->orWhere(function ($qq) use ($startDate, $endDate) {
                      $qq->where('start_date', '<=', $startDate)
                         ->where('end_date', '>=', $endDate);
                  });
            })
            ->get();
    }
}
