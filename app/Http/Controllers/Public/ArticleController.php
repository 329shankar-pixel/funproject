<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Services\ArticleService;
use App\Services\DiscoveryService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ArticleController extends Controller
{
    public function __construct(
        private ArticleService $articleService,
        private DiscoveryService $discoveryService,
    ) {}

    public function show(Request $request, string $slug): Response
    {
        $article = Article::with(['author', 'category', 'topics'])
            ->where('slug', $slug)
            ->published()
            ->firstOrFail();

        $this->articleService->incrementViewCount($article);

        return Inertia::render('Public/Article', [
            'article' => $article,
            'relatedArticles' => Inertia::defer(fn () => $this->articleService->getRelatedArticles($article, 6)),
            'moreFromAuthor' => Inertia::defer(fn () => $this->articleService->getArticlesByAuthor($article->author_id, 4)),
            'categories' => $this->discoveryService->getMenuCategories(),
        ]);
    }
}
