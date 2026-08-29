<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Topic;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class TopicController extends Controller
{
    public function index(Request $request): Response
    {
        $topics = Topic::when($request->search, fn ($q) => $q->where('name', 'like', "%{$request->search}%"))
            ->orderBy('sort_order')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Admin/Topics/Index', [
            'topics' => $topics,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Topics/Form', ['topic' => null]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateData($request);
        $data['slug'] = $data['slug'] ?: Str::slug($data['name']);
        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('topics', 'public');
        }
        Topic::create($data);
        return redirect()->route('admin.topics.index')->with('success', 'Topic created');
    }

    public function edit(Topic $topic): Response
    {
        return Inertia::render('Admin/Topics/Form', ['topic' => $topic]);
    }

    public function update(Request $request, Topic $topic): RedirectResponse
    {
        $data = $this->validateData($request, $topic->id);
        $data['slug'] = $data['slug'] ?: Str::slug($data['name']);
        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('topics', 'public');
        } else {
            unset($data['image']);
        }
        $topic->update($data);
        return redirect()->route('admin.topics.index')->with('success', 'Topic updated');
    }

    public function destroy(Topic $topic): RedirectResponse
    {
        $topic->delete();
        return back()->with('success', 'Topic deleted');
    }

    private function validateData(Request $request, ?int $id = null): array
    {
        return $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:topics,slug' . ($id ? ",$id" : ''),
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
            'color' => 'nullable|string|max:20',
            'sort_order' => 'required|integer|min:0',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
        ]);
    }
}
