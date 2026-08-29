<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Politics', 'slug' => 'politics', 'description' => 'Political news and analysis', 'sort_order' => 1],
            ['name' => 'World', 'slug' => 'world', 'description' => 'International affairs', 'sort_order' => 2],
            ['name' => 'Technology', 'slug' => 'technology', 'description' => 'Tech news and innovation', 'sort_order' => 3],
            ['name' => 'AI', 'slug' => 'ai', 'description' => 'Artificial intelligence', 'sort_order' => 4],
            ['name' => 'Business', 'slug' => 'business', 'description' => 'Business and markets', 'sort_order' => 5],
            ['name' => 'Economy', 'slug' => 'economy', 'description' => 'Economic analysis', 'sort_order' => 6],
            ['name' => 'Science', 'slug' => 'science', 'description' => 'Scientific discoveries', 'sort_order' => 7],
            ['name' => 'Education', 'slug' => 'education', 'description' => 'Education and learning', 'sort_order' => 8],
            ['name' => 'Environment', 'slug' => 'environment', 'description' => 'Climate and environment', 'sort_order' => 9],
            ['name' => 'Culture', 'slug' => 'culture', 'description' => 'Arts and culture', 'sort_order' => 10],
            ['name' => 'History', 'slug' => 'history', 'description' => 'Historical perspectives', 'sort_order' => 11],
            ['name' => 'Society', 'slug' => 'society', 'description' => 'Social issues', 'sort_order' => 12],
            ['name' => 'Lifestyle', 'slug' => 'lifestyle', 'description' => 'Lifestyle and wellness', 'sort_order' => 13],
            ['name' => 'Opinion', 'slug' => 'opinion', 'description' => 'Opinion and editorials', 'sort_order' => 14],
            ['name' => 'Analysis', 'slug' => 'analysis', 'description' => 'In-depth analysis', 'sort_order' => 15],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
