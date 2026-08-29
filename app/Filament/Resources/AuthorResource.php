<?php

namespace App\Filament\Resources;

use App\Filament\Resources\AuthorResource\Pages;
use App\Models\Author;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Str;

class AuthorResource extends Resource
{
    protected static ?string $model = Author::class;

    protected static ?string $navigationIcon = 'heroicon-o-user-group';

    protected static ?string $navigationGroup = 'Users & Roles';

    protected static ?int $navigationSort = 2;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Profile')
                    ->schema([
                        Forms\Components\Select::make('user_id')
                            ->relationship('user', 'name')
                            ->searchable()
                            ->preload()
                            ->label('Linked User'),
                        Forms\Components\TextInput::make('name')->required()->maxLength(255),
                        Forms\Components\TextInput::make('username')
                            ->required()
                            ->maxLength(255)
                            ->unique(ignoreRecord: true)
                            ->live(onBlur: true)
                            ->afterStateUpdated(fn (Forms\Set $set, ?string $state) => $set('username', Str::slug($state))),
                        Forms\Components\Textarea::make('bio')->rows(3)->columnSpanFull(),
                    ])->columns(2),
                Forms\Components\Section::make('Media')
                    ->schema([
                        Forms\Components\FileUpload::make('profile_image')->image()->directory('authors/profile')->maxSize(2048),
                        Forms\Components\FileUpload::make('cover_image')->image()->directory('authors/cover')->maxSize(4096),
                    ])->columns(2),
                Forms\Components\Section::make('Details')
                    ->schema([
                        Forms\Components\TextInput::make('email')->email()->maxLength(255),
                        Forms\Components\TextInput::make('website')->url()->maxLength(255),
                        Forms\Components\KeyValue::make('social_links')->label('Social Links')->keyLabel('Platform')->valueLabel('URL'),
                        Forms\Components\TagsInput::make('expertise')->placeholder('Add expertise'),
                        Forms\Components\Select::make('type')
                            ->options([
                                'staff' => 'Staff',
                                'editor' => 'Editor',
                                'contributor' => 'Contributor',
                                'guest' => 'Guest',
                                'researcher' => 'Researcher',
                                'columnist' => 'Columnist',
                            ])->required()->default('contributor'),
                    ])->columns(2),
                Forms\Components\Section::make('Status')
                    ->schema([
                        Forms\Components\Toggle::make('is_verified')->label('Verified'),
                        Forms\Components\Toggle::make('is_active')->label('Active')->default(true),
                    ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('profile_image')->circular(),
                Tables\Columns\TextColumn::make('name')->searchable()->sortable(),
                Tables\Columns\TextColumn::make('username')->searchable(),
                Tables\Columns\TextColumn::make('type')->badge(),
                Tables\Columns\IconColumn::make('is_verified')->boolean(),
                Tables\Columns\IconColumn::make('is_active')->boolean(),
                Tables\Columns\TextColumn::make('articles_count')->numeric()->sortable(),
                Tables\Columns\TextColumn::make('followers_count')->numeric()->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('type')->options([
                    'staff' => 'Staff', 'editor' => 'Editor', 'contributor' => 'Contributor', 'guest' => 'Guest', 'researcher' => 'Researcher', 'columnist' => 'Columnist',
                ]),
                Tables\Filters\TernaryFilter::make('is_verified'),
                Tables\Filters\TernaryFilter::make('is_active'),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListAuthors::route('/'),
            'create' => Pages\CreateAuthor::route('/create'),
            'edit' => Pages\EditAuthor::route('/{record}/edit'),
        ];
    }
}
