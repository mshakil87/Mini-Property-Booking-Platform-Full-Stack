<?php

namespace App\Services;

use App\Models\Property;
use App\Repositories\PropertyRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class PropertyService
{
    public function __construct(private PropertyRepositoryInterface $properties)
    {
    }

    public function list(array $filters, int $perPage = 12): LengthAwarePaginator
    {
        return $this->properties->paginate($filters, $perPage);
    }

    public function find(int $id): ?Property
    {
        return $this->properties->find($id);
    }

    public function create(array $data): Property
    {
        return $this->properties->create($data);
    }

    public function update(Property $property, array $data): Property
    {
        return $this->properties->update($property, $data);
    }

    public function delete(Property $property): void
    {
        $this->properties->delete($property);
    }

    public function availabilities(int $propertyId): Collection
    {
        return $this->properties->availabilities($propertyId);
    }
}

