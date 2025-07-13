<?php

namespace App\Http\Controllers;

use App\Models\Resource;
use App\Http\Resources\ResourceResource;
use App\Http\Requests\StoreResourceRequest;
use App\Http\Requests\UpdateResourceRequest;
use App\Repositories\ResourceRepositoryInterface;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class ResourceController extends Controller
{
    public function __construct(
        private ResourceRepositoryInterface $resourceRepository
    ) {}

    /**
     * Display a listing of resources with pagination and filtering
     */
    public function index(Request $request)
    {
        try {
            // Extract filters from request
            $filters = [
                'search' => $request->input('search'),
                'status' => $request->input('status'),
                'type' => $request->input('type'),
                'priority' => $request->input('priority'),
                'assigned_to' => $request->input('assigned_to'),
                'sort_by' => $request->input('sort_by', 'created_at'),
                'sort_order' => $request->input('sort_order', 'desc'),
            ];

            // Retrieve the per_page parameter from the request
            $perPage = $request->input('per_page', 15);

            // Retrieve the resources from the repository
            $resources = $this->resourceRepository->getPaginated($filters, $perPage);

            // Return a collection of resource resources
            return ResourceResource::collection($resources);
        } catch (\Exception $e) {
            // Something went wrong
            Log::error("Error during resource list fetch. " . $e->getMessage());
            return response()->json(['message' => 'Failed to fetch resources'], 500);
        }
    }

    /**
     * Store a newly created resource
     */
    public function store(StoreResourceRequest $request)
    {
        try {
            $resource = $this->resourceRepository->create([
                ...$request->validated(),
                'user_id' => $request->user()->id,
            ]);

            $resource->load(['user', 'assignedUser']);

            return (new ResourceResource($resource))->response()->setStatusCode(201);
        } catch (\Exception $e) {
            Log::error("Error during resource creation. " . $e->getMessage());
            return response()->json(['message' => 'Failed to create resource'], 500);
        }
    }

    /**
     * Display the specified resource
     */
    public function show(Resource $resource)
    {
        try {
            $resource->load(['user', 'assignedUser']);
            
            return new ResourceResource($resource);
        } catch (\Exception $e) {
            Log::error("Error during resource fetch. " . $e->getMessage());
            return response()->json(['message' => 'Failed to fetch resource'], 500);
        }
    }

    /**
     * Update the specified resource
     */
    public function update(UpdateResourceRequest $request, Resource $resource)
    {
        try {
            $resource = $this->resourceRepository->update($resource, $request->validated());
            $resource->load(['user', 'assignedUser']);

            return new ResourceResource($resource);
        } catch (\Exception $e) {
            Log::error("Error during resource update. " . $e->getMessage());
            return response()->json(['message' => 'Failed to update resource'], 500);
        }
    }

    /**
     * Remove the specified resource
     */
    public function destroy(Request $request, Resource $resource)
    {
        try {
            $this->resourceRepository->delete($resource);

            return response()->json([
                'message' => 'Resource deleted successfully'
            ]);
        } catch (\Exception $e) {
            Log::error("Error during resource deletion. " . $e->getMessage());
            return response()->json(['message' => 'Failed to delete resource'], 500);
        }
    }

    /**
     * Get dashboard statistics
     */
    public function dashboard(Request $request)
    {
        try {
            $user = $request->user();

            // Get dashboard stats based on user role
            if ($user->hasRole('Administrator')) {
                $stats = $this->resourceRepository->getAdminStats();
            } else {
                $stats = $this->resourceRepository->getUserStats($user->id);
            }

            return response()->json([
                'data' => $stats
            ]);
        } catch (\Exception $e) {
            Log::error("Error during dashboard stats fetch. " . $e->getMessage());
            return response()->json(['message' => 'Failed to fetch dashboard statistics'], 500);
        }
    }
} 