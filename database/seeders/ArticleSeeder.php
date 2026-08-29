<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\Topic;
use Illuminate\Database\Seeder;

class ArticleSeeder extends Seeder
{
    public function run(): void
    {
        $articles = Article::factory(50)->create();

        $topics = Topic::all();

        foreach ($articles as $article) {
            $article->topics()->attach(
                $topics->random(rand(1, 4))->pluck('id')->toArray()
            );
        }

        // Mark a few as featured
        Article::inRandomOrder()->limit(5)->update(['is_featured' => true]);

        // Mark a few as trending
        Article::inRandomOrder()->limit(10)->update(['is_trending' => true]);
    }
}
