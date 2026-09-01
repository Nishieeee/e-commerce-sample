<?php

namespace App\Providers;

use App\Models\User;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Database\Eloquent\Model;
// Rate limiting
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

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
        Model::preventLazyLoading(! app()->isProduction());

        Model::preventSilentlyDiscardingAttributes(! app()->isProduction());

        RateLimiter::for('api', function (Request $request) {
            /** @var User|null $user */
            $user = $request->user();

            // remove rate limiting for admin users
            if ($user?->isAdmin()) {
                return Limit::none();
            }

            // limit to 60 requests per minute
            return Limit::perMinute(60)->by($user?->id ?: $request->ip());
        });

        RateLimiter::for('login', function (Request $request) {
            // limit login request to 5 per minute
            return Limit::perMinute(5)->by($request->ip());
        });

    }
}
