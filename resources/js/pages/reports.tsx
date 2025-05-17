import { useState } from "react"
import { Head, useForm, route } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import type { BreadcrumbItem } from "@/types"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Trash2, Eye } from "lucide-react"

type Report = {
    id: number
    publication_title: string
    publication_id: number
    reason: string
    reporter_name: string
    status: "pending" | "reviewed" | "dismissed"
    created_at: string
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Reportes",
        href: "/reports",
    },
]

export default function Reports({ reports: initialReports }: { reports: Report[] }) {
    const [reports, setReports] = useState(initialReports)
    const form = useForm()

    const handleDelete = (id: number) => {
        form.delete(route("reports.destroy", id), {
            preserveScroll: true,
            onSuccess: () => {
                setReports((prev) => prev.filter((report) => report.id !== id))
            },
        })
    }

    const getStatusBadge = (status: Report["status"]) => {
        switch (status) {
            case "pending":
                return (
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                        Pendiente
                    </Badge>
                )
            case "reviewed":
                return (
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                        Revisado
                    </Badge>
                )
            case "dismissed":
                return (
                    <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-300">
                        Descartado
                    </Badge>
                )
            default:
                return null
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reportes de Publicaciones" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <h1 className="text-2xl font-bold">Reportes de Publicaciones</h1>
                <div className="space-y-4">
                    {reports.map((report) => (
                        <div key={report.id} className="bg-card border border-border rounded-lg p-4 shadow-md">
                            <div className="flex justify-between items-start gap-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-medium">{report.publication_title}</h3>
                                        {getStatusBadge(report.status)}
                                    </div>
                                    <p className="text-card-foreground">
                                        <span className="font-semibold">Razón:</span> {report.reason}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Reportado por: {report.reporter_name} • {new Date(report.created_at).toLocaleString()}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => (window.location.href = route("publications.show", report.publication_id))}
                                                >
                                                    <Eye className="w-5 h-5" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Ver publicación</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>

                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="destructive" size="icon" onClick={() => handleDelete(report.id)}>
                                                    <Trash2 className="w-5 h-5" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Borrar reporte</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </div>
                        </div>
                    ))}
                    {reports.length === 0 && (
                        <p className="text-muted-foreground">No hay reportes de publicaciones pendientes.</p>
                    )}
                </div>
            </div>
        </AppLayout>
    )
}
