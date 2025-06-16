<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\Notification;
use Illuminate\Support\Facades\Date;

class FollowController extends Controller
{
    public function follow(Request $request, $id)
    {
        $me = Auth::user();

        if ($me->id == (int) $id) {
            return back()->with('error', 'No puedes seguirte a ti mismo.');
        }

        $target = User::findOrFail($id);

        $attached = $me->following()->syncWithoutDetaching([$target->id]);
        if (count($attached['attached']) > 0) {
            // Grabar notificación manualmente
            Notification::create([
                'recipient_id' => $target->id,
                'actor_id' => $me->id,
                'message' => "{$me->username} ha empezado a seguirte.",
                'type' => 'follow',
                'entity_type' => 'user',
                'entity_id' => $me->id,
                'created_at' => Date::now(),
            ]);

            return back()->with('message', "Ahora sigues a {$target->username}");
        }

        return back()->with('error', "Ya sigues a {$target->username}");
    }

    public function unfollow(Request $request, $id)
    {
        $me = Auth::user();

        if ($me->id == (int) $id) {
            return back()->with('error', 'No puedes dejar de seguirte a ti mismo.');
        }

        $target = User::findOrFail($id);

        $detached = $me->following()->detach($target->id);
        if ($detached > 0) {
            return back()->with('message', "Has dejado de seguir a {$target->username}");
        }

        return back()->with('error', "No estabas siguiendo a {$target->username}");
    }
}
