<?php

namespace App\Repositories;

use App\Models\Property;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface PropertyRepositoryInterface
{
    public function paginate(array $filters, int $perPage = 10): LengthAwarePaginator;
    public function find(int $id): ?Property;
    public function create(array $data): Property;
    public function update(Property $property, array $data): Property;
    public function delete(Property $property): void;
    public function availabilities(int $propertyId): Collection;
}

