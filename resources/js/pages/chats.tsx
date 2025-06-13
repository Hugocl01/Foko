import { Link, Head, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Chats', href: '/chats' },
];

export default function Chats() {
    const { url } = usePage();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Chats – En desarrollo" />

            <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
                <h1 className="text-6xl font-bold mb-4" aria-label="Chats">
                    Chats
                </h1>
                <p className="text-xl mb-6 max-w-md">
                    Esta característica está en desarrollo.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Button variant="default" asChild className="cursor-pointer">
                        <Link href="/">Volver al inicio</Link>
                    </Button>

                    <Button
                        variant="outline"
                        className="cursor-pointer"
                        onClick={() => window.history.back()}
                    >
                        Página anterior
                    </Button>
                </div>
            </div>
        </AppLayout>
    );
}
