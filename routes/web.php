<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\NavigationLinkController;
use App\Http\Controllers\Admin\SeoSettingController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\SocialSettingController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Public\ArticleController;
use App\Http\Controllers\Public\AuthorController;
use App\Http\Controllers\Public\CategoryController;
use App\Http\Controllers\Public\ExploreController;
use App\Http\Controllers\Public\HomeController;
use App\Http\Controllers\Public\PageController;
use App\Http\Controllers\Public\TopicController;
use App\Http\Controllers\SeoController;
use Illuminate\Support\Facades\Route;

Route::get('/sitemap.xml', [SeoController::class, 'sitemap'])->name('sitemap');
Route::get('/robots.txt', [SeoController::class, 'robots'])->name('robots');
Route::get('/ads.txt', [SeoController::class, 'adsTxt'])->name('ads.txt');

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/latest', [ExploreController::class, 'latest'])->name('latest');
Route::get('/trending', [ExploreController::class, 'trending'])->name('trending');
Route::get('/explore', [ExploreController::class, 'explore'])->name('explore');
Route::get('/topics', [TopicController::class, 'index'])->name('topics.index');
Route::get('/article/{slug}', [ArticleController::class, 'show'])->name('article.show');
Route::get('/category/{slug}', [CategoryController::class, 'show'])->name('category.show');
Route::get('/topic/{slug}', [TopicController::class, 'show'])->name('topic.show');
Route::get('/author/{username}', [AuthorController::class, 'show'])->name('author.show');
Route::get('/page/{slug}', [PageController::class, 'show'])->name('page.show');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return redirect()->route('admin.dashboard');
    })->name('dashboard');

    Route::prefix('admin')->name('admin.')->group(function () {
        Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

        Route::resource('articles', App\Http\Controllers\Admin\ArticleController::class)->except(['show']);
        Route::resource('categories', App\Http\Controllers\Admin\CategoryController::class)->except(['show']);
        Route::resource('topics', App\Http\Controllers\Admin\TopicController::class)->except(['show']);
        Route::resource('authors', App\Http\Controllers\Admin\AuthorController::class)->except(['show']);
        Route::resource('pages', App\Http\Controllers\Admin\PageController::class)->except(['show']);
        Route::get('users', [UserController::class, 'index'])->name('users.index');

        Route::get('settings', [SettingController::class, 'index'])->name('settings.index');
        Route::match(['put', 'post'], 'settings', [SettingController::class, 'update'])->name('settings.update');

        Route::get('seo', [SeoSettingController::class, 'index'])->name('seo.index');
        Route::match(['put', 'post'], 'seo', [SeoSettingController::class, 'update'])->name('seo.update');

        Route::get('social', [SocialSettingController::class, 'index'])->name('social.index');
        Route::match(['put', 'post'], 'social', [SocialSettingController::class, 'update'])->name('social.update');

        Route::resource('navigation', NavigationLinkController::class)->except(['show'])->parameters(['navigation' => 'navigation']);
    });
});

require __DIR__.'/settings.php';
