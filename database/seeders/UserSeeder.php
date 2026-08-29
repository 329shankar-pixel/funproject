<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin
        $admin = User::factory()->admin()->create([
            'password' => Hash::make('admin123'),
        ]);
        $admin->roles()->attach(Role::where('slug', 'super-admin')->first()?->id);

        // Create editor
        $editor = User::factory()->editor()->create([
            'password' => Hash::make('editor123'),
        ]);
        $editor->roles()->attach(Role::where('slug', 'editor')->first()?->id);

        // Create regular users
        User::factory(10)->create();
    }
}
