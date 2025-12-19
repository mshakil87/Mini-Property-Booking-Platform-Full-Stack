<?php

namespace Database\Seeders;

use App\Models\Booking;
use App\Models\Property;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class BookingSeeder extends Seeder
{
    public function run(): void
    {
        \Illuminate\Support\Facades\Schema::disableForeignKeyConstraints();
        \Illuminate\Support\Facades\DB::table('bookings')->truncate();
        \Illuminate\Support\Facades\Schema::enableForeignKeyConstraints();
        $properties = Property::query()->inRandomOrder()->take(20)->get();

        $guests = User::query()->where('role', 'guest')->take(10)->get();
        if ($guests->isEmpty()) {
            $guests = User::factory()->count(10)->create(['role' => 'guest']);
        }

        foreach ($properties as $property) {
            foreach ($guests as $user) {
                $start = Carbon::now()->addDays(rand(1, 30))->startOfDay();
                $end = (clone $start)->addDays(rand(2, 7))->startOfDay();

                Booking::create([
                    'property_id' => $property->id,
                    'user_id' => $user->id,
                    'start_date' => $start->toDateString(),
                    'end_date' => $end->toDateString(),
                    'total_price' => $property->price_per_night * $start->diffInDays($end),
                    'status' => fake()->randomElement(['pending', 'confirmed', 'rejected']),
                ]);
            }
        }
    }
}
