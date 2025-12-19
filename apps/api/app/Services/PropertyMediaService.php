<?php

namespace App\Services;

use App\Models\PropertyMedia;
use App\Repositories\PropertyMediaRepositoryInterface;
use Illuminate\Support\Collection;

class PropertyMediaService
{
    public function __construct(private PropertyMediaRepositoryInterface $media)
    {
    }

    public function forProperty(int $propertyId): Collection
    {
        return $this->media->forProperty($propertyId);
    }

    public function create(array $data): PropertyMedia
    {
        return $this->media->create($data);
    }

    public function delete(PropertyMedia $media): void
    {
        $this->media->delete($media);
    }
}
