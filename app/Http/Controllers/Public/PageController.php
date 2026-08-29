<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Page;
use App\Services\DiscoveryService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    public function __construct(
        private DiscoveryService $discoveryService,
    ) {}

    public function show(Request $request, string $slug): Response
    {
        $page = Page::where('slug', $slug)
            ->where('status', 'published')
            ->firstOrFail();

        return Inertia::render('Public/Page', [
            'page' => $page,
            'categories' => $this->discoveryService->getMenuCategories(),
        ]);
    }
}
