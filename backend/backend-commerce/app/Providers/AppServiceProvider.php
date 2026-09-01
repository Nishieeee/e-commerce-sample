<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

// Rate limiting
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;


class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Model::preventLazyLoading(!app()->isProduction());

        Model::preventSilentlyDiscardingAttributes(!app()->isProduction());

        RateLimiter::for('api', function (Request $request) {
            // remove rate limiting for admin users
            if($request->user()?->isAdmin()) {
                return Limit::none();
            }
            // limit to 60 requests per minute
            return Limit::perMinute(60)->by($request->user()?->id ?:
            $request->ip());
        });

        RateLimiter::for('login', function (Request $request) {
            // limit login request to 5 per minute
            return Limit::perMinute(5)->by($request->ip());
        });

    }
}
