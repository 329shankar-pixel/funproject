<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Services\DiscoveryService;
use App\Services\SeoService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SearchController extends Controller
{
    public function __construct(
        private DiscoveryService $discoveryService,
    ) {}

    public function index(Request $request): Response
    {
        $q = trim($request->input('q', $request->input('search', '')));

        $articles = null;
        if ($q !== '') {
            $articles = Article::with(['author', 'category'])
                ->where(function ($query) use ($q) {
                    $query->where('title', 'like', "%{$q}%")
                        ->orWhere('excerpt', 'like', "%{$q}%")
                        ->orWhere('body', 'like', "%{$q}%")
                        ->orWhereHas('author', fn ($aq) => $aq->where('name', 'like', "%{$q}%"))
                        ->orWhereHas('category', fn ($cq) => $cq->where('name', 'like', "%{$q}%"))
                        ->orWhereHas('topics', fn ($tq) => $tq->where('name', 'like', "%{$q}%"));
                })
                ->where('status', 'published')
                ->latest('published_at')
                ->paginate(12)
                ->withQueryString()
                ->appends(['q' => $q]);
        }

        return Inertia::render('Public/Search', [
            'q' => $q,
            'articles' => $articles,
            'categories' => $this->discoveryService->getMenuCategories(),
            'seo' => SeoService::getMetaFor('search', overrideTitle: $q ? "Search: {$q}" : 'Search'),
        ]);
    }
}
