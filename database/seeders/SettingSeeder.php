<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    public function run(): void
    {
        $defaults = [
            ['group' => 'branding', 'key' => 'site_name', 'value' => 'Editorial', 'type' => 'string', 'is_public' => true, 'description' => 'Site name shown in header, footer and titles'],
            ['group' => 'branding', 'key' => 'site_tagline', 'value' => 'Premium News & Analysis', 'type' => 'string', 'is_public' => true, 'description' => 'Tagline after site name'],
            ['group' => 'footer', 'key' => 'description', 'value' => 'A premium digital publication delivering insightful analysis, breaking news, and in-depth reporting across technology, politics, business, and culture.', 'type' => 'string', 'is_public' => true, 'description' => 'Footer description'],
            ['group' => 'footer', 'key' => 'copyright', 'value' => 'All rights reserved.', 'type' => 'string', 'is_public' => true, 'description' => 'Copyright suffix'],
            ['group' => 'search', 'key' => 'trending_terms', 'value' => json_encode(['AI', 'Climate', 'Politics', 'Technology', 'Economy']), 'type' => 'json', 'is_public' => true, 'description' => 'Trending search terms'],
            ['group' => 'navigation', 'key' => 'header_latest_label', 'value' => 'Latest', 'type' => 'string', 'is_public' => true, 'description' => 'Header latest label'],
            ['group' => 'navigation', 'key' => 'header_trending_label', 'value' => 'Trending', 'type' => 'string', 'is_public' => true, 'description' => 'Header trending label'],
            ['group' => 'navigation', 'key' => 'header_explore_label', 'value' => 'Explore', 'type' => 'string', 'is_public' => true, 'description' => 'Header explore label'],
            ['group' => 'home', 'key' => 'top_stories_title', 'value' => 'Top Stories', 'type' => 'string', 'is_public' => true, 'description' => 'Home top stories title'],
            ['group' => 'home', 'key' => 'trending_title', 'value' => 'Trending Now', 'type' => 'string', 'is_public' => true, 'description' => 'Home trending title'],
            ['group' => 'home', 'key' => 'latest_title', 'value' => 'Latest Stories', 'type' => 'string', 'is_public' => true, 'description' => 'Home latest title'],
        ];

        foreach ($defaults as $row) {
            Setting::updateOrCreate(
                ['group' => $row['group'], 'key' => $row['key']],
                ['value' => $row['value'], 'type' => $row['type'], 'is_public' => $row['is_public'], 'description' => $row['description']]
            );
        }

        // Seed default footer pages if none exist
        $pages = [
            ['title' => 'About Us', 'slug' => 'about', 'excerpt' => 'About our publication', 'body' => '<p>About us content — edit in admin panel.</p>', 'status' => 'published', 'show_in_footer' => true, 'sort_order' => 1],
            ['title' => 'Contact', 'slug' => 'contact', 'excerpt' => 'Get in touch', 'body' => '<p>Contact page content — edit in admin panel.</p>', 'status' => 'published', 'show_in_footer' => true, 'sort_order' => 2],
            ['title' => 'Privacy Policy', 'slug' => 'privacy', 'excerpt' => 'Privacy policy', 'body' => '<p>Privacy policy content — edit in admin panel.</p>', 'status' => 'published', 'show_in_footer' => true, 'sort_order' => 3],
            ['title' => 'Terms of Service', 'slug' => 'terms', 'excerpt' => 'Terms of service', 'body' => '<p>Terms of service content — edit in admin panel.</p>', 'status' => 'published', 'show_in_footer' => true, 'sort_order' => 4],
        ];

        foreach ($pages as $row) {
            \App\Models\Page::firstOrCreate(['slug' => $row['slug']], $row);
        }
    }
}
