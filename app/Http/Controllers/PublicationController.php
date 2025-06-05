<?php

namespace App\Http\Controllers;

use App\Models\Publication;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicationController extends Controller
{
    /**
     * Mostrar un listado paginado de publicaciones,
     * inyectando en cada imagen el campo “url” que llama a getImageUrlAttribute().
     */
    public function index()
    {
        // 1) Traemos las publicaciones con sus relaciones
        $publications = Publication::with('user', 'images', 'preset', 'hashtags')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        // 2) Recorremos la colección interna de publicaciones para
        //    ajustar cada imagen y añadirle dinámicamente "url"
        $publications->getCollection()->transform(function ($publication) {
            $publication->images->transform(function ($image) {
                // Asignamos a "url" el valor que devuelve getImageUrlAttribute():
                $image->url = $image->getImageUrlAttribute();

                return $image;
            });

            return $publication;
        });

        // 3) Devolvemos todo a Inertia como antes
        return Inertia::render('publications', [
            'publications' => $publications,
        ]);
    }

    /**
     * Mostrar una sola publicación, inyectando en cada imagen
     * el campo “url” que llama a getImageUrlAttribute().
     */
    public function show($id)
    {
        // 1) Buscamos la publicación con sus relaciones (o fallamos si no existe)
        $publication = Publication::with('user', 'images', 'preset', 'hashtags')
            ->findOrFail($id);

        // 2) Transformamos la colección de imágenes para agregarles "url"
        $publication->images->transform(function ($image) {
            $image->url = $image->getImageUrlAttribute();
            return $image;
        });

        // 3) Devolvemos la publicación a Inertia
        return Inertia::render('publication', [
            'publication' => $publication,
        ]);
    }
}
