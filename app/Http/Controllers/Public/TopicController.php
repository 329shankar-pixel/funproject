<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Topic;
use App\Services\ArticleService;
use App\Services\DiscoveryService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TopicController extends Controller
{
    public function __construct(
        private ArticleService $articleService,
        private DiscoveryService $discoveryService,
    ) {}

    public function show(Request $request, string $slug): Response
    {
        $topic = Topic::where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        return Inertia::render('Public/Topic', [
            'topic' => $topic,
            'articles' => Inertia::defer(fn () => $this->articleService->getArticlesByTopic($topic)),
            'categories' => $this->discoveryService->getMenuCategories(),
        ]);
    }
}
