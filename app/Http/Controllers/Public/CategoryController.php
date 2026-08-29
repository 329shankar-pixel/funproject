<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Services\ArticleService;
use App\Services\DiscoveryService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function __construct(
        private ArticleService $articleService,
        private DiscoveryService $discoveryService,
    ) {}

    public function show(Request $request, string $slug): Response
    {
        $category = Category::where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        return Inertia::render('Public/Category', [
            'category' => $category,
            'articles' => Inertia::defer(fn () => $this->articleService->getArticlesByCategory($category)),
            'categories' => $this->discoveryService->getMenuCategories(),
        ]);
    }
}
