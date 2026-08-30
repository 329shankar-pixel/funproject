<?php

namespace App\Services;

use App\Models\Article;
use App\Models\Category;
use App\Models\Topic;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class ArticleService
{
    public function getFeaturedArticles(int $limit = 5): Collection
    {
        return Article::with(['author', 'category'])
            ->featured()
            ->orderBy('published_at', 'desc')
            ->limit($limit)
            ->get();
    }

    public function getHeroArticle(): ?Article
    {
        return Article::with(['author', 'category', 'topics'])
            ->featured()
            ->orderBy('published_at', 'desc')
            ->first();
    }

    public function getSecondaryStories(int $limit = 4): Collection
    {
        return Article::with(['author', 'category'])
            ->featured()
            ->orderBy('published_at', 'desc')
            ->skip(1)
            ->limit($limit)
            ->get();
    }

    public function getLatestArticles(int $perPage = 12): LengthAwarePaginator
    {
        return Article::with(['author', 'category'])
            ->latest()
            ->paginate($perPage);
    }

    public function getTrendingArticles(int $limit = 6): Collection
    {
        return Article::with(['author', 'category'])
            ->published()
            ->where('is_trending', true)
            ->orderBy('view_count', 'desc')
            ->limit($limit)
            ->get();
    }

    public function getTrendingArticlesPaginated(int $perPage = 12): LengthAwarePaginator
    {
        return Article::with(['author', 'category'])
            ->published()
            ->where('is_trending', true)
            ->orderBy('view_count', 'desc')
            ->paginate($perPage);
    }

    public function getArticlesByCategory(Category $category, int $perPage = 12): LengthAwarePaginator
    {
        return Article::with(['author', 'category'])
            ->where('category_id', $category->id)
            ->latest()
            ->paginate($perPage);
    }

    public function getArticlesByTopic(Topic $topic, int $perPage = 12): LengthAwarePaginator
    {
        return Article::with(['author', 'category'])
            ->whereHas('topics', function ($query) use ($topic) {
                $query->where('topics.id', $topic->id);
            })
            ->latest()
            ->paginate($perPage);
    }

    public function getRelatedArticles(Article $article, int $limit = 6): Collection
    {
        return Article::with(['author', 'category'])
            ->where('id', '!=', $article->id)
            ->where(function ($query) use ($article) {
                $query->where('category_id', $article->category_id)
                    ->orWhereHas('topics', function ($q) use ($article) {
                        $q->whereIn('topics.id', $article->topics->pluck('id'));
                    });
            })
            ->latest()
            ->limit($limit)
            ->get();
    }

    public function getArticlesByAuthor(int $authorId, int $perPage = 12): LengthAwarePaginator
    {
        return Article::with(['author', 'category'])
            ->where('author_id', $authorId)
            ->latest()
            ->paginate($perPage);
    }

    public function incrementViewCount(Article $article): void
    {
        $article->increment('view_count');
    }
}
