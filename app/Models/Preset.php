<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Preset extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price',
        'before_image_id',
        'after_image_id',
        'user_id',
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

    public function beforeImage(): BelongsTo
    {
        return $this->belongsTo(Image::class, 'before_image_id');
    }

    public function afterImage(): BelongsTo
    {
        return $this->belongsTo(Image::class, 'after_image_id');
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class, 'presets_tags');
    }

    public function purchases(): HasMany
    {
        return $this->hasMany(Purchase::class);
    }
}
