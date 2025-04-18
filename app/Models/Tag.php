<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Tag extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
    ];

    public function presets(): BelongsToMany
    {
        return $this->belongsToMany(Preset::class, 'presets_tags');
    }

    public function images(): BelongsToMany
    {
        return $this->belongsToMany(Image::class, 'images_tags', 'tag_id', 'image_id');
    }
}
