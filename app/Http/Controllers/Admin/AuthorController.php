<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Author;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class AuthorController extends Controller
{
    public function index(Request $request): Response
    {
        $authors = Author::with('user:id,name')
            ->when($request->search, fn ($q) => $q->where('name', 'like', "%{$request->search}%"))
            ->orderByDesc('created_at')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Admin/Authors/Index', [
            'authors' => $authors,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Authors/Form', [
            'author' => null,
            'users' => User::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateData($request);
        $data['username'] = $data['username'] ?: Str::slug($data['name']);
        if ($request->hasFile('profile_image')) {
            $data['profile_image'] = $request->file('profile_image')->store('authors/profile', 'public');
        }
        if ($request->hasFile('cover_image')) {
            $data['cover_image'] = $request->file('cover_image')->store('authors/cover', 'public');
        }
        Author::create($data);
        return redirect()->route('admin.authors.index')->with('success', 'Author created');
    }

    public function edit(Author $author): Response
    {
        return Inertia::render('Admin/Authors/Form', [
            'author' => $author,
            'users' => User::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(Request $request, Author $author): RedirectResponse
    {
        $data = $this->validateData($request, $author->id);
        $data['username'] = $data['username'] ?: Str::slug($data['name']);
        if ($request->hasFile('profile_image')) {
            $data['profile_image'] = $request->file('profile_image')->store('authors/profile', 'public');
        } else {
            unset($data['profile_image']);
        }
        if ($request->hasFile('cover_image')) {
            $data['cover_image'] = $request->file('cover_image')->store('authors/cover', 'public');
        } else {
            unset($data['cover_image']);
        }
        $author->update($data);
        return redirect()->route('admin.authors.index')->with('success', 'Author updated');
    }

    public function destroy(Author $author): RedirectResponse
    {
        $author->delete();
        return back()->with('success', 'Author deleted');
    }

    private function validateData(Request $request, ?int $id = null): array
    {
        return $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'nullable|string|max:255|unique:authors,username' . ($id ? ",$id" : ''),
            'bio' => 'nullable|string',
            'profile_image' => 'nullable|image|max:2048',
            'cover_image' => 'nullable|image|max:4096',
            'email' => 'nullable|email|max:255',
            'website' => 'nullable|url|max:255',
            'type' => 'required|in:staff,editor,contributor,guest,researcher,columnist',
            'is_verified' => 'boolean',
            'is_active' => 'boolean',
            'user_id' => 'nullable|exists:users,id',
        ]);
    }
}
