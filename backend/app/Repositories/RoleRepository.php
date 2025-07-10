<?php

namespace App\Repositories;

use App\Models\Role;
use App\Utils\Constants;
use Illuminate\Support\Facades\Log;

class RoleRepository implements RoleRepositoryInterface
{
    /**
     * Creates a new Role record in the database.
     *
     * @param array $data The data for creating the Role record.
     * @throws Some_Exception_Class A description of the exception that can be thrown.
     * @return Role The newly created Role record.
     */
    public function create(array $data)
    {
        return Role::create($data);
    }


    /**
     * Update a role by UUID.
     *
     * @param string $uuid The UUID of the role.
     * @param array<mixed> $data The data to update the role with.
     * @return \App\Models\Role The updated role.
     */
    public function update(string $uuid, array $data)
    {
        $role = $this->findByUuid($uuid);
        $role->update($data);
        return $role;
    }


    /**
     * Deletes a role by its UUID.
     *
     * @param string $uuid The UUID of the role to be deleted.
     * @throws Some_Exception_Class If an error occurs while deleting the role.
     * @return void
     */
    public function delete(string $uuid)
    {
        Log::info('Deleting role with UUID: ' . $uuid);
        $role = Role::where('uuid', $uuid)->firstOrFail();
        $role->delete();
    }

    /**
     * Finds an role by ID.
     *
     * @param int $id The ID of the admin to find.
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException If the role is not found.
     * @return \App\Models\Role The found role.
     */
    public function find(string $uuid)
    {
        return Role::where('uuid', $uuid)->firstOrFail();
    }

    /**
     * Finds a role by its UUID.
     *
     * @param mixed $uuid The UUID of the role.
     * @throws Illuminate\Database\Eloquent\ModelNotFoundException If no role is found.
     * @return Role The Role model instance.
     */
    public function findByUuid(string $uuid)
    {
        return Role::where('uuid', $uuid)->firstOrFail();
    }

    /**
     * Finds a role by its name.
     *
     * @param string $name The name of the role.
     * @return Role|null The Role model instance or null if not found.
     */
    public function findByName(string $name)
    {
        return Role::where('name', $name)->first();
    }

    /**
     * Retrieves all records from the database.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function all()
    {
        return Role::all();
    }

    /**
     * Paginate the results of the query.
     *
     * @param int $perPage The number of items per page.
     * @throws Some_Exception_Class Description of exception.
     * @return \Illuminate\Contracts\Pagination\Paginator The paginated results.
     */
    public function paginate(?int $perPage = Constants::DEFAULT_PER_PAGE)
    {
        return Role::paginate($perPage);
    }
}
