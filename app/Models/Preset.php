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

    public function beforeImage(): BelongsTo
    {
        return $this->belongsTo(Image::class, 'before_image');
    }

    public function afterImage(): BelongsTo
    {
        return $this->belongsTo(Image::class, 'after_image');
    }

    public function hashtags()
    {
        return $this->belongsToMany(Hashtag::class, 'preset_hashtags');
    }

    public function purchases(): HasMany
    {
        return $this->hasMany(Purchase::class);
    }
}
