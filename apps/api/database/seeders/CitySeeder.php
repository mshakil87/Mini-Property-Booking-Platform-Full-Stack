<?php

namespace Database\Seeders;

use App\Models\City;
use Illuminate\Database\Seeder;

class CitySeeder extends Seeder
{
    public function run(): void
    {
        $cities = [
            'Riyadh', 'Jeddah', 'Mecca', 'Medina', 'Dammam', 'Khobar', 'Taif', 'Tabuk', 'Abha',
            'Najran', 'Hail', 'Jazan', 'Yanbu', 'Al Qassim', 'Al Jubail', 'Al Ahsa', 'Buraidah',
            'Khamis Mushait', 'Al Bahah', 'Sakakah'
        ];
        foreach ($cities as $name) {
            City::updateOrCreate(['name' => $name, 'country' => 'Saudi Arabia']);
        }
    }
}
