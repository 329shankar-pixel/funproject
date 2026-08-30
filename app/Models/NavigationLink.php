<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Cache;

class NavigationLink extends Model
{
    use HasFactory;

    protected $fillable = [
        'label', 'url', 'location', 'target', 'icon', 'parent_id', 'sort_order', 'is_active', 'is_external', 'meta',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'is_external' => 'boolean',
        'sort_order' => 'integer',
        'meta' => 'array',
    ];

    public const LOCATIONS = [
        'header_top' => 'Header Top Bar',
        'header_primary' => 'Header Primary Nav',
        'header_more' => 'Header More Dropdown',
        'header_masthead' => 'Header Masthead CTA',
        'mobile' => 'Mobile Drawer',
        'footer_explore' => 'Footer Explore',
        'footer_about' => 'Footer About',
        'footer_legal' => 'Footer Legal',
        'footer_social' => 'Footer Social',
        'social' => 'Social Profiles',
        'share' => 'Share Platforms',
    ];

    protected static function booted(): void
    {
        static::saved(fn () => Cache::forget('navigation_menus'));
        static::deleted(fn () => Cache::forget('navigation_menus'));
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(self::class, 'parent_id')->orderBy('sort_order');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeLocation($query, string $location)
    {
        return $query->where('location', $location);
    }
}
