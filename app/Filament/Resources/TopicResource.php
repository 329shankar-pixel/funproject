<?php

namespace App\Filament\Resources;

use App\Filament\Resources\TopicResource\Pages;
use App\Models\Topic;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Str;

class TopicResource extends Resource
{
    protected static ?string $model = Topic::class;

    protected static ?string $navigationIcon = 'heroicon-o-hashtag';

    protected static ?string $navigationGroup = 'Organization';

    protected static ?int $navigationSort = 2;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Topic Details')
                    ->schema([
                        Forms\Components\TextInput::make('name')
                            ->required()
                            ->maxLength(255)
                            ->live(onBlur: true)
                            ->afterStateUpdated(fn (Forms\Set $set, ?string $state) => $set('slug', Str::slug($state))),
                        Forms\Components\TextInput::make('slug')
                            ->required()
                            ->maxLength(255)
                            ->unique(ignoreRecord: true),
                        Forms\Components\Textarea::make('description')
                            ->rows(3)
                            ->columnSpanFull(),
                    ])->columns(2),
                Forms\Components\Section::make('Appearance')
                    ->schema([
                        Forms\Components\FileUpload::make('image')->image()->directory('topics')->maxSize(2048),
                        Forms\Components\ColorPicker::make('color'),
                        Forms\Components\TextInput::make('sort_order')->numeric()->default(0)->required(),
                    ])->columns(3),
                Forms\Components\Section::make('Settings')
                    ->schema([
                        Forms\Components\Toggle::make('is_active')->default(true),
                        Forms\Components\Toggle::make('is_featured')->label('Featured / Trending'),
                    ])->columns(2),
                Forms\Components\Section::make('SEO')
                    ->schema([
                        Forms\Components\TextInput::make('meta_title')->maxLength(255),
                        Forms\Components\Textarea::make('meta_description')->rows(2),
                    ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')->searchable()->sortable(),
                Tables\Columns\TextColumn::make('slug')->searchable()->toggleable(),
                Tables\Columns\ColorColumn::make('color'),
                Tables\Columns\TextColumn::make('articles_count')->numeric()->sortable()->label('Articles'),
                Tables\Columns\TextColumn::make('followers_count')->numeric()->sortable()->label('Followers'),
                Tables\Columns\IconColumn::make('is_active')->boolean(),
                Tables\Columns\IconColumn::make('is_featured')->boolean()->label('Featured'),
                Tables\Columns\TextColumn::make('sort_order')->sortable(),
            ])
            ->filters([
                Tables\Filters\TernaryFilter::make('is_active'),
                Tables\Filters\TernaryFilter::make('is_featured'),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
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
            'index' => Pages\ListTopics::route('/'),
            'create' => Pages\CreateTopic::route('/create'),
            'edit' => Pages\EditTopic::route('/{record}/edit'),
        ];
    }
}
