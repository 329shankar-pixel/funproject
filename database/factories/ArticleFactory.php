<?php

namespace Database\Factories;

use App\Enums\ArticleStatus;
use App\Models\Article;
use App\Models\Author;
use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ArticleFactory extends Factory
{
    protected $model = Article::class;

    public function definition(): array
    {
        $title = fake()->sentence();
        $body = collect(range(1, fake()->numberBetween(5, 15)))
            ->map(fn () => '<p>'.fake()->paragraph(fake()->numberBetween(3, 8)).'</p>')
            ->implode("\n");

        return [
            'uuid' => Str::uuid(),
            'title' => $title,
            'slug' => Str::slug($title),
            'subtitle' => fake()->optional()->sentence(),
            'excerpt' => fake()->paragraph(2),
            'body' => $body,
            'featured_image' => null,
            'gallery' => null,
            'category_id' => Category::factory(),
            'author_id' => Author::factory(),
            'status' => ArticleStatus::Published,
            'visibility' => 'public',
            'published_at' => fake()->dateTimeBetween('-6 months', 'now'),
            'scheduled_at' => null,
            'reading_time' => fake()->numberBetween(3, 20),
            'view_count' => fake()->numberBetween(0, 50000),
            'share_count' => fake()->numberBetween(0, 5000),
            'save_count' => fake()->numberBetween(0, 2000),
            'comment_count' => fake()->numberBetween(0, 500),
            'seo_title' => null,
            'seo_description' => null,
            'canonical_url' => null,
            'og_image' => null,
            'structured_data' => null,
            'is_featured' => fake()->boolean(10),
            'is_breaking' => fake()->boolean(2),
            'is_trending' => fake()->boolean(5),
            'is_sponsored' => fake()->boolean(3),
            'is_opinion' => fake()->boolean(15),
            'is_analysis' => fake()->boolean(10),
            'allow_comments' => true,
            'published_by' => null,
            'reviewed_by' => null,
            'reviewed_at' => null,
            'editorial_notes' => null,
            'correction' => null,
        ];
    }

    public function draft(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => ArticleStatus::Draft,
            'published_at' => null,
        ]);
    }

    public function featured(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_featured' => true,
        ]);
    }
}
