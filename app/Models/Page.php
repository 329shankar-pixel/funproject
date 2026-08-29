<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Page extends Model
{
    use HasFactory;

    protected static function booted(): void
    {
        static::saved(fn () => Cache::forget('shared_footer_pages'));
        static::deleted(fn () => Cache::forget('shared_footer_pages'));
    }

    protected $fillable = [
        'title', 'slug', 'excerpt', 'body', 'featured_image',
        'status', 'template', 'meta_title', 'meta_description',
        'sort_order', 'show_in_footer', 'show_in_header',
    ];

    protected $casts = [
        'sort_order' => 'integer',
        'show_in_footer' => 'boolean',
        'show_in_header' => 'boolean',
    ];
}
