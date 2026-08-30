<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Cache;

class Category extends Model
{
    use HasFactory;

    protected static function booted(): void
    {
        static::saved(function () {
            Cache::forget('shared_categories');
            Cache::forget('navigation_menus');
            Cache::forget('seo_sitemap_xml');
        });
        static::deleted(function () {
            Cache::forget('shared_categories');
            Cache::forget('navigation_menus');
            Cache::forget('seo_sitemap_xml');
        });
    }

    protected $fillable = [
        'name', 'slug', 'description', 'image', 'color',
        'sort_order', 'is_active', 'show_in_menu',
        'meta_title', 'meta_description', 'meta_keywords',
    ];

    protected $casts = [
        'sort_order' => 'integer',
        'is_active' => 'boolean',
        'show_in_menu' => 'boolean',
    ];

    public function articles(): HasMany
    {
        return $this->hasMany(Article::class);
    }
}
