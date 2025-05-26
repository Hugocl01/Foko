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
                'preset:id,name,user_id,price',
                'preset.user:id,name'
            ])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn($p) => [
                'id' => $p->id,
                'created_at' => $p->created_at->format('Y-m-d H:i'),
                'preset' => [
                    'id' => $p->preset->id,
                    'name' => $p->preset->name,
                    'price' => $p->preset->price,
                    'user' => [
                        'id' => $p->preset->user->id,
                        'name' => $p->preset->user->name,
                    ],
                ],
            ]);

        return Inertia::render('purchases', [
            'purchases' => $purchases,
        ]);
    }
}
