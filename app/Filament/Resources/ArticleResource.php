<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ArticleResource\Pages;
use App\Models\Article;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Str;

class ArticleResource extends Resource
{
    protected static ?string $model = Article::class;

    protected static ?string $navigationIcon = 'heroicon-o-document-text';

    protected static ?string $navigationGroup = 'Content';

    protected static ?int $navigationSort = 1;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Basic Information')
                    ->schema([
                        Forms\Components\TextInput::make('title')
                            ->required()
                            ->maxLength(255)
                            ->live(onBlur: true)
                            ->afterStateUpdated(fn (Forms\Set $set, ?string $state) => $set('slug', Str::slug($state))),
                        Forms\Components\TextInput::make('slug')
                            ->required()
                            ->maxLength(255)
                            ->unique(ignoreRecord: true),
                        Forms\Components\TextInput::make('subtitle')
                            ->maxLength(500),
                        Forms\Components\Textarea::make('excerpt')
                            ->rows(3)
                            ->maxLength(1000),
                    ])
                    ->columns(2),

                Forms\Components\Section::make('Content')
                    ->schema([
                        Forms\Components\RichEditor::make('body')
                            ->required()
                            ->fileAttachmentsDisk('public')
                            ->fileAttachmentsDirectory('articles')
                            ->columnSpanFull(),
                    ]),

                Forms\Components\Section::make('Media')
                    ->schema([
                        Forms\Components\FileUpload::make('featured_image')
                            ->image()
                            ->directory('articles/featured')
                            ->maxSize(5120),
                    ])
                    ->columns(2),

                Forms\Components\Section::make('Organization')
                    ->schema([
                        Forms\Components\Select::make('category_id')
                            ->relationship('category', 'name')
                            ->required()
                            ->searchable()
                            ->preload(),
                        Forms\Components\Select::make('author_id')
                            ->relationship('author', 'name')
                            ->required()
                            ->searchable()
                            ->preload(),
                        Forms\Components\Select::make('topics')
                            ->relationship('topics', 'name')
                            ->multiple()
                            ->searchable()
                            ->preload(),
                    ])
                    ->columns(3),

                Forms\Components\Section::make('Publishing')
                    ->schema([
                        Forms\Components\Select::make('status')
                            ->options([
                                'draft' => 'Draft',
                                'in_review' => 'In Review',
                                'scheduled' => 'Scheduled',
                                'published' => 'Published',
                                'archived' => 'Archived',
                                'rejected' => 'Rejected',
                            ])
                            ->required()
                            ->default('draft'),
                        Forms\Components\Select::make('visibility')
                            ->options([
                                'public' => 'Public',
                                'private' => 'Private',
                                'password_protected' => 'Password Protected',
                            ])
                            ->required()
                            ->default('public'),
                        Forms\Components\DateTimePicker::make('published_at')
                            ->label('Publish Date')
                            ->native(false),
                        Forms\Components\DateTimePicker::make('scheduled_at')
                            ->label('Schedule For')
                            ->native(false),
                    ])
                    ->columns(2),

                Forms\Components\Section::make('Flags')
                    ->schema([
                        Forms\Components\Toggle::make('is_featured')
                            ->label('Featured'),
                        Forms\Components\Toggle::make('is_breaking')
                            ->label('Breaking News'),
                        Forms\Components\Toggle::make('is_trending')
                            ->label('Trending'),
                        Forms\Components\Toggle::make('is_sponsored')
                            ->label('Sponsored'),
                        Forms\Components\Toggle::make('is_opinion')
                            ->label('Opinion'),
                        Forms\Components\Toggle::make('is_analysis')
                            ->label('Analysis'),
                        Forms\Components\Toggle::make('allow_comments')
                            ->label('Allow Comments')
                            ->default(true),
                    ])
                    ->columns(4),

                Forms\Components\Section::make('SEO')
                    ->schema([
                        Forms\Components\TextInput::make('seo_title')
                            ->maxLength(255),
                        Forms\Components\Textarea::make('seo_description')
                            ->rows(2)
                            ->maxLength(500),
                        Forms\Components\TextInput::make('canonical_url')
                            ->maxLength(500),
                    ])
                    ->columns(2),

                Forms\Components\Section::make('Editorial Notes')
                    ->schema([
                        Forms\Components\Textarea::make('editorial_notes')
                            ->rows(3)
                            ->columnSpanFull(),
                        Forms\Components\Textarea::make('correction')
                            ->rows(2)
                            ->columnSpanFull(),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('featured_image')
                    ->square()
                    ->size(50)
                    ->defaultImageUrl(fn () => 'https://via.placeholder.com/50'),
                Tables\Columns\TextColumn::make('title')
                    ->searchable()
                    ->sortable()
                    ->limit(50)
                    ->weight('font-medium'),
                Tables\Columns\TextColumn::make('category.name')
                    ->badge()
                    ->color('gray'),
                Tables\Columns\TextColumn::make('author.name')
                    ->searchable(),
                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'published' => 'success',
                        'draft' => 'gray',
                        'in_review' => 'warning',
                        'scheduled' => 'info',
                        'archived' => 'danger',
                        'rejected' => 'danger',
                        default => 'gray',
                    }),
                Tables\Columns\IconColumn::make('is_featured')
                    ->boolean()
                    ->label('Featured'),
                Tables\Columns\TextColumn::make('published_at')
                    ->dateTime('M j, Y')
                    ->sortable(),
                Tables\Columns\TextColumn::make('view_count')
                    ->numeric()
                    ->sortable()
                    ->label('Views'),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'draft' => 'Draft',
                        'in_review' => 'In Review',
                        'scheduled' => 'Scheduled',
                        'published' => 'Published',
                        'archived' => 'Archived',
                    ]),
                Tables\Filters\SelectFilter::make('category_id')
                    ->relationship('category', 'name')
                    ->searchable()
                    ->preload(),
                Tables\Filters\TernaryFilter::make('is_featured')
                    ->label('Featured'),
                Tables\Filters\TernaryFilter::make('is_breaking')
                    ->label('Breaking'),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
                Tables\Actions\Action::make('preview')
                    ->icon('heroicon-o-eye')
                    ->url(fn (Article $record): string => route('article.show', $record->slug))
                    ->openUrlInNewTab(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                    Tables\Actions\BulkAction::make('publish')
                        ->icon('heroicon-o-check-circle')
                        ->requiresConfirmation()
                        ->action(fn ($records) => $records->each->update(['status' => 'published', 'published_at' => now()])),
                ]),
            ])
            ->defaultSort('published_at', 'desc');
    }

    public static function getRelations(): array
    {
        return [
            // ArticleRevisionRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListArticles::route('/'),
            'create' => Pages\CreateArticle::route('/create'),
            'edit' => Pages\EditArticle::route('/{record}/edit'),
        ];
    }

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()->with(['category', 'author']);
    }
}
