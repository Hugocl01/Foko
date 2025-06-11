<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
        'recipient_id',
        'actor_id',
        'message',
        'type',
        'entity_type',
        'created_at'
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            "created_at" => "datetime",
            "is_read" => "boolean"
        ];
    }

    public $timestamps = false;

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * El usuario que origina la notificación.
     */
    public function actor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'actor_id');
    }

    /**
     * El usuario que recibe la notificación.
     */
    public function recipient(): BelongsTo
    {
        return $this->belongsTo(User::class, 'recipient_id');
    }
}
