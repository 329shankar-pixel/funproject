<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('authors', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->string('name');
            $table->string('username')->unique();
            $table->text('bio')->nullable();
            $table->string('profile_image')->nullable();
            $table->string('cover_image')->nullable();
            $table->string('email')->nullable();
            $table->string('website')->nullable();
            $table->json('social_links')->nullable();
            $table->json('expertise')->nullable();
            $table->enum('type', ['staff', 'editor', 'contributor', 'guest', 'researcher', 'columnist'])->default('contributor');
            $table->boolean('is_verified')->default(false);
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('articles_count')->default(0);
            $table->unsignedInteger('followers_count')->default(0);
            $table->timestamp('last_published_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('authors');
    }
};
