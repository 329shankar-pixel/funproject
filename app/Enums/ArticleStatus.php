<?php

namespace App\Enums;

enum ArticleStatus: string
{
    case Draft = 'draft';
    case InReview = 'in_review';
    case Scheduled = 'scheduled';
    case Published = 'published';
    case Archived = 'archived';
    case Rejected = 'rejected';

    public function label(): string
    {
        return match ($this) {
            self::Draft => 'Draft',
            self::InReview => 'In Review',
            self::Scheduled => 'Scheduled',
            self::Published => 'Published',
            self::Archived => 'Archived',
            self::Rejected => 'Rejected',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::Draft => 'gray',
            self::InReview => 'yellow',
            self::Scheduled => 'blue',
            self::Published => 'green',
            self::Archived => 'purple',
            self::Rejected => 'red',
        };
    }
}
