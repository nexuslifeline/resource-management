<?php

namespace App\Repositories;

use App\Models\Resource;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Builder;

class ResourceRepository implements ResourceRepositoryInterface
{
    /**
     * Create a new resource
     */
    public function create(array $data): Resource
    {
        return Resource::create($data);
    }

    /**
     * Update an existing resource
     */
    public function update(Resource $resource, array $data): Resource
    {
        $resource->update($data);
        return $resource->fresh();
    }

    /**
     * Delete a resource
     */
    public function delete(Resource $resource): bool
    {
        return $resource->delete();
    }

    /**
     * Find a resource by UUID
     */
    public function findByUuid(string $uuid): Resource
    {
        return Resource::where('uuid', $uuid)->firstOrFail();
    }

    /**
     * Find a resource by ID
     */
    public function findById(int $id): Resource
    {
        return Resource::findOrFail($id);
    }

    /**
     * Get paginated resources with optional filters
     * 
     * @param array $filters Array containing search, status, type, priority, assigned_to, sort_by, sort_order
     * @param int|null $perPage Number of items per page (default: 15)
     * @return LengthAwarePaginator
     */
    public function getPaginated(array $filters, ?int $perPage = 15): LengthAwarePaginator
    {
        $query = Resource::with(['user', 'assignedUser']);

        // Apply search filter
        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('tags', 'like', "%{$search}%");
            });
        }

        // Apply status filter
        if (!empty($filters['status'])) {
            $status = $filters['status'];
            if (is_string($status)) {
                $status = explode(',', $status);
            }
            $query->byStatus($status);
        }

        // Apply type filter
        if (!empty($filters['type'])) {
            $query->byType($filters['type']);
        }

        // Apply priority filter
        if (!empty($filters['priority'])) {
            $priority = $filters['priority'];
            if (is_string($priority)) {
                $priority = explode(',', $priority);
            }
            $query->byPriority($priority);
        }

        // Apply assigned user filter
        if (!empty($filters['assigned_to'])) {
            $query->byAssignedUser($filters['assigned_to']);
        }

        // Apply sorting
        $sortBy = $filters['sort_by'] ?? 'created_at';
        $sortOrder = $filters['sort_order'] ?? 'desc';
        $query->orderBy($sortBy, $sortOrder);

        return $query->paginate($perPage);
    }

    /**
     * Get dashboard statistics for a specific user
     * 
     * @param int $userId The user ID to filter resources for
     * @return array Statistics including total_resources, by_status, by_priority, by_type, overdue, recent_activity
     */
    public function getUserStats(int $userId): array
    {
        try {
            // Base query for user's resources
            $userResourcesQuery = function ($query) use ($userId) {
                $query->where(function ($q) use ($userId) {
                    $q->where('user_id', $userId)
                      ->orWhere('assigned_to', $userId);
                });
            };

            // Get total resources
            $totalResources = Resource::where(function ($q) use ($userId) {
                $q->where('user_id', $userId)
                  ->orWhere('assigned_to', $userId);
            })->count();

            // Get status distribution
            $byStatus = Resource::where(function ($q) use ($userId) {
                $q->where('user_id', $userId)
                  ->orWhere('assigned_to', $userId);
            })
            ->selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

            // Get priority distribution
            $byPriority = Resource::where(function ($q) use ($userId) {
                $q->where('user_id', $userId)
                  ->orWhere('assigned_to', $userId);
            })
            ->selectRaw('priority, count(*) as count')
            ->groupBy('priority')
            ->pluck('count', 'priority')
            ->toArray();

            // Get type distribution
            $byType = Resource::where(function ($q) use ($userId) {
                $q->where('user_id', $userId)
                  ->orWhere('assigned_to', $userId);
            })
            ->selectRaw('type, count(*) as count')
            ->groupBy('type')
            ->pluck('count', 'type')
            ->toArray();

            // Get overdue resources
            $overdue = Resource::where(function ($q) use ($userId) {
                $q->where('user_id', $userId)
                  ->orWhere('assigned_to', $userId);
            })
            ->where('due_date', '<', now())
            ->where('status', '!=', 'completed')
            ->count();

            // Get recent activity
            $recentActivity = $this->getUserActivity($userId, 5);

            return [
                'total_resources' => $totalResources,
                'by_status' => $byStatus,
                'by_priority' => $byPriority,
                'by_type' => $byType,
                'overdue' => $overdue,
                'recent_activity' => $recentActivity,
            ];
        } catch (\Exception $e) {
            \Log::error("ResourceRepository getUserStats error: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Get dashboard statistics for admin (all resources)
     * 
     * @return array Statistics including total_resources, by_status, by_priority, by_type, overdue, recent_activity
     */
    public function getAdminStats(): array
    {
        try {
            $totalResources = Resource::count();
            
            $byStatus = Resource::selectRaw('status, count(*) as count')
                ->groupBy('status')
                ->pluck('count', 'status')
                ->toArray();
                
            $byPriority = Resource::selectRaw('priority, count(*) as count')
                ->groupBy('priority')
                ->pluck('count', 'priority')
                ->toArray();
                
            $byType = Resource::selectRaw('type, count(*) as count')
                ->groupBy('type')
                ->pluck('count', 'type')
                ->toArray();
                
            $overdue = Resource::where('due_date', '<', now())
                ->where('status', '!=', 'completed')
                ->count();
                
            $recentActivity = $this->getAdminActivity(5);

            return [
                'total_resources' => $totalResources,
                'by_status' => $byStatus,
                'by_priority' => $byPriority,
                'by_type' => $byType,
                'overdue' => $overdue,
                'recent_activity' => $recentActivity,
            ];
        } catch (\Exception $e) {
            \Log::error("ResourceRepository getAdminStats error: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Get recent activity for a specific user
     * 
     * @param int $userId The user ID to filter resources for
     * @param int $limit Number of recent activities to return (default: 5)
     * @return Collection Recent resources for the user
     */
    public function getUserActivity(int $userId, int $limit = 5): Collection
    {
        return Resource::where(function ($query) use ($userId) {
            $query->where('user_id', $userId)
                  ->orWhere('assigned_to', $userId);
        })
        ->orderBy('updated_at', 'desc')
        ->limit($limit)
        ->with(['user', 'assignedUser'])
        ->get();
    }

    /**
     * Get recent activity for admin (all resources)
     * 
     * @param int $limit Number of recent activities to return (default: 5)
     * @return Collection Recent resources for all users
     */
    public function getAdminActivity(int $limit = 5): Collection
    {
        return Resource::orderBy('updated_at', 'desc')
            ->limit($limit)
            ->with(['user', 'assignedUser'])
            ->get();
    }
} 