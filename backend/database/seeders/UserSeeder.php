<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => bcrypt('password'),
            'email_verified_at' => now(),
        ]);

        $adminRole = Role::where('name', 'Administrator')->first();
        $admin->roles()->attach($adminRole->id);

        // Create regular users
        $regularUsers = [
            [
                'name' => 'John Doe',
                'email' => 'john@example.com',
            ],
            [
                'name' => 'Jane Smith',
                'email' => 'jane@example.com',
            ],
            [
                'name' => 'Bob Johnson',
                'email' => 'bob@example.com',
            ],
        ];

        $regularRole = Role::where('name', 'Regular User')->first();

        foreach ($regularUsers as $userData) {
            $user = User::create([
                ...$userData,
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ]);

            $user->roles()->attach($regularRole->id);
        }
    }
} 