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
        $notifications = Notification::where('user_id', Auth::id())
            ->orderByDesc('created_at')
            ->get(['id', 'message', 'is_read', 'created_at']);

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
        if ($notification->user_id !== Auth::id()) {
            abort(403); // No autorizado
        }

        $notification->delete();

        return back()->with('success', 'Notificación eliminada.');
    }
}
