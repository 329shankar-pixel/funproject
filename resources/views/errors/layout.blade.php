<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    @php
        $siteName = \App\Models\Setting::get('branding', 'site_name', config('app.name', 'Public Center'));
        $siteTagline = \App\Models\Setting::get('branding', 'site_tagline', "Nepal's Trusted News");
        $siteLogo = \App\Models\Setting::get('branding', 'site_logo', null);
        $siteLogoUrl = $siteLogo ? asset('storage/' . $siteLogo) : null;
        $siteFavicon = \App\Models\Setting::get('branding', 'site_favicon', null);
        $siteFaviconUrl = $siteFavicon ? asset('storage/' . $siteFavicon) : null;
    @endphp
    <title>@yield('title') - {{ $siteName }}</title>
    @if($siteFaviconUrl)
        <link rel="icon" href="{{ $siteFaviconUrl }}" sizes="any">
        <link rel="apple-touch-icon" href="{{ $siteFaviconUrl }}">
    @else
        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="icon" href="/favicon.svg" type="image/svg+xml">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">
    @endif
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="min-h-screen bg-zinc-50 flex flex-col antialiased">
    <header class="border-b bg-white">
        <div class="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <a href="/" class="flex items-center gap-2">
                @if($siteLogoUrl)
                    <img src="{{ $siteLogoUrl }}" alt="{{ $siteName }}" class="h-8 w-auto max-w-[180px] object-contain">
                @else
                    <span class="font-serif text-xl font-black tracking-tighter">{{ strtoupper($siteName) }}<span class="text-[#cc0000]">.</span></span>
                @endif
            </a>
            <span class="hidden text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500 sm:block">{{ $siteTagline }}</span>
        </div>
    </header>
    <main class="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center">
        @yield('content')
    </main>
    <footer class="border-t bg-white py-6 text-center text-xs text-zinc-500">
        &copy; {{ date('Y') }} {{ $siteName }} — {{ \App\Models\Setting::get('footer', 'copyright', 'All rights reserved.') }}
        <span class="mx-2">•</span>
        <a href="https://publiccenter.com.np" class="hover:text-black">publiccenter.com.np</a>
    </footer>
</body>
</html>
