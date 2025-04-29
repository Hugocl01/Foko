<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class ImageTag extends Pivot
{
    protected $table = 'images_tags';

    public $timestamps = false;

    protected $fillable = [
        'image_id',
        'tag_id',
    ];
}
