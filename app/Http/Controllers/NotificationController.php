<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    /**
     * Muestra todas las notificaciones del usuario autenticado.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     *
     * @route GET /notifications
     * @middleware auth, verified
     */
    public function index(Request $request): Response
    {
        // Traemos solo las notificaciones donde recipient_id = usuario actual
        $notifications = Notification::with('actor') // carga relación actor
            ->where('recipient_id', Auth::id())
            ->orderByDesc('created_at')
            ->get([
                'id',
                'message',
                'type',
                'entity_type',
                'entity_id',
                'actor_id',
                'created_at',
            ]);

        return Inertia::render('notifications', [
            'notifications' => $notifications,
        ]);
    }

    /**
     * Elimina una notificación específica si pertenece al usuario autenticado.
     *
     * @param  \App\Models\Notification  $notification
     * @return \Illuminate\Http\RedirectResponse
     *
     * @throws \Illuminate\Auth\Access\AuthorizationException
     * @route DELETE /notifications/{notification}
     * @middleware auth, verified
     */
    public function destroy(Notification $notification)
    {
        // Asegúrate de que el usuario solo pueda borrar sus propias notificaciones
        if ($notification->recipient_id !== Auth::user()->id) {
            abort(403); // No autorizado
        }

        $notification->delete();

        return back()->with('success', 'Notificación eliminada.');
    }
}
