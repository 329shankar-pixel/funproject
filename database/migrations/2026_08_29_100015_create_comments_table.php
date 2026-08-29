<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('comments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('article_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('parent_id')->nullable()->constrained('comments')->onDelete('cascade');
            $table->text('body');
            $table->string('guest_name')->nullable();
            $table->string('guest_email')->nullable();
            $table->string('guest_website')->nullable();
            $table->enum('status', ['pending', 'approved', 'rejected', 'spam'])->default('pending');
            $table->unsignedInteger('likes_count')->default(0);
            $table->unsignedInteger('replies_count')->default(0);
            $table->string('ip_address', 45)->nullable();
            $table->string('user_agent')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['article_id', 'status', 'created_at']);
            $table->index(['parent_id', 'status']);
            $table->index(['user_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('comments');
    }
};
