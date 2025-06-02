<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

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
