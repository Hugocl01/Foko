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
    public function notifications(Request $request): Response
    {
        // Traemos solo las notificaciones donde recipient_id = usuario actual
        // y cuyo type sea distinto de 'report'
        $notifications = Notification::with('actor')
            ->where('recipient_id', Auth::id())
            ->where('type', '<>', 'report')
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

    public function reports(Request $request): Response
    {
        $reports = Notification::with('actor')
            ->where('type', 'report')
            ->orderByDesc('created_at')
            ->get([
                'id',
                'message',
                'entity_type',
                'entity_id',
                'actor_id',
                'created_at',
            ]);

        return Inertia::render('admin/reports', [
            'reports' => $reports,
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
    public function destroyNotification(Notification $notification)
    {
        // Asegúrate de que el usuario solo pueda borrar sus propias notificaciones
        if ($notification->recipient_id !== Auth::user()->id) {
            abort(403); // No autorizado
        }

        $notification->delete();

        return back()->with('success', 'Notificación eliminada.');
    }

    /**
     * Elimina un reporte (notificación de tipo "report") si pertenece al usuario autenticado.
     *
     * @param  \App\Models\Notification  $report
     * @return \Illuminate\Http\RedirectResponse|\Inertia\Response
     */
    public function destroyReport(Notification $report)
    {
        $report->delete();

        // Si vienes de Inertia, redirigimos de vuelta a la lista de reportes
        return back()->with('success', 'Reporte eliminado correctamente.');
    }
}
