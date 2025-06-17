<?php

namespace App\Http\Controllers;

use App\Models\Publication;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Date;

class CommentController extends Controller
{
    /**
     * Almacena un nuevo comentario en la publicación.
     */
    public function store(Request $request, Publication $publication)
    {
        // 1) Validar el cuerpo del comentario
        $validated = $request->validate([
            'body' => 'required|string|max:255',
        ]);

        // 2) Crear el comentario ligado a la publicación y al usuario
        $comment = $publication->comments()->create([
            'user_id' => Auth::id(),
            'publication_id' => $publication->id,
            'content' => $validated['body'],
        ]);

        // 3) Solo notificar si comentas en una publicación de otro usuario
        if (Auth::id() !== $publication->user_id) {
            Notification::create([
                'recipient_id' => $publication->user_id,
                'actor_id' => Auth::id(),
                'message' => Auth::user()->username . ' ha comentado tu publicación.',
                'type' => 'comment',
                'entity_type' => 'publication',
                'entity_id' => $publication->id,
                'created_at' => Date::now(),
            ]);
        }

        // 4) Responder según el tipo de petición
        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'Comentario añadido correctamente',
                'comment' => $comment->load('user'),
            ]);
        }

        return back()->with('success', 'Comentario publicado con éxito.');
    }
}
