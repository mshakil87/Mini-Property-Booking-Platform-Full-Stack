<?php

namespace App\Repositories\Eloquent;

use App\Models\Availability;
use App\Repositories\AvailabilityRepositoryInterface;
use Illuminate\Support\Collection;
use Carbon\Carbon;

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
        $availabilities = Availability::where('property_id', $propertyId)
            ->where('start_date', '<=', $endDate)
            ->where('end_date', '>=', $startDate)
            ->orderBy('start_date')
            ->get();

        if ($availabilities->isEmpty()) {
            return false;
        }

        $currentStart = Carbon::parse($startDate);
        $targetEnd = Carbon::parse($endDate);

        foreach ($availabilities as $a) {
            $aStart = Carbon::parse($a->start_date);
            $aEnd = Carbon::parse($a->end_date);

            // If there's a gap before the first availability or between availabilities
            if ($aStart->gt($currentStart)) {
                return false;
            }

            // Move currentStart forward if this availability extends our coverage
            if ($aEnd->gte($currentStart)) {
                // If it covers until or beyond the target end date
                if ($aEnd->gte($targetEnd)) {
                    return true;
                }
                // Otherwise, the next day we need to check is the day after this one ends
                $currentStart = $aEnd->copy()->addDay();
            }
        }

        return $currentStart->gt($targetEnd);
    }
}
