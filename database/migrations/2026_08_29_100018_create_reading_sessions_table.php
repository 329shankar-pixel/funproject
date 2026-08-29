<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reading_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('article_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('session_id')->nullable();
            $table->integer('time_spent')->default(0);
            $table->integer('scroll_depth')->default(0);
            $table->boolean('completed')->default(false);
            $table->timestamp('started_at')->nullable();
            $table->timestamp('ended_at')->nullable();
            $table->timestamps();

            $table->index(['article_id', 'user_id']);
            $table->index(['article_id', 'session_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reading_sessions');
    }
};
