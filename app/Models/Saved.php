<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Saved extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'preset_id',
    ];

    /**
     * Un Saved pertenece a un Usuario.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Un Saved pertenece a un Preset.
     */
    public function publication()
    {
        return $this->belongsTo(Publication::class);
    }
}
