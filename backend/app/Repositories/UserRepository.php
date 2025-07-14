<?php

namespace App\Repositories;

use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Builder;

class UserRepository implements UserRepositoryInterface
{
    /**
     * Creates a new User record in the database.
     */
    public function create(array $data): User
    {
        return User::create($data);
    }

    /**
     * Updates a User with the given data.
     */
    public function update(User $user, array $data): User
    {
        $user->update($data);
        return $user->fresh();
    }

    /**
     * Deletes a user.
     */
    public function delete(User $user): bool
    {
        return $user->delete();
    }

    /**
     * Finds a user by ID.
     */
    public function findById(int $id): User
    {
        return User::findOrFail($id);
    }

    /**
     * Find a user by their email address.
     */
    public function findByEmail(string $email): ?User
    {
        return User::where('email', $email)->first();
    }

    /**
     * Find a user by verification token.
     */
    public function findByVerificationToken(string $token): ?User
    {
        return User::where('verification_token', $token)->first();
    }

    /**
     * Find a user by UUID.
     */
    public function findByUuid(string $uuid): User
    {
        return User::where('uuid', $uuid)->firstOrFail();
    }

    /**
     * Get paginated users with optional filters
     * 
     * @param array $filters Array containing search, role, sort_by, sort_order
     * @param int|null $perPage Number of items per page (default: 15)
     * @return LengthAwarePaginator
     */
    public function getPaginated(array $filters, ?int $perPage = 15): LengthAwarePaginator
    {
        $query = User::with('roles');

        // Apply search filter
        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Apply role filter
        if (!empty($filters['role'])) {
            $role = $filters['role'];
            $query->whereHas('roles', function ($q) use ($role) {
                $q->where('name', $role);
            });
        }

        // Apply sorting
        $sortBy = $filters['sort_by'] ?? 'created_at';
        $sortOrder = $filters['sort_order'] ?? 'desc';
        $query->orderBy($sortBy, $sortOrder);

        return $query->paginate($perPage);
    }

    /**
     * Get users for assignment dropdown
     * 
     * @return Collection Users with id, name, and email for assignment
     */
    public function getForAssignment(): Collection
    {
        return User::select('id', 'name', 'email')->get();
    }

    /**
     * Retrieves all records from the database.
     */
    public function all(): Collection
    {
        return User::all();
    }

    /**
     * Get user statistics for dashboard
     * 
     * @return array Statistics including total_users, by_role, by_status, recent_registrations
     */
    public function getStats(): array
    {
        try {
            $totalUsers = User::count();
            
            // Get role distribution - simplified to avoid complex joins
            $roleDistribution = [];
            $usersWithRoles = User::with('roles')->get();
            foreach ($usersWithRoles as $user) {
                foreach ($user->roles as $role) {
                    $roleName = $role->name;
                    $roleDistribution[$roleName] = ($roleDistribution[$roleName] ?? 0) + 1;
                }
            }
            
            // Get status distribution
            $activeUsers = User::whereNotNull('email_verified_at')->count();
            $invitedUsers = User::whereNull('email_verified_at')->count();
            
            // Get recent registrations
            $recentRegistrations = $this->getRecentRegistrations(5);
            
            return [
                'total_users' => $totalUsers,
                'by_role' => $roleDistribution,
                'by_status' => [
                    'active' => $activeUsers,
                    'invited' => $invitedUsers,
                ],
                'recent_registrations' => $recentRegistrations,
            ];
        } catch (\Exception $e) {
            \Log::error("UserRepository getStats error: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Get recent user registrations
     * 
     * @param int $limit Number of recent registrations to return (default: 5)
     * @return Collection Recent user registrations
     */
    public function getRecentRegistrations(int $limit = 5): Collection
    {
        return User::orderBy('created_at', 'desc')
            ->limit($limit)
            ->with('roles')
            ->get();
    }
}
