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

    /**
     * @OA\Get(
     *     path="/api/properties/{property}/media",
     *     summary="List media for a property",
     *     tags={"Property Media"},
     *     @OA\Parameter(
     *         name="property",
     *         in="path",
     *         description="Property ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(response=200, description="Successful operation"),
     *     @OA\Response(response=404, description="Property not found")
     * )
     */
    public function index(Property $property)
    {
        return $this->media->forProperty($property->id);
    }

    /**
     * @OA\Post(
     *     path="/api/properties/{property}/media",
     *     summary="Upload media for a property (Admin only)",
     *     tags={"Property Media"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="property",
     *         in="path",
     *         description="Property ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                 required={"file"},
     *                 @OA\Property(property="file", type="string", format="binary", description="Image or video file"),
     *                 @OA\Property(property="caption", type="string", description="Optional caption")
     *             )
     *         )
     *     ),
     *     @OA\Response(response=201, description="Media uploaded successfully"),
     *     @OA\Response(response=401, description="Unauthenticated"),
     *     @OA\Response(response=403, description="Forbidden"),
     *     @OA\Response(response=422, description="Validation error")
     * )
     */
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

    /**
     * @OA\Delete(
     *     path="/api/properties/{property}/media/{media}",
     *     summary="Delete property media (Admin only)",
     *     tags={"Property Media"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="property",
     *         in="path",
     *         description="Property ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Parameter(
     *         name="media",
     *         in="path",
     *         description="Media ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(response=204, description="Media deleted successfully"),
     *     @OA\Response(response=401, description="Unauthenticated"),
     *     @OA\Response(response=403, description="Forbidden"),
     *     @OA\Response(response=404, description="Media or Property not found")
     * )
     */
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
