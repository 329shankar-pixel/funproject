<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class CategoryFactory extends Factory
{
    protected $model = Category::class;

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
            'show_in_menu' => true,
            'meta_title' => null,
            'meta_description' => null,
            'meta_keywords' => null,
        ];
    }
}
