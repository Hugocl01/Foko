import { Link, Head, usePage } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import AppLayout from "@/layouts/app-layout"

const breadcrumbs = [
    { title: "Inicio", href: "/" },
    { title: "404", href: "#" },
]

export default function Error404() {
    const { url } = usePage()

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="404 – Página no encontrada" />

            <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
                <h1 className="text-6xl font-bold mb-4" aria-label="Error 404">
                    404
                </h1>
                <p className="text-xl mb-6 max-w-md">Lo sentimos, no encontramos la página que buscas.</p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Button variant="default" className="cursor-pointer" asChild>
                        <Link href="/">Volver al inicio</Link>
                    </Button>

                    <Button variant="outline" className="cursor-pointer" onClick={() => window.history.back()}>
                        Página anterior
                    </Button>
                </div>

                <p className="text-sm text-muted-foreground mt-8">
                    URL solicitada: <code className="px-1 py-0.5 bg-muted rounded text-xs">{url}</code>
                </p>
            </div>
        </AppLayout>
    )
}
