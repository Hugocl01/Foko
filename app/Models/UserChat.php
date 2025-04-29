<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class UserChat extends Pivot
{
    protected $table = 'users_chats';

    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'chat_id',
    ];
}
