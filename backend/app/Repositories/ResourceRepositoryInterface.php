<?php

namespace App\Repositories;

use App\Models\Resource;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface ResourceRepositoryInterface
{
    /**
     * Create a new resource
     */
    public function create(array $data): Resource;
    
    /**
     * Update an existing resource
     */
    public function update(Resource $resource, array $data): Resource;
    
    /**
     * Delete a resource
     */
    public function delete(Resource $resource): bool;
    
    /**
     * Find a resource by UUID
     */
    public function findByUuid(string $uuid): Resource;
    
    /**
     * Find a resource by ID
     */
    public function findById(int $id): Resource;
    
    /**
     * Get paginated resources with optional filters
     */
    public function getPaginated(array $filters, ?int $perPage = 15): LengthAwarePaginator;
    
    /**
     * Get dashboard statistics for a specific user
     */
    public function getUserStats(int $userId): array;
    
    /**
     * Get dashboard statistics for admin (all resources)
     */
    public function getAdminStats(): array;
    
    /**
     * Get recent activity for a specific user
     */
    public function getUserActivity(int $userId, int $limit = 5): Collection;
    
    /**
     * Get recent activity for admin (all resources)
     */
    public function getAdminActivity(int $limit = 5): Collection;
} 