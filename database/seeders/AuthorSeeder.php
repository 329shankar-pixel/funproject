<?php

namespace Database\Seeders;

use App\Enums\AuthorType;
use App\Models\Author;
use Illuminate\Database\Seeder;

class AuthorSeeder extends Seeder
{
    public function run(): void
    {
        $authors = [
            ['name' => 'Sarah Mitchell', 'username' => 'sarah-mitchell', 'type' => AuthorType::Editor, 'is_verified' => true],
            ['name' => 'James Chen', 'username' => 'james-chen', 'type' => AuthorType::Staff, 'is_verified' => true],
            ['name' => 'Aisha Patel', 'username' => 'aisha-patel', 'type' => AuthorType::Columnist, 'is_verified' => true],
            ['name' => 'Marcus Johnson', 'username' => 'marcus-johnson', 'type' => AuthorType::Contributor],
            ['name' => 'Elena Rodriguez', 'username' => 'elena-rodriguez', 'type' => AuthorType::Researcher, 'is_verified' => true],
            ['name' => 'David Kim', 'username' => 'david-kim', 'type' => AuthorType::Staff],
            ['name' => 'Priya Sharma', 'username' => 'priya-sharma', 'type' => AuthorType::Columnist],
            ['name' => 'Thomas Wright', 'username' => 'thomas-wright', 'type' => AuthorType::Guest],
        ];

        foreach ($authors as $authorData) {
            Author::factory()->create($authorData);
        }
    }
}
