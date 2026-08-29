<?php

namespace Database\Factories;

use App\Enums\UserStatus;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    protected $model = User::class;

    protected static ?string $password;

    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'username' => fake()->unique()->userName(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'bio' => fake()->optional()->paragraph(),
            'avatar' => null,
            'cover_image' => null,
            'website' => fake()->optional()->url(),
            'location' => fake()->optional()->city(),
            'status' => UserStatus::Active,
            'timezone' => 'UTC',
            'locale' => 'en',
            'email_notifications' => true,
            'push_notifications' => true,
            'newsletter_subscribed' => fake()->boolean(30),
            'remember_token' => Str::random(10),
            'two_factor_secret' => null,
            'two_factor_recovery_codes' => null,
            'two_factor_confirmed_at' => null,
        ];
    }

    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    public function withTwoFactor(): static
    {
        return $this->state(fn (array $attributes) => [
            'two_factor_secret' => encrypt('secret'),
            'two_factor_recovery_codes' => encrypt(json_encode(['recovery-code-1'])),
            'two_factor_confirmed_at' => now(),
        ]);
    }

    public function admin(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => 'Admin User',
            'username' => 'admin',
            'email' => 'admin@example.com',
        ]);
    }

    public function editor(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => 'Editor User',
            'username' => 'editor',
            'email' => 'editor@example.com',
        ]);
    }
}
