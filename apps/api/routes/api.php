<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\PropertyController;
use App\Http\Controllers\API\BookingController;
use App\Http\Controllers\API\AvailabilityController;
use App\Http\Controllers\API\CityController;
use App\Http\Controllers\API\PropertyMediaController;

Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

Route::get('/properties', [PropertyController::class, 'index']);
Route::get('/properties/{property}', [PropertyController::class, 'show']);
Route::get('/properties/{property}/media', [PropertyMediaController::class, 'index']);
Route::get('/cities', [CityController::class, 'index']);

Route::post('/bookings', [BookingController::class, 'store'])->middleware('auth:sanctum');
Route::get('/bookings/me', [BookingController::class, 'myBookings'])->middleware('auth:sanctum');

Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::post('/properties', [PropertyController::class, 'store']);
    Route::put('/properties/{property}', [PropertyController::class, 'update']);
    Route::delete('/properties/{property}', [PropertyController::class, 'destroy']);

    Route::post('/properties/{property}/availability', [AvailabilityController::class, 'store']);
    Route::get('/properties/{property}/availability', [AvailabilityController::class, 'index']);
    Route::delete('/properties/{property}/availability/{availability}', [AvailabilityController::class, 'destroy']);
    Route::post('/properties/{property}/media', [PropertyMediaController::class, 'store']);
    Route::delete('/properties/{property}/media/{media}', [PropertyMediaController::class, 'destroy']);

    Route::get('/bookings', [BookingController::class, 'index']);
    Route::post('/bookings/{booking}/confirm', [BookingController::class, 'confirm']);
    Route::post('/bookings/{booking}/reject', [BookingController::class, 'reject']);
})
;
