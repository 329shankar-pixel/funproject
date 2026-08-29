<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReadingSession extends Model
{
    use HasFactory;

    protected $fillable = [
        'article_id', 'user_id', 'session_id',
        'time_spent', 'scroll_depth', 'completed',
        'started_at', 'ended_at',
    ];

    protected $casts = [
        'time_spent' => 'integer',
        'scroll_depth' => 'integer',
        'completed' => 'boolean',
        'started_at' => 'datetime',
        'ended_at' => 'datetime',
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
