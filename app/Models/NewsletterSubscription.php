<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NewsletterSubscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'email', 'name', 'user_id', 'newsletter_id',
        'is_confirmed', 'confirmation_token', 'confirmed_at', 'unsubscribed_at',
        'preferences',
    ];

    protected $casts = [
        'is_confirmed' => 'boolean',
        'confirmed_at' => 'datetime',
        'unsubscribed_at' => 'datetime',
        'preferences' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function newsletter(): BelongsTo
    {
        return $this->belongsTo(Newsletter::class);
    }
}
