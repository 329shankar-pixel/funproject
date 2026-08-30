<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\NavigationLink;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NavigationLinkController extends Controller
{
    public function index(Request $request): Response
    {
        $links = NavigationLink::orderBy('location')->orderBy('sort_order')->orderBy('label')
            ->when($request->location, fn ($q) => $q->where('location', $request->location))
            ->when($request->search, fn ($q) => $q->where('label', 'like', "%{$request->search}%")->orWhere('url', 'like', "%{$request->search}%"))
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/Navigation/Index', [
            'links' => $links,
            'filters' => $request->only(['search', 'location']),
            'locations' => NavigationLink::LOCATIONS,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Navigation/Form', [
            'link' => null,
            'locations' => NavigationLink::LOCATIONS,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateData($request);
        NavigationLink::create($data);

        return redirect()->route('admin.navigation.index')->with('success', 'Link created');
    }

    public function edit(NavigationLink $navigation): Response
    {
        return Inertia::render('Admin/Navigation/Form', [
            'link' => $navigation,
            'locations' => NavigationLink::LOCATIONS,
        ]);
    }

    public function update(Request $request, NavigationLink $navigation): RedirectResponse
    {
        $data = $this->validateData($request);
        $navigation->update($data);

        return redirect()->route('admin.navigation.index')->with('success', 'Link updated');
    }

    public function destroy(NavigationLink $navigation): RedirectResponse
    {
        $navigation->delete();

        return back()->with('success', 'Link deleted');
    }

    public function bulk(Request $request): RedirectResponse
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:navigation_links,id',
            'action' => 'required|string|in:delete,activate,deactivate',
        ]);

        $ids = $request->input('ids');
        $action = $request->input('action');

        match ($action) {
            'delete' => NavigationLink::whereIn('id', $ids)->delete(),
            'activate' => NavigationLink::whereIn('id', $ids)->update(['is_active' => true]),
            'deactivate' => NavigationLink::whereIn('id', $ids)->update(['is_active' => false]),
            default => null,
        };

        return back()->with('success', ucfirst($action).' completed for '.count($ids).' links');
    }

    private function validateData(Request $request): array
    {
        return $request->validate([
            'label' => 'required|string|max:100',
            'url' => 'required|string|max:500',
            'location' => 'required|string|in:'.implode(',', array_keys(NavigationLink::LOCATIONS)),
            'target' => 'required|string|in:_self,_blank',
            'icon' => 'nullable|string|max:50',
            'parent_id' => 'nullable|exists:navigation_links,id',
            'sort_order' => 'required|integer|min:0|max:9999',
            'is_active' => 'boolean',
            'is_external' => 'boolean',
        ]);
    }
}
