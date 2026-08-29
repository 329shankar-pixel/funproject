<?php

namespace App\Models;

use App\Enums\CommentStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Comment extends Model
{
    use HasFactory;

    protected $fillable = [
        'article_id', 'user_id', 'parent_id', 'body',
        'guest_name', 'guest_email', 'guest_website',
        'status', 'likes_count', 'replies_count',
        'ip_address', 'user_agent',
    ];

    protected $casts = [
        'status' => CommentStatus::class,
        'likes_count' => 'integer',
        'replies_count' => 'integer',
    ];

    public function article(): BelongsTo
    {
        return $this->belongsTo(Article::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    public function replies(): HasMany
    {
        return $this->hasMany(self::class, 'parent_id');
    }

    public function reports(): HasMany
    {
        return $this->hasMany(CommentReport::class);
    }

    public function scopeApproved($query)
    {
        return $query->where('status', CommentStatus::Approved);
    }
}
