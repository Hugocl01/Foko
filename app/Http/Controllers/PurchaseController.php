<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Preset;
use Illuminate\Support\Facades\Storage;

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
                'preset.user:id,username'
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
                        'username' => $p->preset->user->username,
                    ],
                ],
            ]);

        return Inertia::render('purchases', [
            'purchases' => $purchases,
        ]);
    }

    public function store(Request $request, Preset $preset)
    {
        $user = $request->user();   // Usuario autenticado

        // 1. ¿Ya lo compró antes?
        $yaComprado = $user->purchases()
            ->where('preset_id', $preset->id)
            ->exists();

        if ($yaComprado) {
            return back()->withErrors([
                'preset' => 'Ya has comprado este preset.',
            ]);
        }

        // 2. Crear la compra (solo user_id y preset_id)
        $user->purchases()->create([
            'preset_id' => $preset->id,
        ]);

        return redirect()
            ->route('purchases.index')
            ->with('flash', '¡Compra registrada con éxito!');
    }

    public function download(Request $request, Preset $preset)
    {
        $user = $request->user();

        // Comprueba si lo ha comprado
        if (!$user->purchases()->where('preset_id', $preset->id)->exists()) {
            abort(403, 'No tienes permiso para descargar este preset.');
        }

        // Usa el disco 'presets'
        $disk = Storage::disk('presets');

        if (!$disk->exists($preset->file)) {
            abort(404, 'Archivo no encontrado.');
        }

        $filename = $preset->name . '.' . pathinfo($preset->file, PATHINFO_EXTENSION);

        return $disk->download($preset->file, $filename);
    }
}
