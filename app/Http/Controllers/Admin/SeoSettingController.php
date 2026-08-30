<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Services\SeoService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class SeoSettingController extends Controller
{
    public function index(): Response
    {
        $get = fn (string $g, string $k, mixed $d = null) => Setting::get($g, $k, $d);

        $formData = [
            // SEO General
            'meta_title_template' => $get('seo', 'meta_title_template', '{title} | {site_name}'),
            'meta_description' => $get('seo', 'meta_description', $get('seo', 'meta_description_default', 'A premium digital publication delivering insightful analysis, breaking news, and in-depth reporting across technology, politics, business, and culture.')),
            'meta_keywords' => $get('seo', 'meta_keywords', $get('seo', 'meta_keywords_default', 'news, editorial, analysis, technology, politics')),
            'robots' => $get('seo', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'),
            'robots_txt_override' => $get('seo', 'robots_txt_override', ''),
            'robots_custom' => $get('seo', 'robots_custom', ''),
            'canonical_enabled' => (bool) $get('seo', 'canonical_enabled', true),
            'breadcrumbs_enabled' => (bool) $get('seo', 'breadcrumbs_enabled', true),
            'sitemap_enabled' => (bool) $get('seo', 'sitemap_enabled', true),
            'rss_enabled' => (bool) $get('seo', 'rss_enabled', true),
            'hreflang_enabled' => (bool) $get('seo', 'hreflang_enabled', false),
            'hreflang_default' => $get('seo', 'hreflang_default', 'en'),

            // Open Graph / Social
            'og_site_name' => $get('seo', 'og_site_name', $get('branding', 'site_name', 'Editorial')),
            'og_image' => $get('seo', 'og_image', $get('seo', 'og_image_default', '')),
            'og_type' => $get('seo', 'og_type', 'website'),
            'twitter_card' => $get('seo', 'twitter_card', 'summary_large_image'),
            'twitter_site' => $get('seo', 'twitter_site', ''),
            'twitter_creator' => $get('seo', 'twitter_creator', ''),
            'json_ld_enabled' => (bool) $get('seo', 'json_ld_enabled', true),
            'json_ld_organization_name' => $get('seo', 'json_ld_organization_name', $get('branding', 'site_name', 'Editorial')),
            'json_ld_organization_logo' => $get('seo', 'json_ld_organization_logo', ''),
            'json_ld_type' => $get('seo', 'json_ld_type', 'NewsArticle'),

            // Verification
            'google_site_verification' => $get('verification', 'google_site_verification', ''),
            'bing_site_verification' => $get('verification', 'bing_site_verification', ''),
            'yandex_verification' => $get('verification', 'yandex_verification', ''),
            'pinterest_verification' => $get('verification', 'pinterest_verification', ''),
            'facebook_domain_verification' => $get('verification', 'facebook_domain_verification', ''),

            // Analytics
            'google_analytics_id' => $get('analytics', 'google_analytics_id', ''),
            'google_tag_manager_id' => $get('analytics', 'google_tag_manager_id', ''),
            'bing_clarity_id' => $get('analytics', 'bing_clarity_id', ''),
            'facebook_pixel_id' => $get('analytics', 'facebook_pixel_id', ''),
            'plausible_domain' => $get('analytics', 'plausible_domain', ''),
            'plausible_script' => $get('analytics', 'plausible_script', ''),
            'umami_website_id' => $get('analytics', 'umami_website_id', ''),
            'umami_script_url' => $get('analytics', 'umami_script_url', ''),
            'hotjar_id' => $get('analytics', 'hotjar_id', ''),
            'custom_head_code' => $get('analytics', 'custom_head_code', ''),
            'custom_body_start_code' => $get('analytics', 'custom_body_start_code', ''),
            'custom_body_end_code' => $get('analytics', 'custom_body_end_code', ''),

            // Monetization
            'adsense_enabled' => (bool) $get('monetization', 'adsense_enabled', false),
            'adsense_publisher_id' => $get('monetization', 'adsense_publisher_id', ''),
            'adsense_auto_ads_enabled' => (bool) $get('monetization', 'adsense_auto_ads_enabled', true),
            'adsense_script' => $get('monetization', 'adsense_script', ''),
            'ads_txt_content' => $get('monetization', 'ads_txt_content', ''),
            'ad_header_code' => $get('monetization', 'ad_header_code', ''),
            'ad_footer_code' => $get('monetization', 'ad_footer_code', ''),
            'ad_sidebar_code' => $get('monetization', 'ad_sidebar_code', ''),
            'ad_in_article_code' => $get('monetization', 'ad_in_article_code', ''),
            'ad_between_articles_code' => $get('monetization', 'ad_between_articles_code', ''),
            'ad_in_feed_code' => $get('monetization', 'ad_in_feed_code', ''),
            'ad_anchor_code' => $get('monetization', 'ad_anchor_code', ''),
            'ad_vignette_enabled' => (bool) $get('monetization', 'ad_vignette_enabled', false),
            'carbon_ads_code' => $get('monetization', 'carbon_ads_code', ''),
            'buysellads_code' => $get('monetization', 'buysellads_code', ''),
            'amazon_associates_id' => $get('monetization', 'amazon_associates_id', ''),
            'ezoic_enabled' => (bool) $get('monetization', 'ezoic_enabled', false),
            'mediavine_enabled' => (bool) $get('monetization', 'mediavine_enabled', false),
            'affiliate_disclosure_enabled' => (bool) $get('monetization', 'affiliate_disclosure_enabled', false),
            'affiliate_disclosure_text' => $get('monetization', 'affiliate_disclosure_text', 'This post may contain affiliate links. We may earn a commission if you purchase through these links.'),
            'consent_mode_enabled' => (bool) $get('monetization', 'consent_mode_enabled', false),
            'consent_banner_code' => $get('monetization', 'consent_banner_code', ''),
            'sponsorship_code' => $get('monetization', 'sponsorship_code', ''),
            'custom_monetization_head' => $get('monetization', 'custom_monetization_head', ''),
            'custom_monetization_body' => $get('monetization', 'custom_monetization_body', ''),
        ];

        return Inertia::render('Admin/Seo/Index', [
            'formData' => $formData,
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'meta_title_template' => 'required|string|max:255',
            'meta_description' => 'required|string|max:500',
            'meta_keywords' => 'required|string|max:1000',
            'robots' => 'required|string|max:500',
            'robots_txt_override' => 'nullable|string|max:5000',
            'robots_custom' => 'nullable|string|max:2000',
            'canonical_enabled' => 'boolean',
            'breadcrumbs_enabled' => 'boolean',
            'sitemap_enabled' => 'boolean',
            'rss_enabled' => 'boolean',
            'hreflang_enabled' => 'boolean',
            'hreflang_default' => 'required|string|max:10',
            'og_site_name' => 'required|string|max:255',
            'og_image' => 'nullable|string|max:500',
            'og_type' => 'required|string|max:50',
            'twitter_card' => 'required|string|max:50',
            'twitter_site' => 'nullable|string|max:100',
            'twitter_creator' => 'nullable|string|max:100',
            'json_ld_enabled' => 'boolean',
            'json_ld_organization_name' => 'required|string|max:255',
            'json_ld_organization_logo' => 'nullable|string|max:500',
            'json_ld_type' => 'required|string|max:50',
            'google_site_verification' => 'nullable|string|max:500',
            'bing_site_verification' => 'nullable|string|max:500',
            'yandex_verification' => 'nullable|string|max:500',
            'pinterest_verification' => 'nullable|string|max:500',
            'facebook_domain_verification' => 'nullable|string|max:500',
            'google_analytics_id' => 'nullable|string|max:100',
            'google_tag_manager_id' => 'nullable|string|max:100',
            'bing_clarity_id' => 'nullable|string|max:100',
            'facebook_pixel_id' => 'nullable|string|max:100',
            'plausible_domain' => 'nullable|string|max:255',
            'plausible_script' => 'nullable|string|max:500',
            'umami_website_id' => 'nullable|string|max:100',
            'umami_script_url' => 'nullable|string|max:500',
            'hotjar_id' => 'nullable|string|max:100',
            'custom_head_code' => 'nullable|string|max:10000',
            'custom_body_start_code' => 'nullable|string|max:10000',
            'custom_body_end_code' => 'nullable|string|max:10000',
            'adsense_enabled' => 'boolean',
            'adsense_publisher_id' => 'nullable|string|max:255',
            'adsense_auto_ads_enabled' => 'boolean',
            'adsense_script' => 'nullable|string|max:10000',
            'ads_txt_content' => 'nullable|string|max:5000',
            'ad_header_code' => 'nullable|string|max:10000',
            'ad_footer_code' => 'nullable|string|max:10000',
            'ad_sidebar_code' => 'nullable|string|max:10000',
            'ad_in_article_code' => 'nullable|string|max:10000',
            'ad_between_articles_code' => 'nullable|string|max:10000',
            'ad_in_feed_code' => 'nullable|string|max:10000',
            'ad_anchor_code' => 'nullable|string|max:10000',
            'ad_vignette_enabled' => 'boolean',
            'carbon_ads_code' => 'nullable|string|max:10000',
            'buysellads_code' => 'nullable|string|max:10000',
            'amazon_associates_id' => 'nullable|string|max:255',
            'ezoic_enabled' => 'boolean',
            'mediavine_enabled' => 'boolean',
            'affiliate_disclosure_enabled' => 'boolean',
            'affiliate_disclosure_text' => 'nullable|string|max:2000',
            'consent_mode_enabled' => 'boolean',
            'consent_banner_code' => 'nullable|string|max:10000',
            'sponsorship_code' => 'nullable|string|max:10000',
            'custom_monetization_head' => 'nullable|string|max:10000',
            'custom_monetization_body' => 'nullable|string|max:10000',
        ]);

        $map = [
            'seo' => [
                'meta_title_template', 'meta_description', 'meta_keywords', 'robots', 'robots_txt_override', 'robots_custom',
                'canonical_enabled', 'breadcrumbs_enabled', 'sitemap_enabled', 'rss_enabled', 'hreflang_enabled', 'hreflang_default',
                'og_site_name', 'og_image', 'og_type', 'twitter_card', 'twitter_site', 'twitter_creator',
                'json_ld_enabled', 'json_ld_organization_name', 'json_ld_organization_logo', 'json_ld_type',
            ],
            'verification' => [
                'google_site_verification', 'bing_site_verification', 'yandex_verification', 'pinterest_verification', 'facebook_domain_verification',
            ],
            'analytics' => [
                'google_analytics_id', 'google_tag_manager_id', 'bing_clarity_id', 'facebook_pixel_id',
                'plausible_domain', 'plausible_script', 'umami_website_id', 'umami_script_url', 'hotjar_id',
                'custom_head_code', 'custom_body_start_code', 'custom_body_end_code',
            ],
            'monetization' => [
                'adsense_enabled', 'adsense_publisher_id', 'adsense_auto_ads_enabled', 'adsense_script', 'ads_txt_content',
                'ad_header_code', 'ad_footer_code', 'ad_sidebar_code', 'ad_in_article_code', 'ad_between_articles_code',
                'ad_in_feed_code', 'ad_anchor_code', 'ad_vignette_enabled', 'carbon_ads_code', 'buysellads_code',
                'amazon_associates_id', 'ezoic_enabled', 'mediavine_enabled', 'affiliate_disclosure_enabled',
                'affiliate_disclosure_text', 'consent_mode_enabled', 'consent_banner_code', 'sponsorship_code',
                'custom_monetization_head', 'custom_monetization_body',
            ],
        ];

        $boolKeys = [
            'canonical_enabled', 'breadcrumbs_enabled', 'sitemap_enabled', 'rss_enabled', 'hreflang_enabled',
            'json_ld_enabled', 'adsense_enabled', 'adsense_auto_ads_enabled', 'ad_vignette_enabled',
            'ezoic_enabled', 'mediavine_enabled', 'affiliate_disclosure_enabled', 'consent_mode_enabled',
        ];

        foreach ($map as $group => $keys) {
            foreach ($keys as $key) {
                $value = $data[$key] ?? null;
                if (in_array($key, $boolKeys, true)) {
                    Setting::set($group, $key, $value ? '1' : '0', 'boolean');
                } else {
                    // Use string type; raw HTML/JS stored as string
                    Setting::set($group, $key, (string) ($value ?? ''), 'string');
                }
            }
        }

        foreach (array_keys($map) as $g) {
            Setting::where('group', $g)->update(['is_public' => false]);
        }

        SeoService::clearCache();
        Cache::forget('seo_robots_txt');
        Cache::forget('seo_sitemap_xml');

        return back()->with('success', 'SEO & Monetization settings updated');
    }
}
