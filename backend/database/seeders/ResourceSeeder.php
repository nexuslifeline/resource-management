<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Resource;
use App\Models\User;
use Carbon\Carbon;

class ResourceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();

        if ($users->isEmpty()) {
            $this->command->warn('No users found. Please run UserSeeder first.');
            return;
        }

        // Define resource templates for variety
        $resourceTemplates = [
            // Projects
            [
                'name' => 'Website Redesign Project',
                'description' => 'Complete redesign of the company website with modern UI/UX',
                'type' => 'project',
                'status' => 'in_progress',
                'priority' => 'high',
                'tags' => ['web', 'design', 'frontend'],
            ],
            [
                'name' => 'Mobile App Development',
                'description' => 'Develop native mobile application for iOS and Android',
                'type' => 'project',
                'status' => 'pending',
                'priority' => 'high',
                'tags' => ['mobile', 'app', 'development'],
            ],
            [
                'name' => 'E-commerce Platform',
                'description' => 'Build comprehensive e-commerce platform with payment integration',
                'type' => 'project',
                'status' => 'in_progress',
                'priority' => 'urgent',
                'tags' => ['ecommerce', 'payment', 'platform'],
            ],
            [
                'name' => 'CRM System Implementation',
                'description' => 'Implement customer relationship management system',
                'type' => 'project',
                'status' => 'completed',
                'priority' => 'medium',
                'tags' => ['crm', 'implementation', 'system'],
            ],
            [
                'name' => 'Cloud Migration Project',
                'description' => 'Migrate on-premise infrastructure to cloud services',
                'type' => 'project',
                'status' => 'pending',
                'priority' => 'high',
                'tags' => ['cloud', 'migration', 'infrastructure'],
            ],

            // Tasks
            [
                'name' => 'Database Migration',
                'description' => 'Migrate legacy database to new schema',
                'type' => 'task',
                'status' => 'pending',
                'priority' => 'medium',
                'tags' => ['database', 'migration', 'backend'],
            ],
            [
                'name' => 'Security Audit',
                'description' => 'Conduct security audit of all systems and applications',
                'type' => 'task',
                'status' => 'in_progress',
                'priority' => 'urgent',
                'tags' => ['security', 'audit'],
            ],
            [
                'name' => 'Code Review',
                'description' => 'Review pull requests and provide feedback',
                'type' => 'task',
                'status' => 'pending',
                'priority' => 'medium',
                'tags' => ['code', 'review', 'quality'],
            ],
            [
                'name' => 'Bug Fixes',
                'description' => 'Fix critical bugs in production environment',
                'type' => 'task',
                'status' => 'in_progress',
                'priority' => 'urgent',
                'tags' => ['bug', 'fix', 'production'],
            ],
            [
                'name' => 'Performance Optimization',
                'description' => 'Optimize application performance and reduce load times',
                'type' => 'task',
                'status' => 'completed',
                'priority' => 'medium',
                'tags' => ['performance', 'optimization'],
            ],

            // Inventory
            [
                'name' => 'Office Equipment Inventory',
                'description' => 'Update inventory of all office equipment and supplies',
                'type' => 'inventory',
                'status' => 'completed',
                'priority' => 'low',
                'tags' => ['inventory', 'equipment'],
            ],
            [
                'name' => 'IT Hardware Audit',
                'description' => 'Audit all IT hardware and software licenses',
                'type' => 'inventory',
                'status' => 'pending',
                'priority' => 'medium',
                'tags' => ['hardware', 'audit', 'licenses'],
            ],
            [
                'name' => 'Software License Renewal',
                'description' => 'Renew expiring software licenses and subscriptions',
                'type' => 'inventory',
                'status' => 'in_progress',
                'priority' => 'high',
                'tags' => ['software', 'licenses', 'renewal'],
            ],
            [
                'name' => 'Server Maintenance',
                'description' => 'Perform routine server maintenance and updates',
                'type' => 'inventory',
                'status' => 'pending',
                'priority' => 'medium',
                'tags' => ['server', 'maintenance'],
            ],
            [
                'name' => 'Network Equipment Check',
                'description' => 'Check and update network equipment configuration',
                'type' => 'inventory',
                'status' => 'completed',
                'priority' => 'low',
                'tags' => ['network', 'equipment'],
            ],

            // Documents
            [
                'name' => 'API Documentation',
                'description' => 'Create comprehensive API documentation for developers',
                'type' => 'document',
                'status' => 'pending',
                'priority' => 'medium',
                'tags' => ['documentation', 'api'],
            ],
            [
                'name' => 'User Manual',
                'description' => 'Write user manual for new software application',
                'type' => 'document',
                'status' => 'in_progress',
                'priority' => 'medium',
                'tags' => ['manual', 'user', 'documentation'],
            ],
            [
                'name' => 'Technical Specifications',
                'description' => 'Create technical specifications for new project',
                'type' => 'document',
                'status' => 'completed',
                'priority' => 'high',
                'tags' => ['specifications', 'technical'],
            ],
            [
                'name' => 'Project Proposal',
                'description' => 'Draft project proposal for client presentation',
                'type' => 'document',
                'status' => 'pending',
                'priority' => 'high',
                'tags' => ['proposal', 'client'],
            ],
            [
                'name' => 'Meeting Minutes',
                'description' => 'Document meeting minutes and action items',
                'type' => 'document',
                'status' => 'completed',
                'priority' => 'low',
                'tags' => ['meeting', 'minutes'],
            ],

            // Other
            [
                'name' => 'Team Training Session',
                'description' => 'Organize training session for new team members',
                'type' => 'other',
                'status' => 'pending',
                'priority' => 'medium',
                'tags' => ['training', 'team'],
            ],
            [
                'name' => 'Client Meeting',
                'description' => 'Schedule and prepare for client meeting',
                'type' => 'other',
                'status' => 'in_progress',
                'priority' => 'high',
                'tags' => ['client', 'meeting'],
            ],
            [
                'name' => 'Team Building Event',
                'description' => 'Plan and organize team building activities',
                'type' => 'other',
                'status' => 'pending',
                'priority' => 'low',
                'tags' => ['team', 'building'],
            ],
            [
                'name' => 'Conference Preparation',
                'description' => 'Prepare materials and presentations for conference',
                'type' => 'other',
                'status' => 'completed',
                'priority' => 'medium',
                'tags' => ['conference', 'presentation'],
            ],
            [
                'name' => 'Budget Planning',
                'description' => 'Plan and allocate budget for upcoming quarter',
                'type' => 'other',
                'status' => 'in_progress',
                'priority' => 'high',
                'tags' => ['budget', 'planning'],
            ],
        ];

        // Generate 50+ resources with variations
        $totalResources = 55; // Slightly more than 50 for good pagination testing
        $createdCount = 0;

        for ($i = 0; $i < $totalResources; $i++) {
            $template = $resourceTemplates[$i % count($resourceTemplates)];
            
            // Create variations of the template
            $resourceData = [
                'name' => $this->generateVariation($template['name'], $i),
                'description' => $this->generateVariation($template['description'], $i),
                'type' => $template['type'],
                'status' => $this->getRandomStatus(),
                'priority' => $this->getRandomPriority(),
                'due_date' => $this->getRandomDueDate(),
                'tags' => $template['tags'],
                'user_id' => $users->random()->id,
                'assigned_to' => $users->random()->id,
            ];

            Resource::create($resourceData);
            $createdCount++;
        }

        $this->command->info("Created {$createdCount} resources successfully!");
    }

    /**
     * Generate variations of text for diversity
     */
    private function generateVariation(string $text, int $index): string
    {
        $variations = [
            'Updated ' . $text,
            'Revised ' . $text,
            'Enhanced ' . $text,
            'New ' . $text,
            'Advanced ' . $text,
            'Improved ' . $text,
            'Optimized ' . $text,
            'Streamlined ' . $text,
            'Modernized ' . $text,
            'Refined ' . $text,
        ];

        return $variations[$index % count($variations)];
    }

    /**
     * Get random status with weighted distribution
     */
    private function getRandomStatus(): string
    {
        $statuses = [
            'pending' => 30,      // 30% chance
            'in_progress' => 40,  // 40% chance
            'completed' => 25,    // 25% chance
            'cancelled' => 5,     // 5% chance
        ];

        $random = rand(1, 100);
        $cumulative = 0;

        foreach ($statuses as $status => $weight) {
            $cumulative += $weight;
            if ($random <= $cumulative) {
                return $status;
            }
        }

        return 'pending';
    }

    /**
     * Get random priority with weighted distribution
     */
    private function getRandomPriority(): string
    {
        $priorities = [
            'low' => 20,      // 20% chance
            'medium' => 40,    // 40% chance
            'high' => 30,      // 30% chance
            'urgent' => 10,    // 10% chance
        ];

        $random = rand(1, 100);
        $cumulative = 0;

        foreach ($priorities as $priority => $weight) {
            $cumulative += $weight;
            if ($random <= $cumulative) {
                return $priority;
            }
        }

        return 'medium';
    }

    /**
     * Get random due date
     */
    private function getRandomDueDate(): ?Carbon
    {
        $random = rand(1, 100);
        
        if ($random <= 10) {
            return null; // 10% chance of no due date
        } elseif ($random <= 30) {
            return now()->subDays(rand(1, 30)); // 20% chance of overdue
        } elseif ($random <= 70) {
            return now()->addDays(rand(1, 60)); // 40% chance of upcoming
        } else {
            return now()->addDays(rand(61, 365)); // 30% chance of far future
        }
    }
} 