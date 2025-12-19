<?php

namespace Tests\Feature;

use App\Models\Availability;
use App\Models\Booking;
use App\Models\Property;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BookingAvailabilityTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_can_book_within_availability()
    {
        $user = User::factory()->create(['role' => 'guest']);
        $property = Property::create([
            'title' => 'Nice Stay',
            'price_per_night' => 100,
            'location' => 'Paris',
            'amenities' => [],
            'images' => [],
        ]);
        Availability::create([
            'property_id' => $property->id,
            'start_date' => '2025-01-01',
            'end_date' => '2025-01-31',
        ]);

        $token = $user->createToken('api')->plainTextToken;
        $res = $this->withHeader('Authorization', 'Bearer '.$token)
            ->postJson('/api/bookings', [
                'property_id' => $property->id,
                'start_date' => '2025-01-10',
                'end_date' => '2025-01-12',
            ]);

        $res->assertStatus(201);
        $this->assertDatabaseHas('bookings', [
            'property_id' => $property->id,
            'user_id' => $user->id,
            'status' => 'pending',
        ]);
    }

    public function test_booking_rejected_if_outside_availability()
    {
        $user = User::factory()->create(['role' => 'guest']);
        $property = Property::create([
            'title' => 'Nice Stay',
            'price_per_night' => 100,
            'location' => 'Paris',
            'amenities' => [],
            'images' => [],
        ]);
        Availability::create([
            'property_id' => $property->id,
            'start_date' => '2025-01-01',
            'end_date' => '2025-01-31',
        ]);
        $token = $user->createToken('api')->plainTextToken;

        $res = $this->withHeader('Authorization', 'Bearer '.$token)
            ->postJson('/api/bookings', [
                'property_id' => $property->id,
                'start_date' => '2024-12-30',
                'end_date' => '2025-01-02',
            ]);

        $res->assertStatus(422);
    }

    public function test_booking_rejected_if_overlaps_existing()
    {
        $user = User::factory()->create(['role' => 'guest']);
        $property = Property::create([
            'title' => 'Nice Stay',
            'price_per_night' => 100,
            'location' => 'Paris',
            'amenities' => [],
            'images' => [],
        ]);
        Availability::create([
            'property_id' => $property->id,
            'start_date' => '2025-01-01',
            'end_date' => '2025-01-31',
        ]);
        Booking::create([
            'property_id' => $property->id,
            'user_id' => $user->id,
            'start_date' => '2025-01-10',
            'end_date' => '2025-01-12',
            'total_price' => 200,
            'status' => 'confirmed',
        ]);
        $token = $user->createToken('api')->plainTextToken;

        $res = $this->withHeader('Authorization', 'Bearer '.$token)
            ->postJson('/api/bookings', [
                'property_id' => $property->id,
                'start_date' => '2025-01-11',
                'end_date' => '2025-01-13',
            ]);

        $res->assertStatus(422);
    }
}
