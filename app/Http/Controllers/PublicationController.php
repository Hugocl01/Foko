<?php

namespace App\Http\Controllers;

use App\Models\Publication;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicationController extends Controller
{
    /**
     * Mostrar un listado paginado de publicaciones.
     */
    public function index()
    {
        $publications = Publication::with('user', 'images', 'preset', 'hashtags')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('publications', [
            'publications' => $publications,
        ]);
    }
}
