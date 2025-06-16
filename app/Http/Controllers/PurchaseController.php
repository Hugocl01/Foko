<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Preset;
use App\Models\Notification;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Date;
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
        $user = $request->user();

        // 1. ¿Ya lo compró antes?
        $yaComprado = $user->purchases()
            ->where('preset_id', $preset->id)
            ->exists();

        if ($yaComprado) {
            return back()->withErrors([
                'preset' => 'Ya has comprado este preset.',
            ]);
        }

        // 2. Crear la compra
        $purchase = $user->purchases()->create([
            'preset_id' => $preset->id,
        ]);

        // 3. Grabar la notificación para el autor del preset
        // Solo si quien compra no es el mismo autor
        if ($preset->user_id !== $user->id) {
            Notification::create([
                'recipient_id' => $preset->user_id,
                'actor_id' => $user->id,
                'message' => "{$user->username} ha comprado tu preset '{$preset->name}'.",
                'type' => 'purchase',
                'entity_type' => 'preset',
                'entity_id' => $preset->id,
                'created_at' => Date::now(),
            ]);
        }

        // 4. Vuelve con mensaje de éxito
        return back()->with('flash', '¡Compra registrada con éxito!');
    }


    public function download(Request $request, Preset $preset)
    {
        $user = $request->user();
        // Permitir si es el creador
        if ($user->id !== $preset->user_id) {
            // Si no es creador, comprueba que lo haya comprado
            $hasPurchased = $user->purchases()->where('preset_id', $preset->id)->exists();
            if (!$hasPurchased) {
                abort(403, 'No tienes permiso para descargar este preset.');
            }
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
