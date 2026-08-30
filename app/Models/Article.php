<?php

namespace App\Models;

use App\Enums\ArticleStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Support\Facades\Cache;

class Article extends Model
{
    use HasFactory;

    protected static function booted(): void
    {
        static::saved(fn () => Cache::forget('seo_sitemap_xml'));
        static::deleted(fn () => Cache::forget('seo_sitemap_xml'));
    }

    protected $fillable = [
        'uuid', 'title', 'slug', 'subtitle', 'excerpt', 'body',
        'featured_image', 'gallery', 'category_id', 'author_id',
        'status', 'visibility', 'published_at', 'scheduled_at',
        'reading_time', 'view_count', 'share_count', 'save_count', 'comment_count',
        'seo_title', 'seo_description', 'canonical_url', 'og_image', 'structured_data',
        'is_featured', 'is_breaking', 'is_trending', 'is_sponsored',
        'is_opinion', 'is_analysis', 'allow_comments',
        'published_by', 'reviewed_by', 'reviewed_at', 'editorial_notes', 'correction',
    ];

    protected $casts = [
        'status' => ArticleStatus::class,
        'gallery' => 'array',
        'structured_data' => 'array',
        'published_at' => 'datetime',
        'scheduled_at' => 'datetime',
        'reviewed_at' => 'datetime',
        'reading_time' => 'integer',
        'view_count' => 'integer',
        'share_count' => 'integer',
        'save_count' => 'integer',
        'comment_count' => 'integer',
        'is_featured' => 'boolean',
        'is_breaking' => 'boolean',
        'is_trending' => 'boolean',
        'is_sponsored' => 'boolean',
        'is_opinion' => 'boolean',
        'is_analysis' => 'boolean',
        'allow_comments' => 'boolean',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(Author::class);
    }

    public function topics(): BelongsToMany
    {
        return $this->belongsToMany(Topic::class, 'article_topic');
    }

    public function revisions(): HasMany
    {
        return $this->hasMany(ArticleRevision::class);
    }

    public function bookmarks(): HasMany
    {
        return $this->hasMany(Bookmark::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    public function views(): HasMany
    {
        return $this->hasMany(ArticleView::class);
    }

    public function readingSessions(): HasMany
    {
        return $this->hasMany(ReadingSession::class);
    }

    public function media(): MorphMany
    {
        return $this->morphMany(Media::class, 'mediable');
    }

    public function seoMetadata(): MorphMany
    {
        return $this->morphMany(SeoMetadata::class, 'seoble');
    }

    public function scopePublished($query)
    {
        return $query->where('status', ArticleStatus::Published)
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now());
    }

    public function scopeFeatured($query)
    {
        return $query->published()->where('is_featured', true);
    }

    public function scopeBreaking($query)
    {
        return $query->published()->where('is_breaking', true);
    }

    public function scopeTrending($query)
    {
        return $query->published()->where('is_trending', true);
    }

    public function scopeLatest($query)
    {
        return $query->published()->orderBy('published_at', 'desc');
    }
}
