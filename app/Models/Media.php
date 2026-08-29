<?php

namespace App\Models;

use App\Enums\MediaType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Media extends Model
{
    use HasFactory;

    protected $table = 'media';

    protected $fillable = [
        'filename', 'original_filename', 'mime_type', 'size',
        'width', 'height', 'disk', 'path', 'thumbnails',
        'alt_text', 'caption', 'copyright', 'credit',
        'type', 'uploaded_by',
    ];

    protected $casts = [
        'size' => 'integer',
        'width' => 'integer',
        'height' => 'integer',
        'thumbnails' => 'array',
        'type' => MediaType::class,
    ];

    public function uploadedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    public function mediable(): MorphTo
    {
        return $this->morphTo();
    }
}
