<?php

namespace App\Repositories;

use App\Models\PropertyMedia;
use Illuminate\Support\Collection;

interface PropertyMediaRepositoryInterface
{
    public function create(array $data): PropertyMedia;
    public function delete(PropertyMedia $media): void;
    public function forProperty(int $propertyId): Collection;
}
