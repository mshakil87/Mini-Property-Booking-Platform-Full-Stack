<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\City;

class CityController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/cities",
     *     summary="List all cities",
     *     tags={"Cities"},
     *     @OA\Response(response=200, description="Successful operation")
     * )
     */
    public function index()
    {
        return City::orderBy('name')->get();
    }
}
