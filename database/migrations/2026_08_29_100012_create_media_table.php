<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('media', function (Blueprint $table) {
            $table->id();
            $table->string('filename');
            $table->string('original_filename');
            $table->string('mime_type');
            $table->unsignedBigInteger('size');
            $table->integer('width')->nullable();
            $table->integer('height')->nullable();
            $table->string('disk')->default('public');
            $table->string('path');
            $table->json('thumbnails')->nullable();
            $table->string('alt_text')->nullable();
            $table->string('caption')->nullable();
            $table->string('copyright')->nullable();
            $table->string('credit')->nullable();
            $table->enum('type', ['image', 'video', 'document', 'audio', 'other'])->default('image');
            $table->foreignId('uploaded_by')->nullable()->constrained('users')->onDelete('set null');
            $table->morphs('mediable');
            $table->timestamps();
            $table->softDeletes();

            $table->index(['type', 'uploaded_by']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('media');
    }
};
