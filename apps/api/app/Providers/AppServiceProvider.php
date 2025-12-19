<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\PropertyRepositoryInterface;
use App\Repositories\BookingRepositoryInterface;
use App\Repositories\AvailabilityRepositoryInterface;
use App\Repositories\Eloquent\PropertyRepository;
use App\Repositories\Eloquent\BookingRepository;
use App\Repositories\Eloquent\AvailabilityRepository;
use App\Repositories\Eloquent\PropertyMediaRepository;
use App\Repositories\PropertyMediaRepositoryInterface;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(PropertyRepositoryInterface::class, PropertyRepository::class);
        $this->app->bind(BookingRepositoryInterface::class, BookingRepository::class);
        $this->app->bind(AvailabilityRepositoryInterface::class, AvailabilityRepository::class);
        $this->app->bind(PropertyMediaRepositoryInterface::class, PropertyMediaRepository::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
