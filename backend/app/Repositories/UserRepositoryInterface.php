<?php

namespace App\Repositories;

use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface UserRepositoryInterface
{
    /**
     * Create a new user
     */
    public function create(array $data): User;

    /**
     * Update an existing user
     */
    public function update(User $user, array $data): User;

    /**
     * Delete a user
     */
    public function delete(User $user): bool;

    /**
     * Find a user by ID
     */
    public function findById(int $id): User;

    /**
     * Find a user by email address
     */
    public function findByEmail(string $email): ?User;

    /**
     * Find a user by verification token
     */
    public function findByVerificationToken(string $token): ?User;

    /**
     * Find a user by UUID
     */
    public function findByUuid(string $uuid): User;

    /**
     * Get paginated users with optional filters
     */
    public function getPaginated(array $filters, ?int $perPage = 15): LengthAwarePaginator;

    /**
     * Get users for assignment dropdown
     */
    public function getForAssignment(): Collection;

    /**
     * Get all users
     */
    public function all(): Collection;
}
