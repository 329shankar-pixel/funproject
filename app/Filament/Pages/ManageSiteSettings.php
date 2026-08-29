<?php

namespace App\Filament\Pages;

use App\Models\Setting;
use Filament\Forms;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Illuminate\Support\Facades\Cache;

class ManageSiteSettings extends Page implements HasForms
{
    use InteractsWithForms;

    protected static ?string $navigationIcon = 'heroicon-o-cog-6-tooth';

    protected static ?string $navigationGroup = 'System';

    protected static ?int $navigationSort = 100;

    protected static string $view = 'filament.pages.manage-site-settings';

    protected static ?string $title = 'Site Settings';

    protected static ?string $navigationLabel = 'Site Settings';

    public ?array $data = [];

    public function mount(): void
    {
        $this->form->fill($this->getSettingsData());
    }

    protected function getSettingsData(): array
    {
        $get = fn (string $group, string $key, mixed $default = null) => Setting::get($group, $key, $default);

        return [
            'site_name' => $get('branding', 'site_name', 'Editorial'),
            'site_tagline' => $get('branding', 'site_tagline', 'Premium News & Analysis'),
            'footer_description' => $get('footer', 'description', 'A premium digital publication delivering insightful analysis, breaking news, and in-depth reporting across technology, politics, business, and culture.'),
            'footer_copyright' => $get('footer', 'copyright', 'All rights reserved.'),
            'trending_terms' => $get('search', 'trending_terms', ['AI', 'Climate', 'Politics', 'Technology', 'Economy']),
            'header_latest_label' => $get('navigation', 'header_latest_label', 'Latest'),
            'header_trending_label' => $get('navigation', 'header_trending_label', 'Trending'),
            'header_explore_label' => $get('navigation', 'header_explore_label', 'Explore'),
            'home_top_stories_title' => $get('home', 'top_stories_title', 'Top Stories'),
            'home_trending_title' => $get('home', 'trending_title', 'Trending Now'),
            'home_latest_title' => $get('home', 'latest_title', 'Latest Stories'),
        ];
    }

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Branding')
                    ->description('Site name and tagline used across header, footer and page titles.')
                    ->schema([
                        Forms\Components\TextInput::make('site_name')
                            ->label('Site Name')
                            ->required()
                            ->maxLength(255),
                        Forms\Components\TextInput::make('site_tagline')
                            ->label('Site Tagline')
                            ->helperText('Shown after site name in browser title, e.g. "Premium News & Analysis"')
                            ->maxLength(255),
                    ])->columns(2),

                Forms\Components\Section::make('Footer')
                    ->schema([
                        Forms\Components\Textarea::make('footer_description')
                            ->label('Footer Description')
                            ->rows(3)
                            ->columnSpanFull(),
                        Forms\Components\TextInput::make('footer_copyright')
                            ->label('Copyright Suffix')
                            ->helperText('Appended after year and site name, e.g. "All rights reserved."')
                            ->maxLength(255),
                    ]),

                Forms\Components\Section::make('Navigation Labels')
                    ->description('Labels for the main header navigation.')
                    ->schema([
                        Forms\Components\TextInput::make('header_latest_label')->label('Latest Label')->required(),
                        Forms\Components\TextInput::make('header_trending_label')->label('Trending Label')->required(),
                        Forms\Components\TextInput::make('header_explore_label')->label('Explore Label')->required(),
                    ])->columns(3),

                Forms\Components\Section::make('Search')
                    ->schema([
                        Forms\Components\TagsInput::make('trending_terms')
                            ->label('Trending Search Terms')
                            ->helperText('Press enter to add. Shown in search overlay.')
                            ->placeholder('Add term'),
                    ]),

                Forms\Components\Section::make('Home Page Sections')
                    ->schema([
                        Forms\Components\TextInput::make('home_top_stories_title')->label('Top Stories Title')->required(),
                        Forms\Components\TextInput::make('home_trending_title')->label('Trending Title')->required(),
                        Forms\Components\TextInput::make('home_latest_title')->label('Latest Stories Title')->required(),
                    ])->columns(3),
            ])
            ->statePath('data');
    }

    protected function getFormActions(): array
    {
        return [
            Forms\Components\Actions\Action::make('save')
                ->label('Save Settings')
                ->submit('save'),
        ];
    }

    public function save(): void
    {
        $data = $this->form->getState();

        Setting::set('branding', 'site_name', $data['site_name']);
        Setting::set('branding', 'site_tagline', $data['site_tagline']);
        Setting::set('footer', 'description', $data['footer_description']);
        Setting::set('footer', 'copyright', $data['footer_copyright']);
        Setting::set('search', 'trending_terms', $data['trending_terms'], 'json');
        Setting::set('navigation', 'header_latest_label', $data['header_latest_label']);
        Setting::set('navigation', 'header_trending_label', $data['header_trending_label']);
        Setting::set('navigation', 'header_explore_label', $data['header_explore_label']);
        Setting::set('home', 'top_stories_title', $data['home_top_stories_title']);
        Setting::set('home', 'trending_title', $data['home_trending_title']);
        Setting::set('home', 'latest_title', $data['home_latest_title']);

        // Mark as public for sharing via API
        Setting::where('group', 'branding')->update(['is_public' => true]);
        Setting::where('group', 'footer')->update(['is_public' => true]);
        Setting::where('group', 'search')->update(['is_public' => true]);
        Setting::where('group', 'navigation')->update(['is_public' => true]);
        Setting::where('group', 'home')->update(['is_public' => true]);

        Cache::forget('site_settings');

        Notification::make()
            ->title('Settings saved')
            ->success()
            ->send();
    }
}
