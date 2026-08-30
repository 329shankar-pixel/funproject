<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Category;
use App\Models\Page;
use App\Models\Setting;
use App\Models\Topic;
use App\Services\SeoService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;

class SeoController extends Controller
{
    public function robots(Request $request): Response
    {
        $settings = SeoService::getGlobalSettings();
        $robots = SettingMetaHelper($settings);

        $content = Cache::remember('seo_robots_txt', 3600, function () use ($settings): string {
            $disallow = SettingDisallow($settings);
            $sitemapUrl = url('/sitemap.xml');
            $robotsDefault = $settings['robots'] ?? 'index, follow';

            $lines = [];
            $lines[] = 'User-agent: *';
            if (str_contains(strtolower($robotsDefault), 'noindex')) {
                $lines[] = 'Disallow: /';
            } else {
                if (! empty($disallow)) {
                    foreach ($disallow as $path) {
                        $lines[] = "Disallow: {$path}";
                    }
                } else {
                    $lines[] = 'Disallow: /admin/';
                    $lines[] = 'Disallow: /login';
                    $lines[] = 'Disallow: /register';
                }
                $lines[] = 'Allow: /';
            }
            $lines[] = '';
            $lines[] = "Sitemap: {$sitemapUrl}";
            // Extra custom robots from setting if present
            $custom = Setting::get('seo', 'robots_custom', '');
            if (! empty($custom)) {
                $lines[] = '';
                $lines[] = $custom;
            }

            return implode("\n", $lines);
        });

        // If user customized full robots.txt via setting
        $fullOverride = Setting::get('seo', 'robots_txt_override', '');
        if (! empty($fullOverride)) {
            $content = $fullOverride;
        }

        return response($content, 200)->header('Content-Type', 'text/plain');
    }

    public function sitemap(Request $request): Response
    {
        $settings = SeoService::getGlobalSettings();
        if (! ($settings['sitemap_enabled'] ?? true)) {
            abort(404);
        }

        $xml = Cache::remember('seo_sitemap_xml', 3600, function (): string {
            $urls = [];

            $urls[] = $this->urlEntry(url('/'), now(), 'daily', '1.0');

            Article::published()->select(['slug', 'updated_at', 'published_at'])->orderByDesc('updated_at')->limit(5000)->chunk(500, function ($articles) use (&$urls): void {
                foreach ($articles as $article) {
                    $urls[] = $this->urlEntry(url('/article/'.$article->slug), $article->updated_at ?? $article->published_at, 'weekly', '0.8');
                }
            });

            Category::where('is_active', true)->select(['slug', 'updated_at'])->get()->each(function ($cat) use (&$urls): void {
                $urls[] = $this->urlEntry(url('/category/'.$cat->slug), $cat->updated_at, 'weekly', '0.6');
            });

            Topic::where('is_active', true)->select(['slug', 'updated_at'])->get()->each(function ($topic) use (&$urls): void {
                $urls[] = $this->urlEntry(url('/topic/'.$topic->slug), $topic->updated_at, 'weekly', '0.5');
            });

            Page::where('status', 'published')->select(['slug', 'updated_at'])->get()->each(function ($page) use (&$urls): void {
                $urls[] = $this->urlEntry(url('/page/'.$page->slug), $page->updated_at, 'monthly', '0.5');
            });

            $xml = '<?xml version="1.0" encoding="UTF-8"?>'."\n";
            $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'."\n";
            foreach ($urls as $entry) {
                $xml .= "  <url>\n";
                $xml .= "    <loc>{$entry['loc']}</loc>\n";
                $xml .= "    <lastmod>{$entry['lastmod']}</lastmod>\n";
                $xml .= "    <changefreq>{$entry['changefreq']}</changefreq>\n";
                $xml .= "    <priority>{$entry['priority']}</priority>\n";
                $xml .= "  </url>\n";
            }
            $xml .= '</urlset>';

            return $xml;
        });

        return response($xml, 200)->header('Content-Type', 'text/xml');
    }

    public function sitemapIndex(Request $request): Response
    {
        return $this->sitemap($request);
    }

    public function adsTxt(Request $request): Response
    {
        $content = Setting::get('monetization', 'ads_txt_content', '');
        $publisherId = Setting::get('monetization', 'adsense_publisher_id', '');

        if (empty($content) && ! empty($publisherId)) {
            $pub = $publisherId;
            if (! str_starts_with($pub, 'pub-')) {
                $pub = 'pub-'.ltrim($pub, 'ca-pub-');
                $pub = str_replace('ca-pub-', 'pub-', $pub);
            } else {
                $pub = str_replace('ca-pub-', 'pub-', $pub);
            }
            // fallback to just publisher line
            $content = "google.com, {$pub}, DIRECT, f08c47fec0942fa0";
        }

        if (empty($content)) {
            abort(404);
        }

        return response($content, 200)->header('Content-Type', 'text/plain');
    }

    private function urlEntry(string $loc, $lastmod, string $changefreq, string $priority): array
    {
        return [
            'loc' => e($loc),
            'lastmod' => $lastmod ? Carbon::parse($lastmod)->toW3cString() : now()->toW3cString(),
            'changefreq' => $changefreq,
            'priority' => $priority,
        ];
    }
}

function SettingDisallow(array $settings): array
{
    $paths = Setting::get('seo', 'robots_disallow_paths', null);
    if (is_string($paths) && ! empty($paths)) {
        $decoded = json_decode($paths, true);
        if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
            return $decoded;
        }

        return array_filter(array_map('trim', explode(',', $paths)));
    }
    if (is_array($paths)) {
        return $paths;
    }

    return [];
}

function SettingMetaHelper(array $settings): string
{
    return $settings['robots'] ?? 'index, follow';
}
