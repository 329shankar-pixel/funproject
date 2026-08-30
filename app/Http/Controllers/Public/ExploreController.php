<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Services\ArticleService;
use App\Services\DiscoveryService;
use App\Services\SeoService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ExploreController extends Controller
{
    public function __construct(
        private ArticleService $articleService,
        private DiscoveryService $discoveryService,
    ) {}

    public function latest(Request $request): Response
    {
        return Inertia::render('Public/Latest', [
            'articles' => Inertia::defer(fn () => $this->articleService->getLatestArticles(12)),
            'categories' => $this->discoveryService->getMenuCategories(),
            'seo' => SeoService::getMetaFor('latest', overrideTitle: 'Latest Stories'),
        ]);
    }

    public function trending(Request $request): Response
    {
        return Inertia::render('Public/Trending', [
            'articles' => Inertia::defer(fn () => $this->articleService->getTrendingArticlesPaginated(12)),
            'categories' => $this->discoveryService->getMenuCategories(),
            'seo' => SeoService::getMetaFor('trending', overrideTitle: 'Trending Stories'),
        ]);
    }

    public function explore(Request $request): Response
    {
        return Inertia::render('Public/Explore', [
            'exploreData' => Inertia::defer(fn () => $this->discoveryService->getExploreData()),
            'categories' => $this->discoveryService->getMenuCategories(),
            'seo' => SeoService::getMetaFor('explore', overrideTitle: 'Explore'),
        ]);
    }
}
