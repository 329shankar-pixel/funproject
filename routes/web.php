<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Public\ArticleController;
use App\Http\Controllers\Public\AuthorController;
use App\Http\Controllers\Public\CategoryController;
use App\Http\Controllers\Public\HomeController;
use App\Http\Controllers\Public\PageController;
use App\Http\Controllers\Public\TopicController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');
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
        Route::get('/', [\App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('dashboard');

        Route::resource('articles', \App\Http\Controllers\Admin\ArticleController::class)->except(['show']);
        Route::resource('categories', \App\Http\Controllers\Admin\CategoryController::class)->except(['show']);
        Route::resource('topics', \App\Http\Controllers\Admin\TopicController::class)->except(['show']);
        Route::resource('authors', \App\Http\Controllers\Admin\AuthorController::class)->except(['show']);
        Route::resource('pages', \App\Http\Controllers\Admin\PageController::class)->except(['show']);
        Route::get('users', [\App\Http\Controllers\Admin\UserController::class, 'index'])->name('users.index');

        Route::get('settings', [\App\Http\Controllers\Admin\SettingController::class, 'index'])->name('settings.index');
        Route::put('settings', [\App\Http\Controllers\Admin\SettingController::class, 'update'])->name('settings.update');
    });
});

require __DIR__.'/settings.php';
