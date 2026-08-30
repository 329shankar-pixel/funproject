<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        {{-- Inline script to detect system dark mode preference and apply it immediately --}}
        <script>
            (function() {
                const appearance = '{{ $appearance ?? "system" }}';

                if (appearance === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                    if (prefersDark) {
                        document.documentElement.classList.add('dark');
                    }
                }
            })();
        </script>

        {{-- Inline style to set the HTML background color based on our theme in app.css --}}
        <style>
            html {
                background-color: oklch(1 0 0);
            }

            html.dark {
                background-color: oklch(0.145 0 0);
            }
        </style>

        @php
            $siteFavicon = \App\Models\Setting::get('branding', 'site_favicon', null);
            $siteFaviconUrl = $siteFavicon ? asset('storage/' . $siteFavicon) : null;
            $siteLogo = \App\Models\Setting::get('branding', 'site_logo', null);
            $siteName = \App\Models\Setting::get('branding', 'site_name', config('app.name', 'Public Center'));
        @endphp
        @if($siteFaviconUrl)
            <link rel="icon" href="{{ $siteFaviconUrl }}" sizes="any">
            <link rel="apple-touch-icon" href="{{ $siteFaviconUrl }}">
        @else
            <link rel="icon" href="/favicon.ico" sizes="any">
            <link rel="icon" href="/favicon.svg" type="image/svg+xml">
            <link rel="apple-touch-icon" href="/apple-touch-icon.png">
        @endif

        {{-- Dynamic SEO: verification meta tags, sitemap link, and monetization/verification head scripts (server-rendered for crawlers) --}}
        @php
            $seoGlobal = \App\Services\SeoService::getGlobalSettings();
            $verificationTags = \App\Services\SeoService::getVerificationMeta();
            // Server-rendered OG for crawlers (WhatsApp/Facebook/X don't run JS) - mirrors SeoService::getMetaFor
            $serverSeo = null;
            try {
                $routeName = \Illuminate\Support\Facades\Route::currentRouteName();
                if ($routeName === 'article.show' && request()->route('slug')) {
                    $a = \App\Models\Article::where('slug', request()->route('slug'))->where('status', 'published')->first();
                    if ($a) $serverSeo = \App\Services\SeoService::getMetaFor('article', $a);
                } elseif ($routeName === 'category.show' && request()->route('slug')) {
                    $c = \App\Models\Category::where('slug', request()->route('slug'))->first();
                    if ($c) $serverSeo = \App\Services\SeoService::getMetaFor('category', $c);
                } elseif ($routeName === 'topic.show' && request()->route('slug')) {
                    $t = \App\Models\Topic::where('slug', request()->route('slug'))->first();
                    if ($t) $serverSeo = \App\Services\SeoService::getMetaFor('topic', $t);
                } elseif ($routeName === 'page.show' && request()->route('slug')) {
                    $p = \App\Models\Page::where('slug', request()->route('slug'))->where('status', 'published')->first();
                    if ($p) $serverSeo = \App\Services\SeoService::getMetaFor('page', $p);
                } elseif ($routeName === 'author.show' && request()->route('username')) {
                    $au = \App\Models\Author::where('username', request()->route('username'))->first();
                    if ($au) $serverSeo = \App\Services\SeoService::getMetaFor('author', $au);
                } elseif (in_array($routeName, ['home', 'latest', 'trending', 'explore', 'topics.index'])) {
                    $serverSeo = \App\Services\SeoService::getMetaFor($routeName === 'home' ? 'home' : str_replace(['topics.index'], ['topics'], $routeName));
                } else {
                    $serverSeo = \App\Services\SeoService::getMetaFor('home');
                }
            } catch (\Throwable $e) {
                $serverSeo = null;
            }
            $ssOgImage = ($serverSeo['og_image'] ?? null) ?: ($seoGlobal['og_image'] ?? null) ?: asset('og-image.png');
            // Ensure absolute https for crawlers
            if ($ssOgImage && !str_starts_with($ssOgImage, 'http')) {
                $ssOgImage = asset(ltrim($ssOgImage, '/'));
            }
            if (!str_starts_with($ssOgImage, 'https://')) {
                $ssOgImage = str_replace('http://', 'https://', $ssOgImage);
            }
            $ssTitle = ($serverSeo['title'] ?? null) ?: ($seoGlobal['site_name'] ?? $siteName);
            $ssDesc = ($serverSeo['description'] ?? null) ?: ($seoGlobal['meta_description'] ?? '');
            $ssUrl = ($serverSeo['og_url'] ?? null) ?: url()->current();
            $ssType = ($serverSeo['og_type'] ?? null) ?: 'website';
            // Force https for og:url as well
            $ssUrl = str_replace('http://', 'https://', $ssUrl);
        @endphp
        @foreach($verificationTags as $tag)
            <meta name="{{ $tag['name'] }}" content="{{ $tag['content'] }}">
        @endforeach
        {{-- Server-rendered OG/Twitter for link previews (crawlers) --}}
        <meta property="og:title" content="{{ $ssTitle }}">
        <meta property="og:description" content="{{ Str::limit(strip_tags($ssDesc), 160) }}">
        <meta property="og:type" content="{{ $ssType }}">
        <meta property="og:url" content="{{ $ssUrl }}">
        <meta property="og:site_name" content="{{ $seoGlobal['og_site_name'] ?? $siteName }}">
        <meta property="og:image" content="{{ $ssOgImage }}">
        <meta property="og:image:secure_url" content="{{ $ssOgImage }}">
        <meta property="og:image:type" content="image/png">
        <meta property="og:image:width" content="1200">
        <meta property="og:image:height" content="630">
        <meta property="og:image:alt" content="{{ $ssTitle }}">
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="{{ $ssTitle }}">
        <meta name="twitter:description" content="{{ Str::limit(strip_tags($ssDesc), 160) }}">
        <meta name="twitter:image" content="{{ $ssOgImage }}">
        <meta name="twitter:image:alt" content="{{ $ssTitle }}">
        @if($seoGlobal['sitemap_enabled'] ?? true)
            <link rel="sitemap" type="application/xml" title="Sitemap" href="{{ url('/sitemap.xml') }}">
        @endif
        {!! \App\Services\SeoService::getMonetizationHeadScripts() !!}
        @if(!empty($seoGlobal['analytics']['custom_head_code']))
            {!! $seoGlobal['analytics']['custom_head_code'] !!}
        @endif
        @if(!empty($seoGlobal['monetization']['custom_monetization_head']))
            {!! $seoGlobal['monetization']['custom_monetization_head'] !!}
        @endif
        {{-- Google Analytics 4 (server-rendered) --}}
        @if(!empty($seoGlobal['analytics']['google_analytics_id']))
            <script async src="https://www.googletagmanager.com/gtag/js?id={{ $seoGlobal['analytics']['google_analytics_id'] }}"></script>
            <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config','{{ $seoGlobal['analytics']['google_analytics_id'] }}');</script>
        @endif
        @if(!empty($seoGlobal['analytics']['google_tag_manager_id']))
            <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','{{ $seoGlobal['analytics']['google_tag_manager_id'] }}');</script>
        @endif

        @fonts

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        <x-inertia::head>
            <title>{{ $siteName ?? config('app.name', 'Public Center') }}</title>
        </x-inertia::head>
    </head>
    <body class="font-sans antialiased">
        @if(!empty($seoGlobal['analytics']['google_tag_manager_id']))
            <noscript><iframe src="https://www.googletagmanager.com/ns.html?id={{ $seoGlobal['analytics']['google_tag_manager_id'] }}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
        @endif
        <x-inertia::app />
        @if(!empty($seoGlobal['analytics']['custom_body_end_code']))
            {!! $seoGlobal['analytics']['custom_body_end_code'] !!}
        @endif
        @if(!empty($seoGlobal['monetization']['custom_monetization_body']))
            {!! $seoGlobal['monetization']['custom_monetization_body'] !!}
        @endif
        @if(!empty($seoGlobal['analytics']['custom_body_start_code']))
            {!! $seoGlobal['analytics']['custom_body_start_code'] !!}
        @endif
    </body>
</html>
