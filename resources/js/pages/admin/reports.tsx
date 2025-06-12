import { useState } from "react"
import { Head, router } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import AdminLayout from "@/layouts/admin/layout"
import type { BreadcrumbItem } from "@/types"
import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"

type Report = {
    id: number
    message: string
    entity_type: string
    entity_id: number
    actor: {
        id: number
        name: string
        username: string
        profile_image_url: string | null
    }
    created_at: string
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Reportes",
        href: "/reports",
    },
]

export default function Reports({ reports: initialReports }: { reports: Report[] }) {
    const [reports, setReports] = useState<Report[]>(initialReports)

    /**
     * Elimina un reporte por ID, muestra un toast con el mensaje de sesión y actualiza el estado.
     */
    const destroyReport = (id: number) => {
        router.delete(route("reports.destroy", id), {
            preserveScroll: true,
            onSuccess: (page) => {
                const msg = page.props.flash.success as string | undefined
                if (msg) toast.success(msg)
                setReports((prev) => prev.filter((r) => r.id !== id))
            },
        })
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reportes" />
            <AdminLayout>
                <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                    <h1 className="text-2xl font-bold">Listado de reportes</h1>
                    <div className="space-y-4">
                        {reports.map((report) => (
                            <div
                                key={report.id}
                                className="bg-card border border-border rounded-lg p-4 shadow-md flex justify-between items-center gap-4"
                            >
                                <div className="space-y-1">
                                    <p className="text-card-foreground">
                                        <strong>Mensaje:</strong> {report.message}
                                    </p>
                                    <p className="text-card-foreground">
                                        <strong>Tipo:</strong> {report.entity_type}
                                    </p>
                                    <p className="text-card-foreground">
                                        <strong>ID Entidad:</strong> {report.entity_id}
                                    </p>
                                    <p className="text-card-foreground">
                                        <strong>Reportado por:</strong> {report.actor.name} ({report.actor.username})
                                    </p>
                                    <span className="text-sm text-muted-foreground">
                                        {new Date(report.created_at).toLocaleString()}
                                    </span>
                                </div>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                onClick={() => destroyReport(report.id)}
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Eliminar reporte</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        ))}
                        {reports.length === 0 && (
                            <p className="text-muted-foreground">No hay reportes.</p>
                        )}
                    </div>
                </div>
            </AdminLayout>
        </AppLayout>
    )
}
