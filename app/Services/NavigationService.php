<?php

namespace App\Services;

use App\Models\Category;
use App\Models\NavigationLink;
use App\Models\Page;
use App\Models\Setting;
use Illuminate\Support\Facades\Cache;

class NavigationService
{
    public static function getAllMenus(): array
    {
        return Cache::remember('navigation_menus', 3600, function (): array {
            $categories = Category::where('is_active', true)->where('show_in_menu', true)->orderBy('sort_order')->get(['id', 'name', 'slug']);
            $headerPages = Page::where('status', 'published')->where('show_in_header', true)->orderBy('sort_order')->get(['id', 'title', 'slug']);
            $footerPages = Page::where('status', 'published')->where('show_in_footer', true)->orderBy('sort_order')->get(['id', 'title', 'slug']);

            $customLinks = NavigationLink::active()->orderBy('sort_order')->get();

            $grouped = [];
            foreach (NavigationLink::LOCATIONS as $key => $label) {
                $grouped[$key] = $customLinks->where('location', $key)->values()->map(fn ($link) => [
                    'id' => $link->id,
                    'label' => $link->label,
                    'url' => $link->url,
                    'target' => $link->target,
                    'icon' => $link->icon,
                    'is_external' => $link->is_external,
                    'sort_order' => $link->sort_order,
                    'meta' => $link->meta,
                ])->toArray();
            }

            // Social profiles from Settings (group=social) + fallback to navigation_links location=social
            $socialProfiles = self::getSocialProfiles();
            $sharePlatforms = self::getSharePlatforms();

            return [
                'categories' => $categories->toArray(),
                'headerPages' => $headerPages->toArray(),
                'footerPages' => $footerPages->toArray(),
                'custom' => $grouped,
                'social' => $socialProfiles,
                'sharePlatforms' => $sharePlatforms,
                // Convenience merged menus for frontend
                'headerTop' => $grouped['header_top'] ?? [],
                'headerPrimary' => $grouped['header_primary'] ?? [],
                'headerMore' => $grouped['header_more'] ?? [],
                'footerExplore' => $grouped['footer_explore'] ?? [],
                'footerAbout' => $grouped['footer_about'] ?? [],
                'footerLegal' => $grouped['footer_legal'] ?? [],
            ];
        });
    }

    public static function getSocialProfiles(): array
    {
        $settings = [
            'facebook' => Setting::get('social', 'facebook_url', ''),
            'twitter' => Setting::get('social', 'twitter_url', Setting::get('social', 'x_url', '')),
            'x' => Setting::get('social', 'x_url', Setting::get('social', 'twitter_url', '')),
            'instagram' => Setting::get('social', 'instagram_url', ''),
            'linkedin' => Setting::get('social', 'linkedin_url', ''),
            'youtube' => Setting::get('social', 'youtube_url', ''),
            'tiktok' => Setting::get('social', 'tiktok_url', ''),
            'whatsapp' => Setting::get('social', 'whatsapp_url', ''),
            'telegram' => Setting::get('social', 'telegram_url', ''),
            'threads' => Setting::get('social', 'threads_url', ''),
            'pinterest' => Setting::get('social', 'pinterest_url', ''),
            'reddit' => Setting::get('social', 'reddit_url', ''),
        ];

        // Also merge navigation_links with location=social if they have urls
        $socialLinks = NavigationLink::active()->where('location', 'social')->orderBy('sort_order')->get();
        foreach ($socialLinks as $link) {
            $key = strtolower($link->label);
            // map label to key if not already set
            if (empty($settings[$key] ?? '')) {
                $settings[$key] = $link->url;
            }
        }

        // Filter empty and map to list for frontend
        $list = [];
        foreach ($settings as $platform => $url) {
            if (! empty($url)) {
                $list[] = ['platform' => $platform, 'url' => $url, 'label' => ucfirst($platform)];
            }
        }

        return $list;
    }

    public static function getSharePlatforms(): array
    {
        $available = ['facebook', 'twitter', 'x', 'linkedin', 'whatsapp', 'telegram', 'reddit', 'pinterest', 'email', 'copy'];
        $enabled = Setting::get('social', 'share_platforms', null);
        if (is_string($enabled)) {
            $decoded = json_decode($enabled, true);
            if (json_last_error() === JSON_ERROR_NONE) {
                $enabled = $decoded;
            } else {
                $enabled = array_filter(array_map('trim', explode(',', $enabled)));
            }
        }
        if (! is_array($enabled) || empty($enabled)) {
            // default: all major platforms
            $enabled = ['facebook', 'twitter', 'linkedin', 'whatsapp', 'telegram', 'email', 'copy'];
        }

        // Normalize x/twitter
        $enabled = array_map(fn ($p) => strtolower($p) === 'x' ? 'twitter' : strtolower($p), $enabled);

        return array_values(array_intersect($available, $enabled));
    }

    public static function clearCache(): void
    {
        Cache::forget('navigation_menus');
        Cache::forget('shared_categories');
        Cache::forget('shared_footer_pages');
        Cache::forget('shared_trending_topics');
    }
}
