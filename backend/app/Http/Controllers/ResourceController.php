<?php

namespace App\Http\Controllers;

use App\Models\Resource;
use App\Models\User;
use App\Http\Resources\ResourceResource;
use App\Http\Requests\StoreResourceRequest;
use App\Http\Requests\UpdateResourceRequest;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ResourceController extends Controller
{
    /**
     * Display a listing of resources with pagination and filtering
     */
    public function index(Request $request): JsonResponse
    {
        $query = Resource::with(['user', 'assignedUser']);

        // Apply filters
        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('tags', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $status = $request->get('status');
            if (is_string($status)) {
                $status = explode(',', $status);
            }
            $query->byStatus($status);
        }

        if ($request->filled('type')) {
            $query->byType($request->get('type'));
        }

        if ($request->filled('priority')) {
            $priority = $request->get('priority');
            if (is_string($priority)) {
                $priority = explode(',', $priority);
            }
            $query->byPriority($priority);
        }

        if ($request->filled('assigned_to')) {
            $query->byAssignedUser($request->get('assigned_to'));
        }

        // Apply sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Paginate results
        $perPage = $request->get('per_page', 15);
        $resources = $query->paginate($perPage);

        return response()->json([
            'data' => ResourceResource::collection($resources->items()),
            'pagination' => [
                'current_page' => $resources->currentPage(),
                'last_page' => $resources->lastPage(),
                'per_page' => $resources->perPage(),
                'total' => $resources->total(),
                'next_page' => $resources->hasMorePages() ? $resources->currentPage() + 1 : null,
                'prev_page' => $resources->currentPage() > 1 ? $resources->currentPage() - 1 : null,
            ]
        ]);
    }

    /**
     * Store a newly created resource
     */
    public function store(StoreResourceRequest $request): JsonResponse
    {
        $resource = Resource::create([
            ...$request->validated(),
            'user_id' => $request->user()->id,
        ]);

        $resource->load(['user', 'assignedUser']);

        return response()->json([
            'message' => 'Resource created successfully',
            'data' => new ResourceResource($resource)
        ], 201);
    }

    /**
     * Display the specified resource
     */
    public function show(Resource $resource): JsonResponse
    {
        $resource->load(['user', 'assignedUser']);
        
        return response()->json([
            'data' => new ResourceResource($resource)
        ]);
    }

    /**
     * Update the specified resource
     */
    public function update(UpdateResourceRequest $request, Resource $resource): JsonResponse
    {
        $resource->update($request->validated());
        $resource->load(['user', 'assignedUser']);

        return response()->json([
            'message' => 'Resource updated successfully',
            'data' => new ResourceResource($resource)
        ]);
    }

    /**
     * Remove the specified resource
     */
    public function destroy(Request $request, Resource $resource): JsonResponse
    {
        $resource->delete();

        return response()->json([
            'message' => 'Resource deleted successfully'
        ]);
    }

    /**
     * Get dashboard statistics
     */
    public function dashboard(Request $request): JsonResponse
    {
        $user = $request->user();

        // Base query for user filtering
        $baseQuery = function ($query) use ($user) {
            if (!$user->hasRole('Administrator')) {
                $query->where(function ($q) use ($user) {
                    $q->where('user_id', $user->id)
                      ->orWhere('assigned_to', $user->id);
                });
            }
        };

        $stats = [
            'total_resources' => Resource::query()->tap($baseQuery)->count(),
            'by_status' => Resource::query()
                ->tap($baseQuery)
                ->selectRaw('status, count(*) as count')
                ->groupBy('status')
                ->pluck('count', 'status')
                ->toArray(),
            'by_priority' => Resource::query()
                ->tap($baseQuery)
                ->selectRaw('priority, count(*) as count')
                ->groupBy('priority')
                ->pluck('count', 'priority')
                ->toArray(),
            'by_type' => Resource::query()
                ->tap($baseQuery)
                ->selectRaw('type, count(*) as count')
                ->groupBy('type')
                ->pluck('count', 'type')
                ->toArray(),
            'overdue' => Resource::query()
                ->tap($baseQuery)
                ->where('due_date', '<', now())
                ->where('status', '!=', 'completed')
                ->count(),
            'recent_activity' => Resource::query()
                ->tap($baseQuery)
                ->orderBy('updated_at', 'desc')
                ->limit(5)
                ->with(['user', 'assignedUser'])
                ->get(),
        ];

        return response()->json([
            'data' => $stats
        ]);
    }

    /**
     * Get users for assignment dropdown
     */
    public function getUsers(): JsonResponse
    {
        $users = User::select('id', 'name', 'email')->get();
        
        return response()->json([
            'data' => $users
        ]);
    }
} 