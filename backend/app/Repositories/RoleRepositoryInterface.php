<?php

namespace App\Repositories;

interface RoleRepositoryInterface
{
    public function create(array $data);

    public function update(string $uuid, array $data);

    public function delete(string $uuid);

    public function find(string $uuid);

    public function findByUuid(string $uuid);

    public function findByName(string $name);

    public function all();

    public function paginate(?int $perPage = null);
}
