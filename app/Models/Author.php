<?php

namespace App\Models;

use App\Enums\AuthorType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Author extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'name', 'username', 'bio', 'profile_image', 'cover_image',
        'email', 'website', 'social_links', 'expertise', 'type',
        'is_verified', 'is_active', 'articles_count', 'followers_count',
        'last_published_at',
    ];

    protected $casts = [
        'social_links' => 'array',
        'expertise' => 'array',
        'type' => AuthorType::class,
        'is_verified' => 'boolean',
        'is_active' => 'boolean',
        'articles_count' => 'integer',
        'followers_count' => 'integer',
        'last_published_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function articles(): HasMany
    {
        return $this->hasMany(Article::class);
    }
}
