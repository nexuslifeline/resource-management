<?php

namespace App\Http\Middleware;

use App\Models\Resource;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckResourceOwnership
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        $resource = $request->route('resource');

        // If no resource is found, let the controller handle the 404
        if (!$resource) {
            return $next($request);
        }

        // Administrators have full access to all resources
        if ($user->hasRole('Administrator')) {
            return $next($request);
        }

        // Regular users can only access their own resources
        if ($resource->user_id !== $user->id) {
            return response()->json([
                'message' => 'Unauthorized to access this resource'
            ], 403);
        }

        return $next($request);
    }
} 