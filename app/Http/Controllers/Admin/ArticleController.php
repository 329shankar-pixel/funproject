<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Author;
use App\Models\Category;
use App\Models\Topic;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class ArticleController extends Controller
{
    public function index(Request $request): Response
    {
        $articles = Article::with(['category:id,name', 'author:id,name'])
            ->when($request->search, fn ($q) => $q->where('title', 'like', "%{$request->search}%"))
            ->when($request->status, fn ($q) => $q->where('status', $request->status))
            ->orderByDesc('created_at')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Articles/Index', [
            'articles' => $articles,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Articles/Form', [
            'categories' => Category::orderBy('name')->get(['id', 'name']),
            'authors' => Author::orderBy('name')->get(['id', 'name']),
            'topics' => Topic::orderBy('name')->get(['id', 'name']),
            'article' => null,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateData($request);
        $data['uuid'] = (string) Str::uuid();
        $data['slug'] = $data['slug'] ?: Str::slug($data['title']);
        $data['reading_time'] = $this->calcReadingTime($data['body'] ?? '');

        if ($request->hasFile('featured_image')) {
            $data['featured_image'] = $request->file('featured_image')->store('articles/featured', 'public');
        }

        $article = Article::create($data);

        if (!empty($data['topics'])) {
            $article->topics()->sync($data['topics']);
        }

        return redirect()->route('admin.articles.index')->with('success', 'Article created');
    }

    public function edit(Article $article): Response
    {
        $article->load('topics');
        return Inertia::render('Admin/Articles/Form', [
            'article' => $article,
            'categories' => Category::orderBy('name')->get(['id', 'name']),
            'authors' => Author::orderBy('name')->get(['id', 'name']),
            'topics' => Topic::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(Request $request, Article $article): RedirectResponse
    {
        $data = $this->validateData($request, $article->id);
        $data['slug'] = $data['slug'] ?: Str::slug($data['title']);
        $data['reading_time'] = $this->calcReadingTime($data['body'] ?? '');

        if ($request->hasFile('featured_image')) {
            $data['featured_image'] = $request->file('featured_image')->store('articles/featured', 'public');
        } else {
            unset($data['featured_image']);
        }

        $topics = $data['topics'] ?? null;
        unset($data['topics']);

        $article->update($data);

        if (is_array($topics)) {
            $article->topics()->sync($topics);
        }

        return redirect()->route('admin.articles.index')->with('success', 'Article updated');
    }

    public function destroy(Article $article): RedirectResponse
    {
        $article->delete();
        return back()->with('success', 'Article deleted');
    }

    private function validateData(Request $request, ?int $ignoreId = null): array
    {
        return $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:articles,slug' . ($ignoreId ? ",$ignoreId" : ''),
            'subtitle' => 'nullable|string|max:500',
            'excerpt' => 'nullable|string|max:1000',
            'body' => 'required|string',
            'featured_image' => 'nullable|image|max:5120',
            'category_id' => 'required|exists:categories,id',
            'author_id' => 'required|exists:authors,id',
            'topics' => 'nullable|array',
            'topics.*' => 'exists:topics,id',
            'status' => 'required|in:draft,in_review,scheduled,published,archived,rejected',
            'visibility' => 'required|in:public,private,password_protected',
            'published_at' => 'nullable|date',
            'is_featured' => 'boolean',
            'is_breaking' => 'boolean',
            'is_trending' => 'boolean',
            'is_opinion' => 'boolean',
            'is_analysis' => 'boolean',
        ]);
    }

    private function calcReadingTime(string $body): int
    {
        $words = str_word_count(strip_tags($body));
        return max(1, (int) ceil($words / 200));
    }
}
