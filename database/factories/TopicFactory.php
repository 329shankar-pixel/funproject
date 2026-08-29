<?php

namespace Database\Factories;

use App\Models\Topic;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class TopicFactory extends Factory
{
    protected $model = Topic::class;

    public function definition(): array
    {
        $name = fake()->unique()->words(2, true);

        return [
            'name' => ucfirst($name),
            'slug' => Str::slug($name),
            'description' => fake()->optional()->sentence(),
            'image' => null,
            'color' => fake()->hexColor(),
            'sort_order' => fake()->numberBetween(0, 100),
            'is_active' => true,
            'is_featured' => fake()->boolean(20),
            'meta_title' => null,
            'meta_description' => null,
            'followers_count' => fake()->numberBetween(0, 5000),
            'articles_count' => fake()->numberBetween(0, 200),
        ];
    }
}
