<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Author;
use App\Models\Category;
use App\Models\Topic;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

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

        $seo = $this->extractSeoData($data);
        $topics = $data['topics'] ?? null;
        $articleData = collect($data)->except(array_merge(array_keys($seo), ['topics']))->toArray();

        // Map legacy columns
        $articleData['seo_title'] = $seo['meta_title'] ?? $seo['seo_title'] ?? null;
        $articleData['seo_description'] = $seo['meta_description'] ?? $seo['seo_description'] ?? null;
        $articleData['canonical_url'] = $seo['canonical_url'] ?? null;
        $articleData['og_image'] = $seo['og_image'] ?? null;

        $article = Article::create($articleData);

        if (! empty($topics)) {
            $article->topics()->sync($topics);
        }

        $this->syncSeoMetadata($article, $seo);

        return redirect()->route('admin.articles.index')->with('success', 'Article created');
    }

    public function edit(Article $article): Response
    {
        $article->load(['topics', 'seoMetadata']);
        // Flatten first seoMetadata for frontend convenience
        $article->setAttribute('seoMetadata', $article->seoMetadata->first());

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

        $seo = $this->extractSeoData($data);
        $topics = $data['topics'] ?? null;
        unset($data['topics']);
        foreach (array_keys($seo) as $k) {
            unset($data[$k]);
        }

        // Map legacy columns
        $data['seo_title'] = $seo['meta_title'] ?? $seo['seo_title'] ?? $data['seo_title'] ?? $article->seo_title;
        $data['seo_description'] = $seo['meta_description'] ?? $seo['seo_description'] ?? $data['seo_description'] ?? $article->seo_description;
        $data['canonical_url'] = $seo['canonical_url'] ?? $article->canonical_url;
        $data['og_image'] = $seo['og_image'] ?? $article->og_image;

        $article->update($data);

        if (is_array($topics)) {
            $article->topics()->sync($topics);
        }

        $this->syncSeoMetadata($article, $seo);

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
            'slug' => 'nullable|string|max:255|unique:articles,slug'.($ignoreId ? ",$ignoreId" : ''),
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
            'seo_title' => 'nullable|string|max:255',
            'seo_description' => 'nullable|string|max:500',
            'meta_keywords' => 'nullable|string|max:1000',
            'canonical_url' => 'nullable|string|max:500',
            'og_title' => 'nullable|string|max:255',
            'og_description' => 'nullable|string|max:500',
            'og_image' => 'nullable|string|max:500',
            'twitter_title' => 'nullable|string|max:255',
            'twitter_description' => 'nullable|string|max:500',
            'twitter_image' => 'nullable|string|max:500',
            'robots' => 'nullable|string|max:255',
        ]);
    }

    private function extractSeoData(array &$data): array
    {
        $keys = ['seo_title', 'seo_description', 'meta_keywords', 'canonical_url', 'og_title', 'og_description', 'og_image', 'twitter_title', 'twitter_description', 'twitter_image', 'robots'];
        $seo = [];
        foreach ($keys as $k) {
            if (array_key_exists($k, $data)) {
                $seo[$k] = $data[$k];
            }
        }
        // Normalize for SeoMetadata
        $seo['meta_title'] = $seo['seo_title'] ?? null;
        $seo['meta_description'] = $seo['seo_description'] ?? null;

        return $seo;
    }

    private function syncSeoMetadata(Article $article, array $seo): void
    {
        $hasAny = collect($seo)->filter(fn ($v) => ! empty($v))->isNotEmpty();
        if (! $hasAny) {
            return;
        }
        $article->seoMetadata()->updateOrCreate(
            ['seoble_type' => Article::class, 'seoble_id' => $article->id],
            [
                'meta_title' => $seo['meta_title'] ?? $seo['seo_title'] ?? null,
                'meta_description' => $seo['meta_description'] ?? $seo['seo_description'] ?? null,
                'meta_keywords' => $seo['meta_keywords'] ?? null,
                'canonical_url' => $seo['canonical_url'] ?? null,
                'og_title' => $seo['og_title'] ?? null,
                'og_description' => $seo['og_description'] ?? null,
                'og_image' => $seo['og_image'] ?? null,
                'twitter_title' => $seo['twitter_title'] ?? null,
                'twitter_description' => $seo['twitter_description'] ?? null,
                'twitter_image' => $seo['twitter_image'] ?? null,
                'robots' => $seo['robots'] ?? null,
            ]
        );
    }

    private function calcReadingTime(string $body): int
    {
        $words = str_word_count(strip_tags($body));

        return max(1, (int) ceil($words / 200));
    }
}
