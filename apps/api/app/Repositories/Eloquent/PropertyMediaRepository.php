<?php

namespace App\Repositories\Eloquent;

use App\Models\PropertyMedia;
use App\Repositories\PropertyMediaRepositoryInterface;
use Illuminate\Support\Collection;

class PropertyMediaRepository implements PropertyMediaRepositoryInterface
{
    public function create(array $data): PropertyMedia
    {
        return PropertyMedia::create($data);
    }

    public function delete(PropertyMedia $media): void
    {
        $media->delete();
    }

    public function forProperty(int $propertyId): Collection
    {
        return PropertyMedia::where('property_id', $propertyId)->orderByDesc('id')->get();
    }
}
