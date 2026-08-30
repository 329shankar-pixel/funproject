<?php

namespace App\Services;

use App\Models\Article;
use App\Models\Category;
use App\Models\Page;
use App\Models\Setting;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class SeoService
{
    public static function getGlobalSettings(): array
    {
        return Cache::remember('seo_global_settings', 3600, function (): array {
            $siteLogo = Setting::get('branding', 'site_logo', null);
            $siteLogoUrl = $siteLogo ? asset('storage/'.$siteLogo) : null;
            // Preferred OG fallback is site logo, then legacy og_image, then bundled default for publiccenter.com.np
            $ogImage = Setting::get('seo', 'og_image', Setting::get('seo', 'og_image_default', ''));
            if (empty($ogImage) && $siteLogoUrl) {
                $ogImage = $siteLogoUrl;
            }
            if (empty($ogImage)) {
                $ogImage = asset('og-image.png');
            }
            // Ensure absolute URL for social crawlers
            if ($ogImage && ! str_starts_with($ogImage, 'http')) {
                $ogImage = asset(ltrim($ogImage, '/'));
            }

            $seo = [
                'meta_title_template' => Setting::get('seo', 'meta_title_template', '{title} | {site_name}'),
                'meta_description' => Setting::get('seo', 'meta_description', Setting::get('seo', 'meta_description_default', 'A premium digital publication delivering insightful analysis, breaking news, and in-depth reporting.')),
                'meta_keywords' => Setting::get('seo', 'meta_keywords', Setting::get('seo', 'meta_keywords_default', 'news, editorial, analysis, technology, politics')),
                'robots' => Setting::get('seo', 'robots', Setting::get('seo', 'robots_default', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1')),
                'canonical_enabled' => (bool) Setting::get('seo', 'canonical_enabled', true),
                'og_site_name' => Setting::get('seo', 'og_site_name', Setting::get('branding', 'site_name', 'Public Center')),
                'og_image' => $ogImage,
                'og_type' => Setting::get('seo', 'og_type', 'website'),
                'twitter_card' => Setting::get('seo', 'twitter_card', 'summary_large_image'),
                'twitter_site' => Setting::get('seo', 'twitter_site', ''),
                'twitter_creator' => Setting::get('seo', 'twitter_creator', ''),
                'json_ld_enabled' => (bool) Setting::get('seo', 'json_ld_enabled', true),
                'json_ld_organization_name' => Setting::get('seo', 'json_ld_organization_name', Setting::get('branding', 'site_name', 'Public Center')),
                'json_ld_organization_logo' => Setting::get('seo', 'json_ld_organization_logo', ''),
                'json_ld_type' => Setting::get('seo', 'json_ld_type', 'NewsArticle'),
                'breadcrumbs_enabled' => (bool) Setting::get('seo', 'breadcrumbs_enabled', true),
                'sitemap_enabled' => (bool) Setting::get('seo', 'sitemap_enabled', true),
                'rss_enabled' => (bool) Setting::get('seo', 'rss_enabled', true),
                'hreflang_enabled' => (bool) Setting::get('seo', 'hreflang_enabled', false),
                'hreflang_default' => Setting::get('seo', 'hreflang_default', 'en'),
                'site_name' => Setting::get('branding', 'site_name', 'Public Center'),
                'site_tagline' => Setting::get('branding', 'site_tagline', "Nepal's Trusted News & Public Affairs"),
            ];

            $verification = [
                'google_site_verification' => Setting::get('verification', 'google_site_verification', ''),
                'bing_site_verification' => Setting::get('verification', 'bing_site_verification', ''),
                'yandex_verification' => Setting::get('verification', 'yandex_verification', ''),
                'pinterest_verification' => Setting::get('verification', 'pinterest_verification', ''),
                'facebook_domain_verification' => Setting::get('verification', 'facebook_domain_verification', ''),
                'google_tag_verification_alt' => Setting::get('verification', 'google_tag_verification_alt', ''),
            ];

            $analytics = [
                'google_analytics_id' => Setting::get('analytics', 'google_analytics_id', ''),
                'google_tag_manager_id' => Setting::get('analytics', 'google_tag_manager_id', ''),
                'bing_clarity_id' => Setting::get('analytics', 'bing_clarity_id', ''),
                'facebook_pixel_id' => Setting::get('analytics', 'facebook_pixel_id', ''),
                'plausible_domain' => Setting::get('analytics', 'plausible_domain', ''),
                'plausible_script' => Setting::get('analytics', 'plausible_script', ''),
                'umami_website_id' => Setting::get('analytics', 'umami_website_id', ''),
                'umami_script_url' => Setting::get('analytics', 'umami_script_url', ''),
                'hotjar_id' => Setting::get('analytics', 'hotjar_id', ''),
                'custom_head_code' => Setting::get('analytics', 'custom_head_code', ''),
                'custom_body_start_code' => Setting::get('analytics', 'custom_body_start_code', ''),
                'custom_body_end_code' => Setting::get('analytics', 'custom_body_end_code', ''),
            ];

            $monetization = [
                'adsense_enabled' => (bool) Setting::get('monetization', 'adsense_enabled', false),
                'adsense_publisher_id' => Setting::get('monetization', 'adsense_publisher_id', ''),
                'adsense_auto_ads_enabled' => (bool) Setting::get('monetization', 'adsense_auto_ads_enabled', true),
                'adsense_script' => Setting::get('monetization', 'adsense_script', ''),
                'ads_txt_content' => Setting::get('monetization', 'ads_txt_content', ''),
                'ad_header_code' => Setting::get('monetization', 'ad_header_code', ''),
                'ad_footer_code' => Setting::get('monetization', 'ad_footer_code', ''),
                'ad_sidebar_code' => Setting::get('monetization', 'ad_sidebar_code', ''),
                'ad_in_article_code' => Setting::get('monetization', 'ad_in_article_code', ''),
                'ad_between_articles_code' => Setting::get('monetization', 'ad_between_articles_code', ''),
                'ad_in_feed_code' => Setting::get('monetization', 'ad_in_feed_code', ''),
                'ad_anchor_code' => Setting::get('monetization', 'ad_anchor_code', ''),
                'ad_vignette_enabled' => (bool) Setting::get('monetization', 'ad_vignette_enabled', false),
                'carbon_ads_code' => Setting::get('monetization', 'carbon_ads_code', ''),
                'buysellads_code' => Setting::get('monetization', 'buysellads_code', ''),
                'amazon_associates_id' => Setting::get('monetization', 'amazon_associates_id', ''),
                'ezoic_enabled' => (bool) Setting::get('monetization', 'ezoic_enabled', false),
                'mediavine_enabled' => (bool) Setting::get('monetization', 'mediavine_enabled', false),
                'affiliate_disclosure_enabled' => (bool) Setting::get('monetization', 'affiliate_disclosure_enabled', false),
                'affiliate_disclosure_text' => Setting::get('monetization', 'affiliate_disclosure_text', 'This post may contain affiliate links. We may earn a commission if you purchase through these links.'),
                'consent_mode_enabled' => (bool) Setting::get('monetization', 'consent_mode_enabled', false),
                'consent_banner_code' => Setting::get('monetization', 'consent_banner_code', ''),
                'sponsorship_code' => Setting::get('monetization', 'sponsorship_code', ''),
                'custom_monetization_head' => Setting::get('monetization', 'custom_monetization_head', ''),
                'custom_monetization_body' => Setting::get('monetization', 'custom_monetization_body', ''),
            ];

            return array_merge($seo, [
                'verification' => $verification,
                'analytics' => $analytics,
                'monetization' => $monetization,
            ]);
        });
    }

    public static function getMetaFor(string $type, ?object $model = null, ?string $overrideTitle = null, ?string $overrideDescription = null): array
    {
        $settings = self::getGlobalSettings();
        $siteName = $settings['site_name'];
        $appUrl = config('app.url');
        $currentUrl = request()->url();

        $title = $overrideTitle;
        $description = $overrideDescription;
        $image = $settings['og_image'] ?: null;
        $keywords = $settings['meta_keywords'];
        $robots = $settings['robots'];
        $typeOg = $settings['og_type'];
        $canonical = $settings['canonical_enabled'] ? $currentUrl : null;
        $structuredData = null;

        if ($model) {
            $seoMeta = null;
            if (method_exists($model, 'seoMetadata')) {
                $seoMeta = $model->seoMetadata()->first();
            }
            // Fallback to legacy columns on Article
            $title = $seoMeta->meta_title ?? $model->seo_title ?? $model->title ?? $model->name ?? $title;
            $description = $seoMeta->meta_description ?? $model->seo_description ?? $model->excerpt ?? Str::limit(strip_tags($model->body ?? $model->description ?? ''), 155) ?? $description;
            $keywords = $seoMeta->meta_keywords ?? $keywords;
            $canonical = $seoMeta->canonical_url ?? $canonical;
            $image = $seoMeta->og_image ?? $model->og_image ?? $model->featured_image ?? $image;
            $robots = $seoMeta->robots ?? $robots;

            if ($image && ! str_starts_with($image, 'http')) {
                $image = asset('storage/'.ltrim($image, '/'));
            }

            if ($model instanceof Article) {
                $typeOg = 'article';
                if ($settings['json_ld_enabled']) {
                    $structuredData = self::buildArticleStructuredData($model, $settings);
                }
            } elseif ($model instanceof Category || $model instanceof Page) {
                $typeOg = 'website';
                if ($settings['json_ld_enabled']) {
                    $structuredData = self::buildGenericStructuredData($model, $type, $settings);
                }
            }
        }

        if (! $title) {
            $title = match ($type) {
                'home' => $siteName.' - '.$settings['site_tagline'],
                'category' => ($model->name ?? 'Category').' | '.$siteName,
                'topic' => ($model->name ?? 'Topic').' | '.$siteName,
                'author' => ($model->name ?? 'Author').' | '.$siteName,
                'page' => ($model->title ?? 'Page').' | '.$siteName,
                default => $siteName,
            };
        } else {
            // Apply template if contains placeholder
            $template = $settings['meta_title_template'];
            if (str_contains($template, '{title}') && $type !== 'home') {
                $title = str_replace(['{title}', '{site_name}', '{tagline}'], [$title, $siteName, $settings['site_tagline']], $template);
            } elseif ($type === 'home' && ! $overrideTitle) {
                // already set
            } else {
                // ensure site name suffix if not already present
                if (! str_contains($title, $siteName)) {
                    $title = $title.' | '.$siteName;
                }
            }
        }

        $description = $description ?: $settings['meta_description'];
        $description = Str::limit(strip_tags($description), 160);

        return [
            'title' => $title,
            'description' => $description,
            'keywords' => $keywords,
            'robots' => $robots,
            'canonical' => $canonical,
            'og_title' => $title,
            'og_description' => $description,
            'og_image' => $image,
            'og_type' => $typeOg,
            'og_url' => $currentUrl,
            'og_site_name' => $settings['og_site_name'],
            'twitter_card' => $settings['twitter_card'],
            'twitter_site' => $settings['twitter_site'],
            'twitter_creator' => $settings['twitter_creator'],
            'twitter_title' => $title,
            'twitter_description' => $description,
            'twitter_image' => $image,
            'structured_data' => $structuredData,
            'hreflang' => $settings['hreflang_enabled'] ? $settings['hreflang_default'] : null,
        ];
    }

    public static function buildArticleStructuredData(Article $article, array $settings): array
    {
        $url = url('/article/'.$article->slug);
        $image = $article->featured_image ? asset('storage/'.$article->featured_image) : ($settings['og_image'] ?: null);
        $logo = $settings['json_ld_organization_logo'] ? asset('storage/'.ltrim($settings['json_ld_organization_logo'], '/')) : null;

        $data = [
            '@context' => 'https://schema.org',
            '@type' => $settings['json_ld_type'] ?? 'NewsArticle',
            'headline' => $article->title,
            'description' => Str::limit(strip_tags($article->excerpt ?? $article->body ?? ''), 155),
            'datePublished' => $article->published_at?->toIso8601String() ?? $article->created_at?->toIso8601String(),
            'dateModified' => $article->updated_at?->toIso8601String(),
            'mainEntityOfPage' => [
                '@type' => 'WebPage',
                '@id' => $url,
            ],
            'author' => [
                '@type' => 'Person',
                'name' => $article->author->name ?? 'Editorial',
                'url' => $article->author ? url('/author/'.$article->author->username) : null,
            ],
            'publisher' => [
                '@type' => 'Organization',
                'name' => $settings['json_ld_organization_name'],
            ],
            'isAccessibleForFree' => true,
        ];

        if ($image) {
            $data['image'] = [$image];
        }
        if ($logo) {
            $data['publisher']['logo'] = [
                '@type' => 'ImageObject',
                'url' => $logo,
            ];
        }
        if ($article->category) {
            $data['articleSection'] = $article->category->name;
        }
        if ($article->topics) {
            $data['keywords'] = $article->topics->pluck('name')->implode(', ');
        }

        return $data;
    }

    public static function buildGenericStructuredData(object $model, string $type, array $settings): array
    {
        $url = request()->url();
        $name = $model->title ?? $model->name ?? $settings['site_name'];
        $description = Str::limit(strip_tags($model->excerpt ?? $model->description ?? $model->body ?? ''), 155) ?: $settings['meta_description'];

        return [
            '@context' => 'https://schema.org',
            '@type' => 'WebPage',
            'name' => $name,
            'description' => $description,
            'url' => $url,
            'isPartOf' => [
                '@type' => 'WebSite',
                'name' => $settings['site_name'],
                'url' => config('app.url'),
            ],
            'breadcrumb' => $settings['breadcrumbs_enabled'] ? self::buildBreadcrumbData() : null,
        ];
    }

    public static function buildBreadcrumbData(?array $items = null): array
    {
        if ($items) {
            $elements = [];
            foreach ($items as $index => $item) {
                $elements[] = [
                    '@type' => 'ListItem',
                    'position' => $index + 1,
                    'name' => $item['name'],
                    'item' => $item['url'],
                ];
            }

            return [
                '@context' => 'https://schema.org',
                '@type' => 'BreadcrumbList',
                'itemListElement' => $elements,
            ];
        }

        return [];
    }

    public static function getVerificationMeta(): array
    {
        $v = self::getGlobalSettings()['verification'];
        $tags = [];
        if (! empty($v['google_site_verification'])) {
            $tags[] = ['name' => 'google-site-verification', 'content' => $v['google_site_verification']];
        }
        if (! empty($v['bing_site_verification'])) {
            $tags[] = ['name' => 'msvalidate.01', 'content' => $v['bing_site_verification']];
        }
        if (! empty($v['yandex_verification'])) {
            $tags[] = ['name' => 'yandex-verification', 'content' => $v['yandex_verification']];
        }
        if (! empty($v['pinterest_verification'])) {
            $tags[] = ['name' => 'p:domain_verify', 'content' => $v['pinterest_verification']];
        }
        if (! empty($v['facebook_domain_verification'])) {
            $tags[] = ['name' => 'facebook-domain-verification', 'content' => $v['facebook_domain_verification']];
        }

        return $tags;
    }

    public static function getAnalyticsScripts(): array
    {
        $a = self::getGlobalSettings()['analytics'];
        $scripts = [];

        if (! empty($a['google_analytics_id'])) {
            $gid = $a['google_analytics_id'];
            $scripts[] = "https://www.googletagmanager.com/gtag/js?id={$gid}";
            $scripts[] = "gtag:{$gid}";
        }
        if (! empty($a['google_tag_manager_id'])) {
            $scripts[] = "gtm:{$a['google_tag_manager_id']}";
        }

        // Others handled via raw custom code injection
        return $scripts;
    }

    public static function getMonetizationHeadScripts(): string
    {
        $m = self::getGlobalSettings()['monetization'];
        $a = self::getGlobalSettings()['analytics'];
        $html = '';

        if ($m['adsense_enabled'] && ! empty($m['adsense_publisher_id'])) {
            $pub = $m['adsense_publisher_id'];
            // Ensure starts with ca-pub-
            if (! str_starts_with($pub, 'ca-pub-')) {
                $pub = 'ca-pub-'.ltrim($pub, '-');
            }
            if (! empty($m['adsense_script'])) {
                $html .= $m['adsense_script']."\n";
            } else {
                $html .= '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client='.e($pub).'" crossorigin="anonymous"></script>'."\n";
            }
            if ($m['adsense_auto_ads_enabled']) {
                $html .= "<script>(adsbygoogle = window.adsbygoogle || []).push({});</script>\n";
            }
        }

        if (! empty($m['custom_monetization_head'])) {
            $html .= $m['custom_monetization_head']."\n";
        }
        if (! empty($a['custom_head_code'])) {
            $html .= $a['custom_head_code']."\n";
        }

        return $html;
    }

    public static function clearCache(): void
    {
        Cache::forget('seo_global_settings');
        Cache::forget('site_settings');
        Cache::forget('shared_categories');
    }
}
