<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Topic;
use App\Services\ArticleService;
use App\Services\DiscoveryService;
use App\Services\SeoService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TopicController extends Controller
{
    public function __construct(
        private ArticleService $articleService,
        private DiscoveryService $discoveryService,
    ) {}

    public function index(Request $request): Response
    {
        $topics = Topic::where('is_active', true)
            ->when($request->search, fn ($q) => $q->where('name', 'like', "%{$request->search}%"))
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get(['id', 'name', 'slug', 'description', 'color', 'followers_count', 'articles_count']);

        return Inertia::render('Public/Topics', [
            'topics' => $topics,
            'filters' => $request->only(['search']),
            'categories' => $this->discoveryService->getMenuCategories(),
            'seo' => SeoService::getMetaFor('topics', overrideTitle: 'All Topics'),
        ]);
    }

    public function show(Request $request, string $slug): Response
    {
        $topic = Topic::where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        return Inertia::render('Public/Topic', [
            'topic' => $topic,
            'articles' => Inertia::defer(fn () => $this->articleService->getArticlesByTopic($topic)),
            'categories' => $this->discoveryService->getMenuCategories(),
            'seo' => SeoService::getMetaFor('topic', $topic),
        ]);
    }
}
