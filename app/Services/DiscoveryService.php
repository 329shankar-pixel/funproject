<?php

namespace App\Services;

use App\Models\Category;
use App\Models\Topic;
use Illuminate\Database\Eloquent\Collection;

class DiscoveryService
{
    public function getActiveCategories(int $limit = 15): Collection
    {
        return Category::where('is_active', true)
            ->orderBy('sort_order')
            ->limit($limit)
            ->get();
    }

    public function getFeaturedTopics(int $limit = 10): Collection
    {
        return Topic::where('is_active', true)
            ->where('is_featured', true)
            ->orderBy('followers_count', 'desc')
            ->limit($limit)
            ->get();
    }

    public function getTrendingTopics(int $limit = 8): Collection
    {
        return Topic::where('is_active', true)
            ->orderBy('articles_count', 'desc')
            ->limit($limit)
            ->get();
    }

    public function getMenuCategories(): Collection
    {
        return Category::where('is_active', true)
            ->where('show_in_menu', true)
            ->orderBy('sort_order')
            ->get();
    }
}
