<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('articles', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('subtitle')->nullable();
            $table->text('excerpt')->nullable();
            $table->longText('body');
            $table->string('featured_image')->nullable();
            $table->json('gallery')->nullable();
            $table->foreignId('category_id')->constrained()->onDelete('restrict');
            $table->foreignId('author_id')->constrained()->onDelete('restrict');
            $table->enum('status', ['draft', 'in_review', 'scheduled', 'published', 'archived', 'rejected'])->default('draft');
            $table->enum('visibility', ['public', 'private', 'password_protected'])->default('public');
            $table->timestamp('published_at')->nullable();
            $table->timestamp('scheduled_at')->nullable();
            $table->integer('reading_time')->default(0);
            $table->unsignedBigInteger('view_count')->default(0);
            $table->unsignedBigInteger('share_count')->default(0);
            $table->unsignedBigInteger('save_count')->default(0);
            $table->unsignedBigInteger('comment_count')->default(0);
            $table->string('seo_title')->nullable();
            $table->text('seo_description')->nullable();
            $table->string('canonical_url')->nullable();
            $table->string('og_image')->nullable();
            $table->json('structured_data')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_breaking')->default(false);
            $table->boolean('is_trending')->default(false);
            $table->boolean('is_sponsored')->default(false);
            $table->boolean('is_opinion')->default(false);
            $table->boolean('is_analysis')->default(false);
            $table->boolean('allow_comments')->default(true);
            $table->foreignId('published_by')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('reviewed_at')->nullable();
            $table->text('editorial_notes')->nullable();
            $table->text('correction')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['status', 'published_at']);
            $table->index(['category_id', 'status', 'published_at']);
            $table->index(['author_id', 'status', 'published_at']);
            $table->index(['is_featured', 'status', 'published_at']);
            $table->index(['is_breaking', 'status']);
            $table->index(['slug']);
            $table->index(['uuid']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};
