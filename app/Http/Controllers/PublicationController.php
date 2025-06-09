<?php

namespace App\Http\Controllers;

use App\Models\Publication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PublicationController extends Controller
{
    /**
     * Mostrar un listado paginado de publicaciones,
     * inyectando en cada imagen el campo “url” que llama a getImageUrlAttribute().
     */
    public function index()
    {
        $userId = Auth::user()->id;

        $publications = Publication::with(['user', 'images', 'preset', 'hashtags', 'likes'])
            ->withCount(['likes', 'comments'])
            ->orderBy('created_at', 'desc')
            ->paginate(5);

        // Ajustamos imagenes y añadimos likes_count, comments_count y liked
        $publications->getCollection()->transform(function ($pub) use ($userId) {
            // 1) URLs de imágenes
            $pub->images->transform(function ($img) {
                $img->url = $img->getImageUrlAttribute();
                return $img;
            });

            // 2) Campos de conteo y liked
            $pub->likes_count = count($pub->likes);
            $pub->comments_count = count($pub->comments);
            $pub->liked = $pub->likes->contains('user_id', $userId);

            return $pub;
        });

        return Inertia::render('publications', [
            'publications' => $publications,
        ]);
    }


    /**
     * Detalle de una publicación con conteos y estado de "like".
     * Aplica la misma transformación que en index(), pero para un único registro.
     */
    /**
     * Mostrar detalle de una sola publicación con conteos y estado de "like".
     */
    public function show(Publication $publication)
    {
        $userId = Auth::id();

        // Eager-load relaciones necesarias y conteos
        $publication->load([
            'user:id,name,username,profile_image',
            'images',
            'preset:id,name',
            'hashtags:id,name'
        ])
        ->loadCount(['likes', 'comments'])
        ->loadCount(['likes as liked_by_user_count' => function ($q) use ($userId) {
            $q->where('user_id', $userId);
        }]);

        // Añadir URL a cada imagen
        $publication->images->transform(function ($img) {
            $img->url = $img->getImageUrlAttribute();
            return $img;
        });

        // Preparar payload con misma estructura que index()
        $item = [
            'id'             => $publication->id,
            'user'           => [
                'id'       => $publication->user->id,
                'name'     => $publication->user->name,
                'username' => $publication->user->username,
                'avatar'   => $publication->user->profile_image_url,
            ],
            'images'         => $publication->images->map(function ($img) {
                return ['id' => $img->id, 'url' => $img->url];
            }),
            'preset'         => $publication->preset ? [
                'id'   => $publication->preset->id,
                'name' => $publication->preset->name,
            ] : null,
            'hashtags'       => $publication->hashtags->pluck('name'),
            'likes_count'    => $publication->likes_count,
            'comments_count' => $publication->comments_count,
            'liked'          => $publication->liked_by_user_count > 0,
            'title'          => $publication->title,
            'description'    => $publication->description,
            'created_at'     => $publication->created_at->toDateTimeString(),
        ];

        return Inertia::render('publication', [
            'publication' => $item,
        ]);
    }

    /**
     * Toggle "like" para la publicación: crea o elimina el registro en BD.
     */
    public function toggleLike(Request $request, Publication $publication)
    {
        $userId = Auth::id();
        $likeQuery = $publication->likes()->where('user_id', $userId);

        if ($likeQuery->exists()) {
            // Si ya había like, lo quitamos
            $likeQuery->delete();
            $message = 'Like eliminado';
        } else {
            // Si no, lo creamos
            $publication->likes()->create(['user_id' => $userId]);
            $message = 'Like agregado';
        }

        // Redirigir a la misma página sin perder parámetros
        return redirect()
            ->back()
            ->with('success', $message);
    }
}
