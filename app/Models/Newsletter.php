<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Newsletter extends Model
{
    use HasFactory;

    protected $fillable = [
        'title', 'slug', 'description', 'frequency', 'status', 'is_default',
    ];

    protected $casts = [
        'is_default' => 'boolean',
    ];

    public function subscriptions(): HasMany
    {
        return $this->hasMany(NewsletterSubscription::class);
    }
}
