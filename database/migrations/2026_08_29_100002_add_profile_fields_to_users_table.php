<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('username')->unique()->nullable()->after('name');
            $table->text('bio')->nullable()->after('username');
            $table->string('avatar')->nullable()->after('bio');
            $table->string('cover_image')->nullable()->after('avatar');
            $table->string('website')->nullable()->after('cover_image');
            $table->string('location')->nullable()->after('website');
            $table->date('date_of_birth')->nullable()->after('location');
            $table->enum('gender', ['male', 'female', 'other', 'prefer_not_to_say'])->nullable()->after('date_of_birth');
            $table->string('phone')->nullable()->after('gender');
            $table->enum('status', ['active', 'inactive', 'suspended', 'banned'])->default('active')->after('phone');
            $table->timestamp('last_login_at')->nullable()->after('status');
            $table->string('timezone')->default('UTC')->after('last_login_at');
            $table->string('locale')->default('en')->after('timezone');
            $table->boolean('email_notifications')->default(true)->after('locale');
            $table->boolean('push_notifications')->default(true)->after('email_notifications');
            $table->boolean('newsletter_subscribed')->default(false)->after('push_notifications');
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'username', 'bio', 'avatar', 'cover_image', 'website', 'location',
                'date_of_birth', 'gender', 'phone', 'status', 'last_login_at',
                'timezone', 'locale', 'email_notifications', 'push_notifications',
                'newsletter_subscribed', 'deleted_at',
            ]);
        });
    }
};
