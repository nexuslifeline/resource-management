<?php

namespace App\Providers;

use App\Repositories\RoleRepository;
use App\Repositories\UserRepository;
use App\Repositories\ResourceRepository;
use Illuminate\Support\ServiceProvider;
use App\Repositories\RoleRepositoryInterface;
use App\Repositories\UserRepositoryInterface;
use App\Repositories\ResourceRepositoryInterface;

class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->bind(RoleRepositoryInterface::class, RoleRepository::class);
        $this->app->bind(UserRepositoryInterface::class, UserRepository::class);
        $this->app->bind(ResourceRepositoryInterface::class, ResourceRepository::class);
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
