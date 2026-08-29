<?php

namespace App\Enums;

enum AuthorType: string
{
    case Staff = 'staff';
    case Editor = 'editor';
    case Contributor = 'contributor';
    case Guest = 'guest';
    case Researcher = 'researcher';
    case Columnist = 'columnist';

    public function label(): string
    {
        return match ($this) {
            self::Staff => 'Staff Writer',
            self::Editor => 'Editor',
            self::Contributor => 'Contributor',
            self::Guest => 'Guest Writer',
            self::Researcher => 'Researcher',
            self::Columnist => 'Columnist',
        };
    }
}
