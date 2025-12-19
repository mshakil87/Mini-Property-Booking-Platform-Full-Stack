<?php

namespace App\Services;

use App\Models\Availability;
use App\Repositories\AvailabilityRepositoryInterface;
use Illuminate\Support\Collection;

class AvailabilityService
{
    public function __construct(private AvailabilityRepositoryInterface $availabilities)
    {
    }

    public function forProperty(int $propertyId): Collection
    {
        return $this->availabilities->forProperty($propertyId);
    }

    public function create(array $data): Availability
    {
        return $this->availabilities->create($data);
    }

    public function isRangeAvailable(int $propertyId, string $startDate, string $endDate): bool
    {
        return $this->availabilities->isRangeAvailable($propertyId, $startDate, $endDate);
    }

    public function delete(Availability $availability): void
    {
        $this->availabilities->delete($availability);
    }
}
