<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Services\ArticleService;
use App\Services\DiscoveryService;
use App\Services\SeoService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __construct(
        private ArticleService $articleService,
        private DiscoveryService $discoveryService,
    ) {}

    public function index(Request $request): Response
    {
        return Inertia::render('Public/Home', [
            'heroArticle' => $this->articleService->getHeroArticle(),
            'secondaryStories' => $this->articleService->getSecondaryStories(4),
            'trendingArticles' => Inertia::defer(fn () => $this->articleService->getTrendingArticles(6)),
            'latestArticles' => Inertia::defer(fn () => $this->articleService->getLatestArticles(12)),
            'categories' => $this->discoveryService->getMenuCategories(),
            'trendingTopics' => Inertia::defer(fn () => $this->discoveryService->getTrendingTopics(8)),
            'seo' => SeoService::getMetaFor('home'),
        ]);
    }
}
