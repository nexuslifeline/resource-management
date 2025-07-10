<?php

namespace App\Http\Controllers;

use App\Models\Resource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

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
            $query->byStatus($request->get('status'));
        }

        if ($request->filled('type')) {
            $query->byType($request->get('type'));
        }

        if ($request->filled('priority')) {
            $query->byPriority($request->get('priority'));
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
            'data' => $resources->items(),
            'pagination' => [
                'current_page' => $resources->currentPage(),
                'last_page' => $resources->lastPage(),
                'per_page' => $resources->perPage(),
                'total' => $resources->total(),
            ]
        ]);
    }

    /**
     * Store a newly created resource
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => ['required', Rule::in(['project', 'task', 'inventory', 'document', 'other'])],
            'status' => ['required', Rule::in(['pending', 'in_progress', 'completed', 'cancelled'])],
            'priority' => ['required', Rule::in(['low', 'medium', 'high', 'urgent'])],
            'assigned_to' => 'nullable|exists:users,id',
            'due_date' => 'nullable|date|after:now',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $resource = Resource::create([
            ...$request->validated(),
            'user_id' => $request->user()->id,
        ]);

        $resource->load(['user', 'assignedUser']);

        return response()->json([
            'message' => 'Resource created successfully',
            'data' => $resource
        ], 201);
    }

    /**
     * Display the specified resource
     */
    public function show(Resource $resource): JsonResponse
    {
        $resource->load(['user', 'assignedUser']);
        
        return response()->json([
            'data' => $resource
        ]);
    }

    /**
     * Update the specified resource
     */
    public function update(Request $request, Resource $resource): JsonResponse
    {
        // Check if user can update this resource
        if (!$request->user()->hasRole('Administrator') && $resource->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Unauthorized to update this resource'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'type' => ['sometimes', 'required', Rule::in(['project', 'task', 'inventory', 'document', 'other'])],
            'status' => ['sometimes', 'required', Rule::in(['pending', 'in_progress', 'completed', 'cancelled'])],
            'priority' => ['sometimes', 'required', Rule::in(['low', 'medium', 'high', 'urgent'])],
            'assigned_to' => 'nullable|exists:users,id',
            'due_date' => 'nullable|date',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $resource->update($request->validated());
        $resource->load(['user', 'assignedUser']);

        return response()->json([
            'message' => 'Resource updated successfully',
            'data' => $resource
        ]);
    }

    /**
     * Remove the specified resource
     */
    public function destroy(Request $request, Resource $resource): JsonResponse
    {
        // Check if user can delete this resource
        if (!$request->user()->hasRole('Administrator') && $resource->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Unauthorized to delete this resource'
            ], 403);
        }

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
        $query = Resource::query();

        // If not admin, only show user's resources
        if (!$user->hasRole('Administrator')) {
            $query->where(function ($q) use ($user) {
                $q->where('user_id', $user->id)
                  ->orWhere('assigned_to', $user->id);
            });
        }

        $stats = [
            'total_resources' => $query->count(),
            'by_status' => $query->selectRaw('status, count(*) as count')
                ->groupBy('status')
                ->pluck('count', 'status')
                ->toArray(),
            'by_priority' => $query->selectRaw('priority, count(*) as count')
                ->groupBy('priority')
                ->pluck('count', 'priority')
                ->toArray(),
            'by_type' => $query->selectRaw('type, count(*) as count')
                ->groupBy('type')
                ->pluck('count', 'type')
                ->toArray(),
            'overdue' => $query->where('due_date', '<', now())
                ->where('status', '!=', 'completed')
                ->count(),
            'recent_activity' => $query->orderBy('updated_at', 'desc')
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