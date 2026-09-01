<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // check if user is authenticated
        if (! $request->user()) {
            abort(401, 'Unauthorized');
        }

        // check if user is Admin
        if (! $request->user()->isAdmin()) {
            abort(403, 'Forbidden');
        }

        return $next($request);
    }
}
