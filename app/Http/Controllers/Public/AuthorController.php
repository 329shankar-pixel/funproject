<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Author;
use App\Services\ArticleService;
use App\Services\DiscoveryService;
use App\Services\SeoService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AuthorController extends Controller
{
    public function __construct(
        private ArticleService $articleService,
        private DiscoveryService $discoveryService,
    ) {}

    public function show(Request $request, string $username): Response
    {
        $author = Author::where('username', $username)
            ->where('is_active', true)
            ->firstOrFail();

        return Inertia::render('Public/Author', [
            'author' => $author,
            'articles' => Inertia::defer(fn () => $this->articleService->getArticlesByAuthor($author->id)),
            'categories' => $this->discoveryService->getMenuCategories(),
            'seo' => SeoService::getMetaFor('author', $author),
        ]);
    }
}
