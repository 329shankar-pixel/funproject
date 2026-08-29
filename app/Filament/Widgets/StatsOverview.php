<?php

namespace App\Filament\Widgets;

use App\Models\Article;
use App\Models\Comment;
use App\Models\User;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverview extends BaseWidget
{
    protected function getStats(): array
    {
        return [
            Stat::make('Total Articles', Article::count())
                ->description(Article::where('status', 'published')->count().' published')
                ->descriptionIcon('heroicon-m-arrow-trending-up')
                ->color('success'),
            Stat::make('Pending Reviews', Article::where('status', 'in_review')->count())
                ->description('Awaiting approval')
                ->descriptionIcon('heroicon-m-clock')
                ->color('warning'),
            Stat::make('Total Users', User::count())
                ->description(User::where('status', 'active')->count().' active')
                ->descriptionIcon('heroicon-m-users')
                ->color('info'),
            Stat::make('Comments', Comment::where('status', 'pending')->count())
                ->description('Pending moderation')
                ->descriptionIcon('heroicon-m-chat-bubble-left-ellipsis')
                ->color('danger'),
        ];
    }
}
