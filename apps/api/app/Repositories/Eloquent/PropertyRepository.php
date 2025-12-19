<?php

namespace App\Repositories\Eloquent;

use App\Models\Property;
use App\Repositories\PropertyRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class PropertyRepository implements PropertyRepositoryInterface
{
    public function paginate(array $filters, int $perPage = 10): LengthAwarePaginator
    {
        $query = Property::with('city');
        if (isset($filters['location'])) {
            $query->where('location', 'like', '%'.$filters['location'].'%');
        }
        if (isset($filters['min_price'])) {
            $query->where('price_per_night', '>=', $filters['min_price']);
        }
        if (isset($filters['max_price'])) {
            $query->where('price_per_night', '<=', $filters['max_price']);
        }
        if (isset($filters['date'])) {
            $date = $filters['date'];
            $query->whereHas('availabilities', function ($q) use ($date) {
                $q->where('start_date', '<=', $date)->where('end_date', '>=', $date);
            });
        }
        if (isset($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', '%'.$search.'%')
                  ->orWhere('location', 'like', '%'.$search.'%');
            });
        }
        $query->orderByDesc('is_featured')->orderByDesc('created_at');
        return $query->paginate($perPage);
    }

    public function find(int $id): ?Property
    {
        return Property::with('availabilities', 'city')->find($id);
    }

    public function create(array $data): Property
    {
        return Property::create($data);
    }

    public function update(Property $property, array $data): Property
    {
        $property->update($data);
        return $property;
    }

    public function delete(Property $property): void
    {
        $property->delete();
    }

    public function availabilities(int $propertyId): Collection
    {
        return Property::findOrFail($propertyId)->availabilities()->orderBy('start_date')->get();
    }
}
