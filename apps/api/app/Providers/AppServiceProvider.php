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
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;

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
        RateLimiter::for('auth', function (Request $request) {
            return Limit::perMinute(5)->by($request->user()?->id ?: $request->ip());
        });

        RateLimiter::for('public', function (Request $request) {
            return Limit::perMinute(20)->by($request->ip());
        });

        RateLimiter::for('private', function (Request $request) {
            return Limit::perMinute(15)->by($request->user()?->id ?: $request->ip());
        });
    }
}
