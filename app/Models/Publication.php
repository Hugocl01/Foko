<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Publication extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'creation_date',
        'preset_id',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            "creation_date" => "datetime"
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function preset(): BelongsTo
    {
        return $this->belongsTo(Preset::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(Image::class);
    }

    public function likes(): HasMany
    {
        return $this->hasMany(Like::class);
    }

    public function saveds(): HasMany
    {
        return $this->hasMany(Saved::class, 'publication_id');
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function hashtags()
    {
        return $this->belongsToMany(
            Hashtag::class,
            'publication_hashtags',
            'publication_id',
            'hashtag_id'
        );
    }
}
