<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Database\Seeders\PropertySeeder;
use Database\Seeders\BookingSeeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::query()->updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin',
                'password' => Hash::make('password'),
                'role' => 'admin',
            ]
        );

        User::query()->updateOrCreate(
            ['email' => 'guest@example.com'],
            [
                'name' => 'Guest',
                'password' => Hash::make('password'),
                'role' => 'guest',
            ]
        );

        $this->call([
            CitySeeder::class,
            PropertySeeder::class,
            BookingSeeder::class,
        ]);
    }
}
