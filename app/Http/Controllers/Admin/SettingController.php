<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class SettingController extends Controller
{
    public function index(): Response
    {
        $settings = Setting::orderBy('group')->orderBy('key')->get();
        // also provide grouped defaults for form
        $get = fn ($g, $k, $d = null) => Setting::get($g, $k, $d);
        $formData = [
            'site_name' => $get('branding', 'site_name', 'Editorial'),
            'site_tagline' => $get('branding', 'site_tagline', 'Premium News & Analysis'),
            'footer_description' => $get('footer', 'description', 'A premium digital publication delivering insightful analysis, breaking news, and in-depth reporting across technology, politics, business, and culture.'),
            'footer_copyright' => $get('footer', 'copyright', 'All rights reserved.'),
            'trending_terms' => implode(', ', (array) $get('search', 'trending_terms', ['AI', 'Climate', 'Politics', 'Technology', 'Economy'])),
            'header_latest_label' => $get('navigation', 'header_latest_label', 'Latest'),
            'header_trending_label' => $get('navigation', 'header_trending_label', 'Trending'),
            'header_explore_label' => $get('navigation', 'header_explore_label', 'Explore'),
            'home_top_stories_title' => $get('home', 'top_stories_title', 'Top Stories'),
            'home_trending_title' => $get('home', 'trending_title', 'Trending Now'),
            'home_latest_title' => $get('home', 'latest_title', 'Latest Stories'),
        ];

        return Inertia::render('Admin/Settings/Index', [
            'settings' => $settings,
            'formData' => $formData,
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'site_name' => 'required|string|max:255',
            'site_tagline' => 'required|string|max:255',
            'footer_description' => 'required|string|max:1000',
            'footer_copyright' => 'required|string|max:255',
            'trending_terms' => 'required|string',
            'header_latest_label' => 'required|string|max:50',
            'header_trending_label' => 'required|string|max:50',
            'header_explore_label' => 'required|string|max:50',
            'home_top_stories_title' => 'required|string|max:100',
            'home_trending_title' => 'required|string|max:100',
            'home_latest_title' => 'required|string|max:100',
        ]);

        $terms = array_map('trim', explode(',', $data['trending_terms']));
        $terms = array_filter($terms);

        Setting::set('branding', 'site_name', $data['site_name']);
        Setting::set('branding', 'site_tagline', $data['site_tagline']);
        Setting::set('footer', 'description', $data['footer_description']);
        Setting::set('footer', 'copyright', $data['footer_copyright']);
        Setting::set('search', 'trending_terms', $terms, 'json');
        Setting::set('navigation', 'header_latest_label', $data['header_latest_label']);
        Setting::set('navigation', 'header_trending_label', $data['header_trending_label']);
        Setting::set('navigation', 'header_explore_label', $data['header_explore_label']);
        Setting::set('home', 'top_stories_title', $data['home_top_stories_title']);
        Setting::set('home', 'trending_title', $data['home_trending_title']);
        Setting::set('home', 'latest_title', $data['home_latest_title']);

        foreach (['branding', 'footer', 'search', 'navigation', 'home'] as $g) {
            Setting::where('group', $g)->update(['is_public' => true]);
        }

        Cache::forget('site_settings');

        return back()->with('success', 'Settings updated');
    }
}
