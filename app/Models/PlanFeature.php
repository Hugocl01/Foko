<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class PlanFeature extends Pivot
{
    protected $table = 'planfeatures';

    public $timestamps = false;

    protected $fillable = [
        "plan_id",
        "feature_id"
    ];

}
