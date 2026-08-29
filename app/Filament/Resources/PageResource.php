<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PageResource\Pages;
use App\Models\Page;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Str;

class PageResource extends Resource
{
    protected static ?string $model = Page::class;

    protected static ?string $navigationIcon = 'heroicon-o-document-duplicate';

    protected static ?string $navigationGroup = 'Content';

    protected static ?int $navigationSort = 5;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Page Details')
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
                        Forms\Components\Textarea::make('excerpt')->rows(3)->columnSpanFull(),
                        Forms\Components\RichEditor::make('body')
                            ->required()
                            ->fileAttachmentsDisk('public')
                            ->fileAttachmentsDirectory('pages')
                            ->columnSpanFull(),
                    ])->columns(2),
                Forms\Components\Section::make('Media & SEO')
                    ->schema([
                        Forms\Components\FileUpload::make('featured_image')->image()->directory('pages')->maxSize(4096),
                        Forms\Components\Select::make('status')
                            ->options(['draft' => 'Draft', 'published' => 'Published', 'archived' => 'Archived'])
                            ->required()->default('draft'),
                        Forms\Components\TextInput::make('template')->default('default')->required(),
                        Forms\Components\TextInput::make('meta_title')->maxLength(255),
                        Forms\Components\Textarea::make('meta_description')->rows(2),
                    ])->columns(2),
                Forms\Components\Section::make('Display')
                    ->schema([
                        Forms\Components\TextInput::make('sort_order')->numeric()->default(0),
                        Forms\Components\Toggle::make('show_in_header')->label('Show in Header'),
                        Forms\Components\Toggle::make('show_in_footer')->label('Show in Footer')->default(true),
                    ])->columns(3),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('title')->searchable()->sortable(),
                Tables\Columns\TextColumn::make('slug')->searchable()->toggleable(),
                Tables\Columns\TextColumn::make('status')->badge()->color(fn (string $state): string => match ($state) {
                    'published' => 'success', 'draft' => 'gray', 'archived' => 'danger', default => 'gray',
                }),
                Tables\Columns\IconColumn::make('show_in_header')->boolean()->label('Header'),
                Tables\Columns\IconColumn::make('show_in_footer')->boolean()->label('Footer'),
                Tables\Columns\TextColumn::make('sort_order')->sortable(),
                Tables\Columns\TextColumn::make('updated_at')->dateTime('M j, Y')->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')->options(['draft' => 'Draft', 'published' => 'Published', 'archived' => 'Archived']),
                Tables\Filters\TernaryFilter::make('show_in_header'),
                Tables\Filters\TernaryFilter::make('show_in_footer'),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
                Tables\Actions\Action::make('view')
                    ->icon('heroicon-o-eye')
                    ->url(fn (Page $record) => url('/page/'.$record->slug))
                    ->openUrlInNewTab(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('sort_order');
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListPages::route('/'),
            'create' => Pages\CreatePage::route('/create'),
            'edit' => Pages\EditPage::route('/{record}/edit'),
        ];
    }
}
