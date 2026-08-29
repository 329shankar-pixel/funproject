<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('comment_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('comment_id')->constrained()->onDelete('cascade');
            $table->foreignId('reporter_id')->nullable()->constrained('users')->onDelete('set null');
            $table->enum('reason', ['spam', 'harassment', 'misinformation', 'offensive', 'other']);
            $table->text('details')->nullable();
            $table->enum('status', ['pending', 'reviewed', 'dismissed', 'actioned'])->default('pending');
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamps();

            $table->index(['status', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('comment_reports');
    }
};
