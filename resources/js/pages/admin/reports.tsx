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
import { Trash2, ArrowUpRight, UserRound } from "lucide-react"
import { toast } from "sonner"

type User = {
    id: number
    name: string
    username: string
    profile_image_url: string | null
}

type Report = {
    id: number
    message: string
    entity_type: string
    entity_id: number
    actor: User
    reported_user: User | null
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

    const goToUser = (username: string) => {
        router.visit(`/profile/${username}`)
    }

    const goToEntity = (type: string, id: number) => {
        const paths: Record<string, string> = {
            publication: "publications",
            preset: "presets",
            user: "users",
            comment: "comments",
        }
        const path = paths[type] || ""
        if (path) {
            router.visit(`/${path}/${id}`)
        }
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
                                    {report.reported_user && (
                                        <p className="text-card-foreground">
                                            <strong>Usuario reportado:</strong> {report.reported_user.name} ({report.reported_user.username})
                                        </p>
                                    )}
                                    <span className="text-sm text-muted-foreground">
                                        {new Date(report.created_at).toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    size="icon"
                                                    variant="secondary"
                                                    onClick={() => goToUser(report.actor.username)}
                                                >
                                                    <UserRound className="w-4 h-4" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Ver perfil del usuario que reportó</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>

                                    {report.reported_user && (
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        size="icon"
                                                        variant="secondary"
                                                        onClick={() => goToUser(report.reported_user!.username)}
                                                    >
                                                        <UserRound className="w-4 h-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Ver perfil del usuario reportado</p>
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
                                                    onClick={() => goToEntity(report.entity_type, report.entity_id)}
                                                >
                                                    <ArrowUpRight className="w-4 h-4" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Ver entidad reportada</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>

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
