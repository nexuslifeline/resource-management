<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            [
                'name' => 'Administrator',
                'description' => 'Full system access with administrative privileges',
            ],
            [
                'name' => 'Regular User',
                'description' => 'Standard user with limited access',
            ],
        ];

        foreach ($roles as $role) {
            Role::create($role);
        }
    }
} 