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

        // 1) Obtenemos el paginador estándar (5 publicaciones más recientes)
        $paginator = Publication::with(['user', 'images', 'preset', 'hashtags'])
            ->withCount(['likes', 'comments'])
            ->withCount([
                'likes as liked_by_user_count' => function ($q) use ($userId) {
                    $q->where('user_id', $userId);
                },
                'saveds as saved_by_user_count' => function ($q) use ($userId) {
                    $q->where('user_id', $userId);
                },
            ])
            ->orderBy('created_at', 'desc')
            ->paginate(5);

        // 2) Reordenamos sólo esta página (5 items):
        //    asignamos prioridad 0 a los plan_id != 2 (premium)
        //    y 1 a los plan_id == 2 (no premium)
        $reordered = $paginator->getCollection()
            ->sortBy(fn($pub) => $pub->user->plan_id == 2 ? 1 : 0)
            ->values();

        // 3) Aplicamos la transformación original sobre la colección reordenada
        $mapped = $reordered->map(function ($pub) use ($userId) {
            // URLs de imágenes
            $pub->images->transform(function ($img) {
                $img->url = $img->getImageUrlAttribute();
                return $img;
            });

            return [
                'id' => $pub->id,
                'user' => [
                    'id' => $pub->user->id,
                    'name' => $pub->user->name,
                    'username' => $pub->user->username,
                    'profile_image' => $pub->user->getProfileImageUrlAttribute(),
                    'plan_id' => $pub->user->plan_id,
                ],
                'images' => $pub->images->map(fn($img) => [
                    'id' => $img->id,
                    'url' => $img->url,
                ])->all(),
                'preset' => $pub->preset
                    ? ['id' => $pub->preset->id, 'name' => $pub->preset->name]
                    : null,
                'hashtags' => $pub->hashtags->map(fn($tag) => [
                    'id' => $tag->id,
                    'name' => $tag->name,
                ])->all(),
                'likes_count' => $pub->likes_count,
                'comments_count' => $pub->comments_count,
                'liked' => $pub->liked_by_user_count > 0,
                'saved' => $pub->saved_by_user_count > 0,
                'title' => $pub->title,
                'description' => $pub->description,
                'created_at' => $pub->created_at->toDateTimeString(),
            ];
        });

        // 4) Sustituimos la colección del paginator por la reordenada + mapeada
        $paginator->setCollection($mapped);

        // 5) Enviamos a Inertia
        return Inertia::render('publications', [
            'publications' => $paginator,
        ]);
    }

    /**
     * Mostrar detalle de una sola publicación con conteos y estado de "like".
     */
    public function show(Publication $publication)
    {
        $userId = Auth::user()->id;

        // 1) Carga eager de todas las relaciones y conteos, incluyendo saves
        $publication->load([
            'user:id,name,username,profile_image',
            'images',
            'preset:id,name',
            'hashtags:id,name',
        ])
            ->loadCount(['likes', 'comments'])
            ->loadCount([
                // ¿Le ha gustado?
                'likes as liked_by_user_count' => function ($q) use ($userId) {
                    $q->where('user_id', $userId);
                },
                // ¿La tiene guardada?
                'saveds as saved_by_user_count' => function ($q) use ($userId) {
                    $q->where('user_id', $userId);
                },
            ]);

        // 2) Añadir URL a cada imagen
        $publication->images->transform(function ($img) {
            $img->url = $img->getImageUrlAttribute();
            return $img;
        });

        // 3) Preparar payload replicando la estructura de index()
        $item = [
            'id' => $publication->id,
            'user' => [
                'id' => $publication->user->id,
                'name' => $publication->user->name,
                'username' => $publication->user->username,
                'avatar' => $publication->user->profile_image_url,
            ],
            'images' => $publication->images->map(fn($img) => [
                'id' => $img->id,
                'url' => $img->url,
            ])->all(),
            'preset' => $publication->preset
                ? ['id' => $publication->preset->id, 'name' => $publication->preset->name]
                : null,
            'hashtags' => $publication->hashtags->map(fn($tag) => [
                'id' => $tag->id,
                'name' => $tag->name,
            ])->all(),
            'likes_count' => $publication->likes_count,
            'comments_count' => $publication->comments_count,
            'liked' => $publication->liked_by_user_count > 0,
            // Nuevo campo “saved”
            'saved' => $publication->saved_by_user_count > 0,
            'title' => $publication->title,
            'description' => $publication->description,
            'created_at' => $publication->created_at->toDateTimeString(),
        ];

        // 4) Renderizar con Inertia
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

    /**
     * /**
     * Ruta: POST publications/{publication}/save
     * Toggle "saved" para la publicación y redirigir de vuelta con flash.
     */
    public function toggleSave(Request $request, Publication $publication)
    {
        $userId = Auth::id();
        $saveQuery = $publication->saveds()->where('user_id', $userId);

        if ($saveQuery->exists()) {
            $saveQuery->delete();
            $message = 'Publicación eliminada de guardados';
        } else {
            $publication->saveds()->create(['user_id' => $userId]);
            $message = 'Publicación añadida a guardados';
        }

        return redirect()->back()->with('success', $message);
    }
}
