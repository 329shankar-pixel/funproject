<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class CategoryController extends Controller
{
    public function index(Request $request): Response
    {
        $categories = Category::when($request->search, fn ($q) => $q->where('name', 'like', "%{$request->search}%"))
            ->orderBy('sort_order')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Admin/Categories/Index', [
            'categories' => $categories,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Categories/Form', ['category' => null]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateData($request);
        $data['slug'] = $data['slug'] ?: Str::slug($data['name']);
        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('categories', 'public');
        }
        Category::create($data);
        return redirect()->route('admin.categories.index')->with('success', 'Category created');
    }

    public function edit(Category $category): Response
    {
        return Inertia::render('Admin/Categories/Form', ['category' => $category]);
    }

    public function update(Request $request, Category $category): RedirectResponse
    {
        $data = $this->validateData($request, $category->id);
        $data['slug'] = $data['slug'] ?: Str::slug($data['name']);
        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('categories', 'public');
        } else {
            unset($data['image']);
        }
        $category->update($data);
        return redirect()->route('admin.categories.index')->with('success', 'Category updated');
    }

    public function destroy(Category $category): RedirectResponse
    {
        $category->delete();
        return back()->with('success', 'Category deleted');
    }

    private function validateData(Request $request, ?int $id = null): array
    {
        return $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:categories,slug' . ($id ? ",$id" : ''),
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
            'color' => 'nullable|string|max:20',
            'sort_order' => 'required|integer|min:0',
            'is_active' => 'boolean',
            'show_in_menu' => 'boolean',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
        ]);
    }
}
