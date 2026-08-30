<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('navigation_links', function (Blueprint $table) {
            $table->id();
            $table->string('label');
            $table->string('url');
            $table->string('location')->index(); // header_top, header_primary, header_masthead, header_more, mobile, footer_explore, footer_about, footer_legal, footer_column_4, social, etc
            $table->string('target')->default('_self'); // _self, _blank
            $table->string('icon')->nullable(); // lucide icon name
            $table->unsignedBigInteger('parent_id')->nullable()->index();
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->boolean('is_external')->default(false);
            $table->json('meta')->nullable(); // extra data like style, badge
            $table->timestamps();

            $table->foreign('parent_id')->references('id')->on('navigation_links')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('navigation_links');
    }
};
