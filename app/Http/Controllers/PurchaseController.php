<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PurchaseController extends Controller
{
    /**
     * Muestra un listado de todas las compras del usuario autenticado.
     */
    public function index()
    {
        // Carga las compras del usuario con su preset
        $purchases = Auth::user()
            ->purchases()
            ->with([
                // Cargamos preset y el user que lo creó
                'preset:id,name,user_id',
                'preset.user:id,name'
            ])
            ->with('preset:id,name')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn($p) => [
                'id' => $p->id,
                'preset' => $p->preset,
                'created_at' => $p->created_at->format('Y-m-d H:i'),
            ]);

        // Renderiza la página Inertia, pasando los datos
        return Inertia::render('purchases', [
            'purchases' => $purchases,
        ]);
    }
}
