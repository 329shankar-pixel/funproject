<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ArticleView extends Model
{
    use HasFactory;

    protected $fillable = [
        'article_id', 'user_id', 'session_id',
        'ip_address', 'user_agent', 'referrer', 'source',
    ];

    public function article(): BelongsTo
    {
        return $this->belongsTo(Article::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
