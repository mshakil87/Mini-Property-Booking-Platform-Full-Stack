<?php

namespace App\Repositories;

use App\Models\Availability;
use Illuminate\Support\Collection;

interface AvailabilityRepositoryInterface
{
    public function create(array $data): Availability;
    public function delete(Availability $availability): void;
    public function forProperty(int $propertyId): Collection;
    public function isRangeAvailable(int $propertyId, string $startDate, string $endDate): bool;
}

