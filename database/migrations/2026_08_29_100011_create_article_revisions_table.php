<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('article_revisions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('article_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->text('excerpt')->nullable();
            $table->longText('body');
            $table->string('featured_image')->nullable();
            $table->text('change_summary')->nullable();
            $table->enum('change_type', ['content', 'metadata', 'publish', 'unpublish', 'schedule'])->default('content');
            $table->timestamps();

            $table->index(['article_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('article_revisions');
    }
};
