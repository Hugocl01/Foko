<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Facades\Storage;

class Preset extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price',
        'before_image',
        'after_image',
        'user_id',
        'file',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            "price" => "decimal:2"
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function publications(): HasMany
    {
        return $this->hasMany(Publication::class);
    }

    public function hashtags()
    {
        return $this->belongsToMany(
            Hashtag::class,
            'preset_hashtags',
            'preset_id',
            'hashtag_id'
        );
    }

    public function purchases(): HasMany
    {
        return $this->hasMany(Purchase::class);
    }

    public function getBeforeImageUrlAttribute(): ?string
    {
        if (!$this->before_image) {
            return null;
        }

        // 2) Pasa el nombre de fichero, no el URL
        return Storage::disk('preset_images')->url($this->before_image);
    }

    public function getAfterImageUrlAttribute(): ?string
    {
        if (!$this->after_image) {
            return null;
        }

        // 2) Pasa el nombre de fichero, no el URL
        return Storage::disk('preset_images')->url($this->after_image);
    }

}
