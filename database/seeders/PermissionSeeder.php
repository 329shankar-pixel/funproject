<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            // Articles
            ['name' => 'View Articles', 'slug' => 'articles.view', 'module' => 'articles'],
            ['name' => 'Create Articles', 'slug' => 'articles.create', 'module' => 'articles'],
            ['name' => 'Edit Articles', 'slug' => 'articles.edit', 'module' => 'articles'],
            ['name' => 'Delete Articles', 'slug' => 'articles.delete', 'module' => 'articles'],
            ['name' => 'Publish Articles', 'slug' => 'articles.publish', 'module' => 'articles'],
            ['name' => 'Review Articles', 'slug' => 'articles.review', 'module' => 'articles'],

            // Users
            ['name' => 'View Users', 'slug' => 'users.view', 'module' => 'users'],
            ['name' => 'Create Users', 'slug' => 'users.create', 'module' => 'users'],
            ['name' => 'Edit Users', 'slug' => 'users.edit', 'module' => 'users'],
            ['name' => 'Delete Users', 'slug' => 'users.delete', 'module' => 'users'],

            // Categories
            ['name' => 'Manage Categories', 'slug' => 'categories.manage', 'module' => 'categories'],

            // Topics
            ['name' => 'Manage Topics', 'slug' => 'topics.manage', 'module' => 'topics'],

            // Comments
            ['name' => 'Moderate Comments', 'slug' => 'comments.moderate', 'module' => 'comments'],

            // Settings
            ['name' => 'Manage Settings', 'slug' => 'settings.manage', 'module' => 'settings'],

            // Analytics
            ['name' => 'View Analytics', 'slug' => 'analytics.view', 'module' => 'analytics'],
        ];

        foreach ($permissions as $permission) {
            Permission::create($permission);
        }

        // Assign all permissions to super-admin
        $superAdmin = Role::where('slug', 'super-admin')->first();
        $superAdmin?->permissions()->attach(Permission::pluck('id'));

        // Assign editor permissions
        $editor = Role::where('slug', 'editor')->first();
        $editor?->permissions()->attach(
            Permission::whereIn('slug', [
                'articles.view', 'articles.create', 'articles.edit', 'articles.publish', 'articles.review',
                'comments.moderate', 'analytics.view',
            ])->pluck('id')
        );

        // Assign author permissions
        $author = Role::where('slug', 'author')->first();
        $author?->permissions()->attach(
            Permission::whereIn('slug', [
                'articles.view', 'articles.create', 'articles.edit',
            ])->pluck('id')
        );
    }
}
