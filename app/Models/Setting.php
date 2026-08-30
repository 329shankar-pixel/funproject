<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Setting extends Model
{
    use HasFactory;

    protected static function booted(): void
    {
        static::saved(function ($model): void {
            Cache::forget('site_settings');
            Cache::forget('seo_global_settings');
            Cache::forget('navigation_menus');
            if (in_array($model->group, ['seo', 'verification', 'analytics', 'monetization', 'social', 'navigation'], true)) {
                Cache::forget('seo_robots_txt');
                Cache::forget('seo_sitemap_xml');
            }
        });
        static::deleted(function ($model): void {
            Cache::forget('site_settings');
            Cache::forget('seo_global_settings');
            Cache::forget('navigation_menus');
            if (in_array($model->group, ['seo', 'verification', 'analytics', 'monetization', 'social', 'navigation'], true)) {
                Cache::forget('seo_robots_txt');
                Cache::forget('seo_sitemap_xml');
            }
        });
    }

    protected $fillable = ['group', 'key', 'value', 'type', 'description', 'is_public'];

    protected $casts = [
        'is_public' => 'boolean',
    ];

    public static function get(string $group, string $key, mixed $default = null): mixed
    {
        $setting = self::where('group', $group)->where('key', $key)->first();

        if (! $setting) {
            return $default;
        }

        return match ($setting->type) {
            'boolean' => (bool) $setting->value,
            'integer' => (int) $setting->value,
            'float' => (float) $setting->value,
            'json' => json_decode($setting->value, true),
            default => $setting->value,
        };
    }

    public static function set(string $group, string $key, mixed $value, string $type = 'string'): void
    {
        self::updateOrCreate(
            ['group' => $group, 'key' => $key],
            ['value' => is_array($value) ? json_encode($value) : (string) $value, 'type' => $type]
        );
    }
}
