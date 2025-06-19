import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { Trash2, ArrowUpRight, UserRound } from 'lucide-react';

type Actor = {
    id: number;
    name: string;
    username: string;
    profile_image_url: string;
};

type Notification = {
    id: number;
    message: string;
    is_read?: boolean;
    created_at: string;
    entity_type: 'publication' | 'preset' | 'user' | 'comment';
    entity_id: number;
    actor: Actor | null;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Notificaciones',
        href: '/notifications',
    },
];

export default function Notifications({ notifications: initialNotifications }: { notifications: Notification[] }) {
    const [notifications, setNotifications] = useState(initialNotifications);

    const handleDelete = (id: number) => {
        router.delete(route('notifications.destroy', id), {
            preserveScroll: true,
            onSuccess: () => {
                setNotifications(prev => prev.filter(n => n.id !== id));
            },
        });
    };

    const goToUser = (userId: number) => {
        router.visit(`/profile/${userId}`);
    };

    const goToEntity = (type: string, id: number) => {
        const basePaths: Record<string, string> = {
            publication: 'publications',
            preset: 'presets',
            user: 'users',
            comment: 'comments',
        };
        const path = basePaths[type] || '';
        if (path) {
            router.visit(`/${path}/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Notificaciones" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <h1 className="text-2xl font-bold">Notificaciones</h1>
                <div className="space-y-4">
                    {notifications.map(notif => (
                        <div
                            key={notif.id}
                            className="bg-card border border-border rounded-lg p-4 shadow-md flex justify-between items-center gap-4"
                        >
                            <div>
                                <p className="text-card-foreground">{notif.message}</p>
                                <span className="text-sm text-muted-foreground">
                                    {new Date(notif.created_at).toLocaleString()}
                                </span>
                            </div>
                            <div className="flex gap-2">
                                {notif.actor && (
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    size="icon"
                                                    variant="secondary"
                                                    onClick={() => goToUser(notif.actor?.username)}
                                                >
                                                    <UserRound className="h-4 w-4" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Perfil de {notif.actor.name || notif.actor.username}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                )}

                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                size="icon"
                                                variant="outline"
                                                onClick={() => goToEntity(notif.entity_type, notif.entity_id)}
                                            >
                                                <ArrowUpRight className="h-4 w-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Ir a la entidad</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>

                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                onClick={() => handleDelete(notif.id)}
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Borrar</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </div>
                    ))}
                    {notifications.length === 0 && (
                        <p className="text-muted-foreground">
                            No hay notificaciones pendientes.
                        </p>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
