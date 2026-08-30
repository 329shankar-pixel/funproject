<?php

namespace App\Providers\Filament;

use App\Models\Setting;
use Filament\Http\Middleware\Authenticate;
use Filament\Http\Middleware\AuthenticateSession;
use Filament\Http\Middleware\DisableBladeIconComponents;
use Filament\Http\Middleware\DispatchServingFilamentEvent;
use Filament\Navigation\NavigationGroup;
use Filament\Pages;
use Filament\Panel;
use Filament\PanelProvider;
use Filament\Support\Colors\Color;
use Filament\Widgets;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\View\Middleware\ShareErrorsFromSession;

class AdminPanelProvider extends PanelProvider
{
    public function panel(Panel $panel): Panel
    {
        return $panel
            ->default()
            ->id('admin')
            ->path('filament-admin')
            ->login()
            ->colors([
                'primary' => Color::Zinc,
                'danger' => Color::Red,
                'success' => Color::Green,
                'warning' => Color::Amber,
                'info' => Color::Blue,
            ])
            ->font('Inter')
            ->brandName('Public Center')
            ->brandLogo(function () {
                $logo = Setting::get('branding', 'site_logo', null);
                $url = $logo ? asset('storage/'.$logo) : null;
                $name = Setting::get('branding', 'site_name', 'Public Center');
                if ($url) {
                    return '<div class="flex items-center gap-2"><img src="'.e($url).'" alt="'.e($name).'" class="h-7 w-auto object-contain" /><span class="text-lg font-bold">'.e($name).'</span></div>';
                }

                return '<span class="text-xl font-bold">'.e($name).'</span>';
            })
            ->favicon(function () {
                $fav = Setting::get('branding', 'site_favicon', null);

                return $fav ? asset('storage/'.$fav) : '/favicon.ico';
            })
            ->discoverResources(in: app_path('Filament/Resources'), for: 'App\\Filament\\Resources')
            ->discoverPages(in: app_path('Filament/Pages'), for: 'App\\Filament\\Pages')
            ->pages([
                Pages\Dashboard::class,
            ])
            ->discoverWidgets(in: app_path('Filament/Widgets'), for: 'App\\Filament\\Widgets')
            ->widgets([
                Widgets\AccountWidget::class,
            ])
            ->navigationGroups([
                NavigationGroup::make('Content'),
                NavigationGroup::make('Organization'),
                NavigationGroup::make('Users & Roles'),
                NavigationGroup::make('Engagement'),
                NavigationGroup::make('Communication'),
                NavigationGroup::make('System'),
            ])
            ->middleware([
                EncryptCookies::class,
                AddQueuedCookiesToResponse::class,
                StartSession::class,
                AuthenticateSession::class,
                ShareErrorsFromSession::class,
                VerifyCsrfToken::class,
                SubstituteBindings::class,
                DisableBladeIconComponents::class,
                DispatchServingFilamentEvent::class,
            ])
            ->authMiddleware([
                Authenticate::class,
            ])
            ->authGuard('web')
            ->spa();
    }
}
