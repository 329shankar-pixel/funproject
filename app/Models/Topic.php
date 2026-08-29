<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Topic extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'slug', 'description', 'image', 'color',
        'sort_order', 'is_active', 'is_featured',
        'meta_title', 'meta_description',
        'followers_count', 'articles_count',
    ];

    protected $casts = [
        'sort_order' => 'integer',
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
        'followers_count' => 'integer',
        'articles_count' => 'integer',
    ];

    public function articles(): BelongsToMany
    {
        return $this->belongsToMany(Article::class, 'article_topic');
    }

    public function followers(): BelongsToMany
    {
        return $this->morphToMany(User::class, 'followable', 'follows');
    }
}
