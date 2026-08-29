<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Author;
use App\Models\Category;
use App\Models\Comment;
use App\Models\Page;
use App\Models\Topic;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $stats = [
            'totalArticles' => Article::count(),
            'publishedArticles' => Article::where('status', 'published')->count(),
            'draftArticles' => Article::where('status', 'draft')->count(),
            'pendingArticles' => Article::where('status', 'in_review')->count(),
            'totalCategories' => Category::count(),
            'activeCategories' => Category::where('is_active', true)->count(),
            'totalTopics' => Topic::count(),
            'totalAuthors' => Author::count(),
            'totalPages' => Page::count(),
            'publishedPages' => Page::where('status', 'published')->count(),
            'totalUsers' => User::count(),
            'activeUsers' => User::where('status', 'active')->count(),
            'pendingComments' => Comment::where('status', 'pending')->count(),
            'totalViews' => (int) Article::sum('view_count'),
        ];

        $recentArticles = Article::with(['category:id,name,slug', 'author:id,name,username'])
            ->orderByDesc('created_at')
            ->limit(6)
            ->get(['id', 'title', 'slug', 'status', 'view_count', 'published_at', 'category_id', 'author_id', 'created_at']);

        $trendingArticles = Article::with(['category:id,name,slug'])
            ->where('is_trending', true)
            ->orderByDesc('view_count')
            ->limit(5)
            ->get(['id', 'title', 'slug', 'view_count', 'published_at', 'category_id']);

        // fallback if no trending flagged
        if ($trendingArticles->isEmpty()) {
            $trendingArticles = Article::with(['category:id,name,slug'])
                ->published()
                ->orderByDesc('view_count')
                ->limit(5)
                ->get(['id', 'title', 'slug', 'view_count', 'published_at', 'category_id']);
        }

        $pendingReview = Article::with(['category:id,name,slug', 'author:id,name'])
            ->where('status', 'in_review')
            ->orderByDesc('created_at')
            ->limit(5)
            ->get(['id', 'title', 'slug', 'status', 'created_at', 'category_id', 'author_id']);

        $topCategories = Category::withCount('articles')
            ->orderByDesc('articles_count')
            ->limit(6)
            ->get(['id', 'name', 'slug', 'color', 'is_active']);

        $recentPages = Page::orderByDesc('updated_at')
            ->limit(5)
            ->get(['id', 'title', 'slug', 'status', 'show_in_footer', 'updated_at']);

        $categoryBreakdown = Category::select('id', 'name', 'slug', 'color')
            ->withCount(['articles as published_count' => fn ($q) => $q->where('status', 'published')])
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->limit(8)
            ->get();

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'recentArticles' => $recentArticles,
            'trendingArticles' => $trendingArticles,
            'pendingReview' => $pendingReview,
            'topCategories' => $topCategories,
            'recentPages' => $recentPages,
            'categoryBreakdown' => $categoryBreakdown,
        ]);
    }
}
