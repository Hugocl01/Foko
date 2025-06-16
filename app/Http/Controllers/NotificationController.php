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
            ])
            ->map(function ($notification) {
                $reportedUser = null;

                switch ($notification->entity_type) {
                    case 'publication':
                        $entity = \App\Models\Publication::find($notification->entity_id);
                        break;
                    case 'preset':
                        $entity = \App\Models\Preset::find($notification->entity_id);
                        break;
                    case 'comment':
                        $entity = \App\Models\Comment::find($notification->entity_id);
                        break;
                    case 'user':
                        $entity = \App\Models\User::find($notification->entity_id);
                        break;
                    default:
                        $entity = null;
                }

                if ($entity && $notification->entity_type !== 'user') {
                    $user = $entity->user ?? null;
                } else {
                    // Si la entidad es directamente un usuario (ej. tipo 'user')
                    $user = $entity;
                }

                if ($user) {
                    $reportedUser = [
                        'id' => $user->id,
                        'name' => $user->name,
                        'username' => $user->username,
                        'profile_image_url' => $user->profile_image_url,
                    ];
                }

                return [
                    'id' => $notification->id,
                    'message' => $notification->message,
                    'entity_type' => $notification->entity_type,
                    'entity_id' => $notification->entity_id,
                    'created_at' => $notification->created_at,
                    'actor' => [
                        'id' => $notification->actor->id,
                        'name' => $notification->actor->name,
                        'username' => $notification->actor->username,
                        'profile_image_url' => $notification->actor->profile_image_url,
                    ],
                    'reported_user' => $reportedUser,
                ];
            });

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
