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
        @endphp
        @foreach($verificationTags as $tag)
            <meta name="{{ $tag['name'] }}" content="{{ $tag['content'] }}">
        @endforeach
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
