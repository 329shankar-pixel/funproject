<?php

namespace Database\Factories;

use App\Enums\AuthorType;
use App\Models\Author;
use Illuminate\Database\Eloquent\Factories\Factory;

class AuthorFactory extends Factory
{
    protected $model = Author::class;

    public function definition(): array
    {
        $name = fake()->name();

        return [
            'user_id' => null,
            'name' => $name,
            'username' => fake()->unique()->userName(),
            'bio' => fake()->paragraph(),
            'profile_image' => null,
            'cover_image' => null,
            'email' => fake()->unique()->safeEmail(),
            'website' => fake()->optional()->url(),
            'social_links' => [
                'twitter' => fake()->optional()->url(),
                'linkedin' => fake()->optional()->url(),
            ],
            'expertise' => fake()->words(3),
            'type' => fake()->randomElement(AuthorType::cases()),
            'is_verified' => fake()->boolean(40),
            'is_active' => true,
            'articles_count' => fake()->numberBetween(0, 100),
            'followers_count' => fake()->numberBetween(0, 5000),
            'last_published_at' => fake()->optional()->dateTimeBetween('-1 year', 'now'),
        ];
    }
}
