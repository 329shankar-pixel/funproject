<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Page;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    public function index(Request $request): Response
    {
        $pages = Page::when($request->search, fn ($q) => $q->where('title', 'like', "%{$request->search}%"))
            ->orderBy('sort_order')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Pages/Index', [
            'pages' => $pages,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Pages/Form', ['page' => null]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateData($request);
        $data['slug'] = $data['slug'] ?: Str::slug($data['title']);
        if ($request->hasFile('featured_image')) {
            $data['featured_image'] = $request->file('featured_image')->store('pages', 'public');
        }
        Page::create($data);

        return redirect()->route('admin.pages.index')->with('success', 'Page created');
    }

    public function edit(Page $page): Response
    {
        return Inertia::render('Admin/Pages/Form', ['page' => $page]);
    }

    public function update(Request $request, Page $page): RedirectResponse
    {
        $data = $this->validateData($request, $page->id);
        $data['slug'] = $data['slug'] ?: Str::slug($data['title']);
        if ($request->hasFile('featured_image')) {
            $data['featured_image'] = $request->file('featured_image')->store('pages', 'public');
        } else {
            unset($data['featured_image']);
        }
        $page->update($data);

        return redirect()->route('admin.pages.index')->with('success', 'Page updated');
    }

    public function destroy(Page $page): RedirectResponse
    {
        $page->delete();

        return back()->with('success', 'Page deleted');
    }

    public function bulk(Request $request): RedirectResponse
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:pages,id',
            'action' => 'required|string|in:delete,publish,unpublish,draft,archive',
        ]);

        $ids = $request->input('ids');
        $action = $request->input('action');

        match ($action) {
            'delete' => Page::whereIn('id', $ids)->delete(),
            'publish' => Page::whereIn('id', $ids)->update(['status' => 'published']),
            'unpublish', 'draft' => Page::whereIn('id', $ids)->update(['status' => 'draft']),
            'archive' => Page::whereIn('id', $ids)->update(['status' => 'archived']),
            default => null,
        };

        return back()->with('success', ucfirst($action).' completed for '.count($ids).' pages');
    }

    private function validateData(Request $request, ?int $id = null): array
    {
        return $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:pages,slug'.($id ? ",$id" : ''),
            'excerpt' => 'nullable|string',
            'body' => 'required|string',
            'featured_image' => 'nullable|image|max:4096',
            'status' => 'required|in:draft,published,archived',
            'show_in_footer' => 'boolean',
            'show_in_header' => 'boolean',
            'sort_order' => 'required|integer|min:0',
        ]);
    }
}
