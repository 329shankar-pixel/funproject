<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('newsletter_subscriptions', function (Blueprint $table) {
            $table->id();
            $table->string('email');
            $table->string('name')->nullable();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('newsletter_id')->constrained()->onDelete('cascade');
            $table->boolean('is_confirmed')->default(false);
            $table->string('confirmation_token')->nullable();
            $table->timestamp('confirmed_at')->nullable();
            $table->timestamp('unsubscribed_at')->nullable();
            $table->json('preferences')->nullable();
            $table->timestamps();

            $table->unique(['email', 'newsletter_id']);
            $table->index(['newsletter_id', 'is_confirmed']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('newsletter_subscriptions');
    }
};
