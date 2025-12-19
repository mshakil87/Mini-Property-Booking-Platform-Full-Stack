<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Property;
use App\Models\PropertyMedia;
use App\Services\PropertyMediaService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PropertyMediaController extends Controller
{
    public function __construct(private PropertyMediaService $media)
    {
    }

    public function index(Property $property)
    {
        return $this->media->forProperty($property->id);
    }

    public function store(Request $request, Property $property)
    {
        $data = $request->validate([
            'file' => ['required', 'file', 'mimetypes:image/jpeg,image/png,image/webp,video/mp4'],
            'caption' => ['nullable', 'string', 'max:255'],
        ]);

        $file = $data['file'];
        $mime = $file->getMimeType();
        $type = str_starts_with((string) $mime, 'video') ? 'video' : 'image';
        $path = $file->store("property-media/{$property->id}", 'public');

        return response()->json(
            $this->media->create([
                'property_id' => $property->id,
                'type' => $type,
                'path' => $path,
                'caption' => $data['caption'] ?? null,
                'mime_type' => $mime,
                'size' => $file->getSize(),
            ]),
            201
        );
    }

    public function destroy(Property $property, PropertyMedia $media)
    {
        if ($media->property_id !== $property->id) {
            return response()->json(['message' => 'Not found'], 404);
        }
        if ($media->path) {
            Storage::disk('public')->delete($media->path);
        }
        $this->media->delete($media);
        return response()->noContent();
    }
}
