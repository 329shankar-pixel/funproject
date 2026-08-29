<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Author;
use App\Models\Category;
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
            'articles' => Article::count(),
            'published' => Article::where('status', 'published')->count(),
            'pending' => Article::where('status', 'in_review')->count(),
            'drafts' => Article::where('status', 'draft')->count(),
            'categories' => Category::count(),
            'topics' => Topic::count(),
            'authors' => Author::count(),
            'pages' => Page::count(),
            'users' => User::count(),
        ];

        $recentArticles = Article::with(['category:id,name', 'author:id,name'])
            ->latest()
            ->limit(5)
            ->get(['id', 'title', 'slug', 'status', 'created_at', 'category_id', 'author_id']);

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recentArticles' => $recentArticles,
        ]);
    }
}
