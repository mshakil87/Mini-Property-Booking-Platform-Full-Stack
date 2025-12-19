<?php

namespace Database\Seeders;

use App\Models\Property;
use App\Models\PropertyMedia;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class PropertySeeder extends Seeder
{
    public function run(): void
    {
        $amenitiesCatalog = [
            'Free WiFi',
            'Parking',
            'Swimming Pool',
            'Gym',
            'Air Conditioning',
            'Kitchen',
            'Washer',
            'Pet Friendly',
            'Breakfast Included',
            'Sea View',
        ];

        $placeholderPng = base64_decode(
            'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFWgJ7j5cFtgAAAABJRU5ErkJggg=='
        );

        // Reset data
        \Illuminate\Support\Facades\Schema::disableForeignKeyConstraints();
        \Illuminate\Support\Facades\DB::table('property_media')->truncate();
        \Illuminate\Support\Facades\DB::table('availabilities')->truncate();
        \Illuminate\Support\Facades\DB::table('bookings')->truncate();
        \Illuminate\Support\Facades\DB::table('properties')->truncate();
        \Illuminate\Support\Facades\Schema::enableForeignKeyConstraints();

        $cities = \App\Models\City::all();
        for ($i = 1; $i <= 100; $i++) {
            $city = $cities->random();
            $property = Property::create([
                'title' => 'Property '.$i,
                'description' => 'Comfortable stay at Property '.$i,
                'price_per_night' => rand(60, 400),
                'city_id' => $city->id,
                'latitude' => fake()->randomFloat(7, 16.0000000, 32.0000000),
                'longitude' => fake()->randomFloat(7, 34.0000000, 56.0000000),
                'amenities' => fake()->randomElements($amenitiesCatalog, rand(3, 6)),
                'images' => [
                    "https://dummyimage.com/800x600/09f/fff&text=Property+$i",
                    "https://dummyimage.com/800x600/333/fff&text=Living+Area",
                    "https://dummyimage.com/800x600/f59e0b/fff&text=Bedroom",
                ],
                'featured_image' => "https://dummyimage.com/800x600/09f/fff&text=Property+$i",
                'is_featured' => $i % 9 === 0, // some featured
            ]);

            $mediaPath = "property-media/{$property->id}/placeholder.png";
            Storage::disk('public')->put($mediaPath, $placeholderPng);

            PropertyMedia::create([
                'property_id' => $property->id,
                'type' => 'image',
                'path' => $mediaPath,
                'caption' => 'Front view',
                'mime_type' => 'image/png',
                'size' => strlen((string) $placeholderPng),
            ]);
        }
    }
}
