<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pages', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('excerpt')->nullable();
            $table->longText('body');
            $table->string('featured_image')->nullable();
            $table->enum('status', ['draft', 'published', 'archived'])->default('draft');
            $table->string('template')->default('default');
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->integer('sort_order')->default(0);
            $table->boolean('show_in_footer')->default(true);
            $table->boolean('show_in_header')->default(false);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pages');
    }
};
