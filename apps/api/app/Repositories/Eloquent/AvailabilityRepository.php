<?php

namespace App\Repositories\Eloquent;

use App\Models\Availability;
use App\Repositories\AvailabilityRepositoryInterface;
use Illuminate\Support\Collection;

class AvailabilityRepository implements AvailabilityRepositoryInterface
{
    public function create(array $data): Availability
    {
        return Availability::create($data);
    }

    public function delete(Availability $availability): void
    {
        $availability->delete();
    }

    public function forProperty(int $propertyId): Collection
    {
        return Availability::where('property_id', $propertyId)->orderBy('start_date')->get();
    }

    public function isRangeAvailable(int $propertyId, string $startDate, string $endDate): bool
    {
        $avail = Availability::where('property_id', $propertyId)->get();
        foreach ($avail as $a) {
            if ($startDate >= $a->start_date->toDateString() && $endDate <= $a->end_date->toDateString()) {
                return true;
            }
        }
        return false;
    }
}
