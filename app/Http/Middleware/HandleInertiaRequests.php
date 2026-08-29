<?php

namespace App\Http\Middleware;

use App\Models\Category;
use App\Models\Page;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user(),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'siteSettings' => fn () => $this->getSiteSettings(),
            'sharedCategories' => fn () => $this->getSharedCategories(),
            'sharedFooterPages' => fn () => $this->getFooterPages(),
        ];
    }

    private function getSiteSettings(): array
    {
        return Cache::remember('site_settings', 3600, function () {
            return [
                'site_name' => Setting::get('branding', 'site_name', 'Editorial'),
                'site_tagline' => Setting::get('branding', 'site_tagline', 'Premium News & Analysis'),
                'footer_description' => Setting::get('footer', 'description', 'A premium digital publication delivering insightful analysis, breaking news, and in-depth reporting across technology, politics, business, and culture.'),
                'footer_copyright' => Setting::get('footer', 'copyright', 'All rights reserved.'),
                'trending_terms' => Setting::get('search', 'trending_terms', ['AI', 'Climate', 'Politics', 'Technology', 'Economy']),
                'header_latest_label' => Setting::get('navigation', 'header_latest_label', 'Latest'),
                'header_trending_label' => Setting::get('navigation', 'header_trending_label', 'Trending'),
                'header_explore_label' => Setting::get('navigation', 'header_explore_label', 'Explore'),
                'home_top_stories_title' => Setting::get('home', 'top_stories_title', 'Top Stories'),
                'home_trending_title' => Setting::get('home', 'trending_title', 'Trending Now'),
                'home_latest_title' => Setting::get('home', 'latest_title', 'Latest Stories'),
            ];
        });
    }

    private function getSharedCategories(): array
    {
        return Cache::remember('shared_categories', 600, function () {
            return Category::where('is_active', true)
                ->where('show_in_menu', true)
                ->orderBy('sort_order')
                ->get(['id', 'name', 'slug'])
                ->toArray();
        });
    }

    private function getFooterPages(): array
    {
        return Cache::remember('shared_footer_pages', 600, function () {
            return Page::where('status', 'published')
                ->where('show_in_footer', true)
                ->orderBy('sort_order')
                ->get(['id', 'title', 'slug'])
                ->toArray();
        });
    }
}
