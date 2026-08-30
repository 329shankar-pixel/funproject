<?php

namespace Database\Seeders;

use App\Models\NavigationLink;
use App\Models\Setting;
use Illuminate\Database\Seeder;

class NavigationLinkSeeder extends Seeder
{
    public function run(): void
    {
        $defaults = [
            // Header top bar — every link is dynamic, admin can edit/delete
            ['label' => 'Newsletter', 'url' => '/page/about', 'location' => 'header_top', 'sort_order' => 1],
            ['label' => 'Podcasts', 'url' => '/page/about', 'location' => 'header_top', 'sort_order' => 2],
            ['label' => 'Live TV', 'url' => '/page/about', 'location' => 'header_top', 'sort_order' => 3, 'icon' => 'radio'],

            // Header primary — appears next to categories
            ['label' => 'Live', 'url' => '/page/about', 'location' => 'header_primary', 'sort_order' => 10, 'icon' => 'radio'],
            ['label' => 'Video', 'url' => '/page/about', 'location' => 'header_primary', 'sort_order' => 11],
            ['label' => 'Audio', 'url' => '/page/about', 'location' => 'header_primary', 'sort_order' => 12],

            // Header masthead CTA — Subscribe button (first one used as primary CTA)
            ['label' => 'Subscribe', 'url' => '/login', 'location' => 'header_masthead', 'sort_order' => 1],

            // Footer — Explore column
            ['label' => 'Latest', 'url' => '/', 'location' => 'footer_explore', 'sort_order' => 1],
            ['label' => 'Trending', 'url' => '/', 'location' => 'footer_explore', 'sort_order' => 2],
            ['label' => 'For You', 'url' => '/', 'location' => 'footer_explore', 'sort_order' => 3],

            // Footer — Social profiles via navigation_links (also configurable via Social Media settings)
            ['label' => 'Facebook', 'url' => 'https://facebook.com', 'location' => 'social', 'sort_order' => 1, 'is_external' => true, 'target' => '_blank'],
            ['label' => 'Twitter', 'url' => 'https://x.com', 'location' => 'social', 'sort_order' => 2, 'is_external' => true, 'target' => '_blank'],
            ['label' => 'Instagram', 'url' => 'https://instagram.com', 'location' => 'social', 'sort_order' => 3, 'is_external' => true, 'target' => '_blank'],
            ['label' => 'YouTube', 'url' => 'https://youtube.com', 'location' => 'social', 'sort_order' => 4, 'is_external' => true, 'target' => '_blank'],
            ['label' => 'LinkedIn', 'url' => 'https://linkedin.com', 'location' => 'social', 'sort_order' => 5, 'is_external' => true, 'target' => '_blank'],
        ];

        foreach ($defaults as $row) {
            NavigationLink::firstOrCreate(
                ['label' => $row['label'], 'location' => $row['location'], 'url' => $row['url']],
                array_merge($row, ['is_active' => true, 'target' => $row['target'] ?? '_self'])
            );
        }

        // Seed social share platforms setting if not exists
        $share = Setting::get('social', 'share_platforms', null);
        if (empty($share)) {
            Setting::set('social', 'share_platforms', ['facebook', 'twitter', 'linkedin', 'whatsapp', 'telegram', 'email', 'copy'], 'json');
            Setting::set('social', 'share_enabled', '1', 'boolean');
            Setting::set('social', 'social_enabled', '1', 'boolean');
            Setting::set('social', 'social_header_enabled', '1', 'boolean');
            Setting::set('social', 'social_footer_enabled', '1', 'boolean');
        }
    }
}
