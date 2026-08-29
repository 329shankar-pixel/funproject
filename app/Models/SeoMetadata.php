<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class SeoMetadata extends Model
{
    use HasFactory;

    protected $table = 'seo_metadata';

    protected $fillable = [
        'seoble_type', 'seoble_id',
        'meta_title', 'meta_description', 'meta_keywords',
        'canonical_url', 'og_title', 'og_description', 'og_image',
        'twitter_card', 'twitter_title', 'twitter_description', 'twitter_image',
        'structured_data', 'robots',
    ];

    protected $casts = [
        'structured_data' => 'array',
    ];

    public function seoble(): MorphTo
    {
        return $this->morphTo();
    }
}
