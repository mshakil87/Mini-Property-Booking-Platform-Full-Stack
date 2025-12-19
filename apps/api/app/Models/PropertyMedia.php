<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PropertyMedia extends Model
{
    use HasFactory;

    protected $fillable = [
        'property_id',
        'type',
        'path',
        'caption',
        'mime_type',
        'size',
    ];

    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }
}
