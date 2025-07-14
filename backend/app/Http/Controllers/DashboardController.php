<?php

namespace App\Http\Controllers;

use App\Repositories\ResourceRepositoryInterface;
use App\Repositories\UserRepositoryInterface;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class DashboardController extends Controller
{
    public function __construct(
        private ResourceRepositoryInterface $resourceRepository,
        private UserRepositoryInterface $userRepository
    ) {}

    /**
     * Get comprehensive dashboard statistics
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            
            if (!$user) {
                Log::error("Dashboard: No authenticated user found");
                return response()->json(['message' => 'User not authenticated'], 401);
            }

            Log::info("Dashboard: Processing request for user ID: " . $user->id);
            
            // Check if user has roles loaded
            if (!$user->relationLoaded('roles')) {
                $user->load('roles');
            }
            
            $isAdmin = $user->hasRole('Administrator');
            Log::info("Dashboard: User is admin: " . ($isAdmin ? 'true' : 'false'));

            // Get resource statistics
            try {
                if ($isAdmin) {
                    $resourceStats = $this->resourceRepository->getAdminStats();
                    Log::info("Dashboard: Retrieved admin resource stats");
                } else {
                    $resourceStats = $this->resourceRepository->getUserStats($user->id);
                    Log::info("Dashboard: Retrieved user resource stats for user ID: " . $user->id);
                }
            } catch (\Exception $e) {
                Log::error("Dashboard: Error getting resource stats: " . $e->getMessage());
                throw $e;
            }

            // Get user statistics (admin only)
            $userStats = null;
            if ($isAdmin) {
                try {
                    $userStats = $this->userRepository->getStats();
                    Log::info("Dashboard: Retrieved user stats");
                } catch (\Exception $e) {
                    Log::error("Dashboard: Error getting user stats: " . $e->getMessage());
                    throw $e;
                }
            }

            // Get monthly resource creation data for charts
            try {
                $monthlyData = $this->getMonthlyResourceData($isAdmin, $user->id);
                Log::info("Dashboard: Retrieved monthly data");
            } catch (\Exception $e) {
                Log::error("Dashboard: Error getting monthly data: " . $e->getMessage());
                throw $e;
            }

            // Convert to camelCase and ensure all required properties exist
            $response = [
                'data' => [
                    'resource_stats' => $resourceStats,
                    'user_stats' => $userStats,
                    'monthly_data' => $monthlyData,
                    'is_admin' => $isAdmin,
                ]
            ];

            Log::info("Dashboard: Successfully prepared response");
            return response()->json($response);
            
        } catch (\Exception $e) {
            Log::error("Dashboard: Error during dashboard stats fetch. " . $e->getMessage());
            Log::error("Dashboard: Stack trace: " . $e->getTraceAsString());
            return response()->json(['message' => 'Failed to fetch dashboard statistics'], 500);
        }
    }

    /**
     * Get monthly resource creation data for charts
     */
    private function getMonthlyResourceData(bool $isAdmin, int $userId = null): array
    {
        $query = \App\Models\Resource::query();

        // Filter by user if not admin
        if (!$isAdmin && $userId) {
            $query->where(function ($q) use ($userId) {
                $q->where('user_id', $userId)
                  ->orWhere('assigned_to', $userId);
            });
        }

        // Get monthly counts for the current year
        $monthlyData = $query->selectRaw('MONTH(created_at) as month, COUNT(*) as count')
            ->whereYear('created_at', date('Y'))
            ->groupBy('month')
            ->orderBy('month')
            ->pluck('count', 'month')
            ->toArray();

        // Fill in missing months with 0
        $result = [];
        for ($month = 1; $month <= 12; $month++) {
            $result[$month] = $monthlyData[$month] ?? 0;
        }

        return $result;
    }

    /**
     * Simple test endpoint to debug dashboard issues
     */
    public function test(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            
            if (!$user) {
                return response()->json(['message' => 'User not authenticated'], 401);
            }

            // Test basic user info
            $userInfo = [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'has_roles_loaded' => $user->relationLoaded('roles'),
            ];

            // Test role loading
            if (!$user->relationLoaded('roles')) {
                $user->load('roles');
            }

            $userInfo['roles'] = $user->roles->pluck('name')->toArray();
            $userInfo['is_admin'] = $user->hasRole('Administrator');

            // Test basic resource count
            $resourceCount = \App\Models\Resource::count();

            // Test basic user count
            $userCount = \App\Models\User::count();

            return response()->json([
                'message' => 'Dashboard test successful',
                'user_info' => $userInfo,
                'resource_count' => $resourceCount,
                'user_count' => $userCount,
            ]);
            
        } catch (\Exception $e) {
            Log::error("Dashboard Test: Error: " . $e->getMessage());
            Log::error("Dashboard Test: Stack trace: " . $e->getTraceAsString());
            return response()->json([
                'message' => 'Dashboard test failed',
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ], 500);
        }
    }
} 