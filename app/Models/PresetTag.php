<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class PresetTag extends Pivot
{
    protected $table = 'presets_tags';

    public $timestamps = false;

    protected $fillable = [
        'preset_id',
        'tag_id',
    ];
}
