<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Services\NavigationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class SocialSettingController extends Controller
{
    public function index(): Response
    {
        $get = fn (string $g, string $k, mixed $d = null) => Setting::get($g, $k, $d);

        $formData = [
            'facebook_url' => $get('social', 'facebook_url', ''),
            'twitter_url' => $get('social', 'twitter_url', $get('social', 'x_url', '')),
            'x_url' => $get('social', 'x_url', $get('social', 'twitter_url', '')),
            'instagram_url' => $get('social', 'instagram_url', ''),
            'linkedin_url' => $get('social', 'linkedin_url', ''),
            'youtube_url' => $get('social', 'youtube_url', ''),
            'tiktok_url' => $get('social', 'tiktok_url', ''),
            'whatsapp_url' => $get('social', 'whatsapp_url', ''),
            'telegram_url' => $get('social', 'telegram_url', ''),
            'threads_url' => $get('social', 'threads_url', ''),
            'pinterest_url' => $get('social', 'pinterest_url', ''),
            'reddit_url' => $get('social', 'reddit_url', ''),
            'email_contact' => $get('social', 'email_contact', ''),
            'phone_contact' => $get('social', 'phone_contact', ''),
            'share_platforms' => implode(', ', (array) $get('social', 'share_platforms', ['facebook', 'twitter', 'linkedin', 'whatsapp', 'telegram', 'email', 'copy'])),
            'share_enabled' => (bool) $get('social', 'share_enabled', true),
            'social_enabled' => (bool) $get('social', 'social_enabled', true),
            'social_header_enabled' => (bool) $get('social', 'social_header_enabled', true),
            'social_footer_enabled' => (bool) $get('social', 'social_footer_enabled', true),
        ];

        return Inertia::render('Admin/Social/Index', [
            'formData' => $formData,
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'facebook_url' => 'nullable|string|max:500',
            'twitter_url' => 'nullable|string|max:500',
            'x_url' => 'nullable|string|max:500',
            'instagram_url' => 'nullable|string|max:500',
            'linkedin_url' => 'nullable|string|max:500',
            'youtube_url' => 'nullable|string|max:500',
            'tiktok_url' => 'nullable|string|max:500',
            'whatsapp_url' => 'nullable|string|max:500',
            'telegram_url' => 'nullable|string|max:500',
            'threads_url' => 'nullable|string|max:500',
            'pinterest_url' => 'nullable|string|max:500',
            'reddit_url' => 'nullable|string|max:500',
            'email_contact' => 'nullable|string|max:255',
            'phone_contact' => 'nullable|string|max:50',
            'share_platforms' => 'nullable|string|max:500',
            'share_enabled' => 'boolean',
            'social_enabled' => 'boolean',
            'social_header_enabled' => 'boolean',
            'social_footer_enabled' => 'boolean',
        ]);

        $sharePlatforms = array_filter(array_map('trim', explode(',', $data['share_platforms'] ?? '')));

        $map = [
            'facebook_url' => $data['facebook_url'] ?? '',
            'twitter_url' => $data['twitter_url'] ?? $data['x_url'] ?? '',
            'x_url' => $data['x_url'] ?? $data['twitter_url'] ?? '',
            'instagram_url' => $data['instagram_url'] ?? '',
            'linkedin_url' => $data['linkedin_url'] ?? '',
            'youtube_url' => $data['youtube_url'] ?? '',
            'tiktok_url' => $data['tiktok_url'] ?? '',
            'whatsapp_url' => $data['whatsapp_url'] ?? '',
            'telegram_url' => $data['telegram_url'] ?? '',
            'threads_url' => $data['threads_url'] ?? '',
            'pinterest_url' => $data['pinterest_url'] ?? '',
            'reddit_url' => $data['reddit_url'] ?? '',
            'email_contact' => $data['email_contact'] ?? '',
            'phone_contact' => $data['phone_contact'] ?? '',
            'share_platforms' => $sharePlatforms,
        ];

        foreach ($map as $key => $value) {
            $type = $key === 'share_platforms' ? 'json' : 'string';
            Setting::set('social', $key, $value, $type);
        }

        Setting::set('social', 'share_enabled', $data['share_enabled'] ? '1' : '0', 'boolean');
        Setting::set('social', 'social_enabled', $data['social_enabled'] ? '1' : '0', 'boolean');
        Setting::set('social', 'social_header_enabled', $data['social_header_enabled'] ? '1' : '0', 'boolean');
        Setting::set('social', 'social_footer_enabled', $data['social_footer_enabled'] ? '1' : '0', 'boolean');

        NavigationService::clearCache();
        Cache::forget('seo_global_settings');
        Cache::forget('navigation_menus');

        return back()->with('success', 'Social settings updated');
    }
}
