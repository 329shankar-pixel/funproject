<?php

namespace Database\Seeders;

use App\Models\Topic;
use Illuminate\Database\Seeder;

class TopicSeeder extends Seeder
{
    public function run(): void
    {
        $topics = [
            ['name' => 'Artificial Intelligence', 'slug' => 'artificial-intelligence', 'is_featured' => true],
            ['name' => 'OpenAI', 'slug' => 'openai'],
            ['name' => 'Robotics', 'slug' => 'robotics'],
            ['name' => 'Cybersecurity', 'slug' => 'cybersecurity'],
            ['name' => 'Semiconductor', 'slug' => 'semiconductor'],
            ['name' => 'Programming', 'slug' => 'programming'],
            ['name' => 'Climate Change', 'slug' => 'climate-change', 'is_featured' => true],
            ['name' => 'Geopolitics', 'slug' => 'geopolitics', 'is_featured' => true],
            ['name' => 'Global Economy', 'slug' => 'global-economy'],
            ['name' => 'Startups', 'slug' => 'startups'],
            ['name' => 'Space Exploration', 'slug' => 'space-exploration'],
            ['name' => 'Public Health', 'slug' => 'public-health'],
            ['name' => 'Human Rights', 'slug' => 'human-rights'],
            ['name' => 'Digital Privacy', 'slug' => 'digital-privacy'],
            ['name' => 'Renewable Energy', 'slug' => 'renewable-energy'],
            ['name' => 'Blockchain', 'slug' => 'blockchain'],
            ['name' => 'Quantum Computing', 'slug' => 'quantum-computing'],
            ['name' => 'Mental Health', 'slug' => 'mental-health'],
            ['name' => 'Education Reform', 'slug' => 'education-reform'],
            ['name' => 'Social Media', 'slug' => 'social-media'],
        ];

        foreach ($topics as $topic) {
            Topic::create($topic);
        }
    }
}
