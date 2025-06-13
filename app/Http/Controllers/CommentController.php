<?php

namespace App\Http\Controllers;

use App\Models\Publication;
use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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

        // 3) Responder según el tipo de petición
        if ($request->wantsJson()) {
            // Devolvemos el comentario recién creado (puedes añadir relaciones si lo necesitas)
            return response()->json([
                'message' => 'Comentario añadido correctamente',
                'comment' => $comment->load('user'),
            ]);
        }

        // Para peticiones normales redirigimos de vuelta con mensaje
        return back()->with('success', 'Comentario publicado con éxito.');
    }
}
