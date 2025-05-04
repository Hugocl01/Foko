<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class PublicationTag extends Pivot
{
    protected $table = 'publications_tags';

    public $timestamps = false;

    protected $fillable = [
        'publication_id',
        'tag_id',
    ];
}
