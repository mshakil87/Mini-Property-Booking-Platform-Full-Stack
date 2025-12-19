<?php

namespace App\Repositories;

use App\Models\Booking;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface BookingRepositoryInterface
{
    public function create(array $data): Booking;
    public function update(Booking $booking, array $data): Booking;
    public function find(int $id): ?Booking;
    public function paginateAll(array $filters = [], int $perPage = 10): LengthAwarePaginator;
    public function paginateForUser(int $userId, int $perPage = 10): LengthAwarePaginator;
    public function forPropertyBetween(int $propertyId, string $startDate, string $endDate): Collection;
}

