<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Resource;
use App\Models\User;

class ResourceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();

        $resources = [
            [
                'name' => 'Website Redesign Project',
                'description' => 'Complete redesign of the company website with modern UI/UX',
                'type' => 'project',
                'status' => 'in_progress',
                'priority' => 'high',
                'due_date' => now()->addDays(30),
                'tags' => ['web', 'design', 'frontend'],
            ],
            [
                'name' => 'Database Migration',
                'description' => 'Migrate legacy database to new schema',
                'type' => 'task',
                'status' => 'pending',
                'priority' => 'medium',
                'due_date' => now()->addDays(14),
                'tags' => ['database', 'migration', 'backend'],
            ],
            [
                'name' => 'Office Equipment Inventory',
                'description' => 'Update inventory of all office equipment and supplies',
                'type' => 'inventory',
                'status' => 'completed',
                'priority' => 'low',
                'due_date' => now()->subDays(5),
                'tags' => ['inventory', 'equipment'],
            ],
            [
                'name' => 'API Documentation',
                'description' => 'Create comprehensive API documentation for developers',
                'type' => 'document',
                'status' => 'pending',
                'priority' => 'medium',
                'due_date' => now()->addDays(21),
                'tags' => ['documentation', 'api'],
            ],
            [
                'name' => 'Security Audit',
                'description' => 'Conduct security audit of all systems and applications',
                'type' => 'task',
                'status' => 'in_progress',
                'priority' => 'urgent',
                'due_date' => now()->addDays(7),
                'tags' => ['security', 'audit'],
            ],
            [
                'name' => 'Team Training Session',
                'description' => 'Organize training session for new team members',
                'type' => 'other',
                'status' => 'pending',
                'priority' => 'medium',
                'due_date' => now()->addDays(10),
                'tags' => ['training', 'team'],
            ],
        ];

        foreach ($resources as $index => $resourceData) {
            $user = $users->random();
            $assignedUser = $users->random();

            Resource::create([
                ...$resourceData,
                'user_id' => $user->id,
                'assigned_to' => $assignedUser->id,
            ]);
        }
    }
} 