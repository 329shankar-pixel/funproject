<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            ['name' => 'Super Admin', 'slug' => 'super-admin', 'description' => 'Full system access', 'sort_order' => 1],
            ['name' => 'Admin', 'slug' => 'admin', 'description' => 'Platform management', 'sort_order' => 2],
            ['name' => 'Editor', 'slug' => 'editor', 'description' => 'Content review and publishing', 'sort_order' => 3],
            ['name' => 'Author', 'slug' => 'author', 'description' => 'Create and edit own articles', 'sort_order' => 4],
            ['name' => 'Contributor', 'slug' => 'contributor', 'description' => 'Submit content for review', 'sort_order' => 5],
            ['name' => 'Moderator', 'slug' => 'moderator', 'description' => 'Comments and reports moderation', 'sort_order' => 6],
            ['name' => 'User', 'slug' => 'user', 'description' => 'Standard reader', 'sort_order' => 7],
        ];

        foreach ($roles as $role) {
            Role::create($role);
        }
    }
}
