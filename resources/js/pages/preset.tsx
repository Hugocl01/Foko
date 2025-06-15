import { useState, useMemo } from "react"
import {
    Download,
    Share2,
    Eye,
    EyeOff,
    MoreHorizontal,
    Calendar,
    Trash2,
    Star,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import AppLayout from "@/layouts/app-layout"
import { usePage, Head, Link, router } from "@inertiajs/react"
import type { BreadcrumbItem } from "@/types"
import { toast } from "sonner"
import { PresetDialog } from "@/components/preset-dialog"

interface Hashtag {
    id: number
    name: string
    slug: string
    created_at: string
    updated_at: string
    pivot: {
        preset_id: number
        hashtag_id: number
    }
}

interface Purchase {
    id: number
    user: User
    preset_id: number
    created_at: string
    updated_at: string
}

interface User {
    id: number
    name: string
    username: string | null
    email: string
    profile_image: string | null
    status: number
    plan_id: number
    role_id: number
    description: string | null
    email_verified_at: string | null
    created_at: string
    updated_at: string
    profile_image_url: string | null
}

interface Preset {
    id: number
    name: string
    description: string
    price: string
    file: string
    before_image: string | null
    after_image: string | null
    user_id: number
    created_at: string
    updated_at: string
    user: User
    hashtags: Hashtag[]
    purchases: Purchase[]
    likes_count?: number
    is_liked?: boolean
}

export default function PresetDetailPage() {
    const {
        props: { preset, auth },
    } = usePage<{ preset: Preset; auth: { user: User } }>()

    const downloadUrl = route("purchases.download", { preset: preset.id })
    const loggedUser = auth.user

    // 1) Saber si el usuario autenticado es el creador del preset
    const isOwner = useMemo(
        () => Number(preset.user.id) === Number(loggedUser.id),
        [preset.user.id, loggedUser.id]
    );

    // Premium flag para borde y badge
    const isPremium = useMemo(
        () => preset.user.plan_id !== 2,
        [preset.user.plan_id]
    )

    // 2) Saber si el usuario autenticado ya compró este preset (sin incluir al creador)
    const hasPurchased = useMemo(
        () =>
            preset.purchases.some(
                (purchase) => Number(purchase.user.id) === Number(loggedUser.id)
            ),
        [preset.purchases, loggedUser.id]
    );

    const [viewMode, setViewMode] = useState<"before" | "after">("after")
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

    const breadcrumbs: BreadcrumbItem[] = [
        { title: "Presets", href: "/presets" },
        { title: preset.name, href: `/presets/${preset.id}` },
    ]

    const avatarUrl = (url: string | null) => url ?? "/placeholder.svg"
    const getImageUrl = (mode: "before" | "after") => {
        const url = mode === "before" ? preset.before_image : preset.after_image
        return url ?? "/placeholder.svg"
    }

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: preset.name,
                text: preset.description,
                url: window.location.href,
            })
        } else {
            navigator.clipboard.writeText(window.location.href)
            toast.success("Enlace copiado al portapapeles")
        }
    }

    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })

    const handlePurchase = () => {
        router.post(
            route("purchases.store", { preset: preset.id }),
            {},
            {
                onSuccess: () => {
                    toast.success("¡Compra registrada con éxito!")
                    router.reload()
                },
                onError: (errors) => {
                    if (errors.message) toast.error(errors.message)
                },
            }
        )
    }

    const handleDelete = () => {
        router.delete(route("presets.destroy", preset.id), {
            onSuccess: () => {
                toast.success("Preset eliminado correctamente")
                router.visit(route("presets.index"))
            },
            onError: () => {
                toast.error("Error al eliminar el preset")
            },
        })
    }

    const handleUpdatePreset = (data: {
        id?: string
        name: string
        description: string
        price: string
        file: File | null
        before_image: File | null
        after_image: File | null
        hashtags: string[]
    }) => {
        router.post(
            route("presets.update", preset.id),
            {
                _method: "patch",
                name: data.name,
                description: data.description,
                price: data.price,
                file: data.file,
                before_image: data.before_image,
                after_image: data.after_image,
                hashtags: data.hashtags,
            },
            {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => {
                    toast.success("Preset actualizado con éxito")
                    setIsEditOpen(false)
                    router.reload()
                },
                onError: (errors) => {
                    toast.error("Error al actualizar")
                },
            }
        )
    }

    const initialPresetValues = useMemo(() => {
        return {
            id: String(preset.id),
            name: preset.name,
            description: preset.description,
            price: preset.price,
            file: null,
            before_image: null,
            after_image: null,
            hashtags: preset.hashtags.map((h) => h.name),
        }
    }, [preset])

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={preset.name} />
            <div className="flex flex-col gap-4 p-4">
                {/* ENCABEZADO */}
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold">{preset.name}</h1>

                    {/* Editar (solo creador) */}
                    {loggedUser.id === preset.user.id && (
                        <Button size="sm" variant="outline" onClick={() => setIsEditOpen(true)}>
                            Editar
                        </Button>
                    )}

                    {/* Eliminar (solo creador) */}
                    {loggedUser.id === preset.user.id && (
                        <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setIsDeleteDialogOpen(true)}
                            className="ml-2"
                        >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Eliminar
                        </Button>
                    )}
                </div>

                {/* CUERPO PRINCIPAL */}
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
                    <div className="xl:col-span-3">
                        <Card className={`flex flex-col h-full ${isPremium ? "border-emerald-500" : ""
                            }`}>
                            <CardHeader className="px-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        {/*  Aquí envolvemos Avatar en un Link que apunta a profile.user */}
                                        <Link href={route("profile.user", { user: preset.user.username })}>
                                            <Avatar className="h-10 w-10 cursor-pointer">
                                                <AvatarImage
                                                    src={avatarUrl(preset.user.profile_image)}
                                                    alt={preset.user.name}
                                                />
                                                <AvatarFallback className="text-sm">
                                                    {preset.user.name.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                        </Link>
                                        <div className="flex flex-col">
                                            <div className="font-medium text-base flex items-center">
                                                {preset.user.name}
                                                {isPremium && (
                                                    <Badge variant="outline" className="ml-2 flex items-center">
                                                        <Star className="h-4 w-4 mr-1 text-amber-500" /> Premium
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                @{preset.user.username || "usuario"}
                                            </div>
                                        </div>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-9 w-9 cursor-pointer">
                                                <MoreHorizontal className="h-5 w-5" />
                                                <span className="sr-only">Más opciones</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <Link href={route("profile.user", { user: preset.user.username })}>
                                                <DropdownMenuItem className="cursor-pointer">Ver perfil</DropdownMenuItem>
                                            </Link>
                                            <DropdownMenuItem className="cursor-pointer">Copiar enlace</DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-destructive cursor-pointer">Reportar</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </CardHeader>

                            <CardContent className="p-0 space-y-4">
                                {/* Imagen principal */}
                                <div className="relative aspect-video overflow-hidden bg-gray-100">
                                    <img
                                        src={getImageUrl(viewMode)}
                                        alt={`${preset.name} - ${viewMode}`}
                                        className="w-full h-full object-cover transition-all duration-300"
                                    />

                                    {/* Controles “Antes/Después” */}
                                    <div className="absolute top-2 left-2">
                                        <ToggleGroup
                                            type="single"
                                            value={viewMode}
                                            onValueChange={(value) =>
                                                value && setViewMode(value as "before" | "after")
                                            }
                                            className="bg-black/50 rounded-md p-1"
                                        >
                                            <ToggleGroupItem
                                                value="before"
                                                size="sm"
                                                className="text-white data-[state=on]:bg-white data-[state=on]:text-black transition-all duration-200"
                                            >
                                                <EyeOff className="h-3 w-3 mr-1" />
                                                Antes
                                            </ToggleGroupItem>
                                            <ToggleGroupItem
                                                value="after"
                                                size="sm"
                                                className="text-white data-[state=on]:bg-white data-[state=on]:text-black transition-all duration-200"
                                            >
                                                <Eye className="h-3 w-3 mr-1" />
                                                Después
                                            </ToggleGroupItem>
                                        </ToggleGroup>
                                    </div>

                                    {/* Compartir */}
                                    <div className="absolute top-2 right-2 flex gap-2">
                                        <Button variant="default" size="icon" onClick={handleShare}>
                                            <Share2 className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    {/* Precio */}
                                    <Badge variant="default" className="absolute bottom-2 right-2">
                                        {Number(preset.price).toFixed(2)} €
                                    </Badge>
                                </div>

                                {/* Miniaturas “Antes/Después” */}
                                <div className="px-4 pb-2">
                                    <div className="grid grid-cols-2 gap-3">
                                        {(["before", "after"] as const).map((mode) => (
                                            <div
                                                key={mode}
                                                className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 ${viewMode === mode
                                                    ? "border-primary shadow-md"
                                                    : "border-gray-200 hover:border-gray-300"
                                                    }`}
                                                onClick={() => setViewMode(mode)}
                                            >
                                                <div className="relative aspect-video bg-gray-100">
                                                    <img
                                                        src={getImageUrl(mode)}
                                                        alt={mode === "before" ? "Antes" : "Después"}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                                        <Badge variant="secondary" className="text-xs">
                                                            {mode === "before" ? "Antes" : "Después"}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>

                            <CardFooter className="flex flex-col items-start gap-3 p-4 pt-0">
                                <div className="w-full">
                                    <div className="font-semibold">{preset.name}</div>
                                    <div className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                        {preset.description}
                                    </div>
                                    <div className="flex flex-wrap gap-1 mb-3">
                                        {preset.hashtags.map((hashtag) => (
                                            <Link
                                                key={hashtag.id}
                                                href={`/presets?hashtag=${encodeURIComponent(hashtag.name)}`}
                                                className="inline-block"
                                            >
                                                <Badge variant="default" className="text-xs cursor-pointer">
                                                    #{hashtag.name}
                                                </Badge>
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                                {/* Botones “Descargar” / “Comprar” */}
                                {isOwner || hasPurchased ? (
                                    <Button asChild variant="default" size="sm" className="w-full">
                                        <a href={downloadUrl}>
                                            <Download className="h-4 w-4 mr-1" /> Descargar
                                        </a>
                                    </Button>
                                ) : (
                                    <Button
                                        variant="default"
                                        size="sm"
                                        className="w-full"
                                        onClick={handlePurchase}
                                    >
                                        <Download className="h-4 w-4 mr-1" /> Comprar
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                    </div>

                    {/* PANEL LATERAL */}
                    <div className="xl:col-span-1 space-y-4">
                        <Card className={`${isPremium ? "border-emerald-500" : ""}`}>
                            <CardContent className="px-4">
                                <div className="text-center space-y-4">
                                    {loggedUser.id === preset.user.id || hasPurchased ? (
                                        <Badge className="bg-green-500 text-white">Descargable</Badge>
                                    ) : null}

                                    <div className="flex items-center justify-center gap-2">
                                        <span className="text-3xl font-bold">
                                            {Number(preset.price).toFixed(2)} €
                                        </span>
                                    </div>

                                    {isOwner || hasPurchased ? (
                                        <Button asChild variant="default" size="lg" className="w-full">
                                            <a href={downloadUrl}>
                                                <Download className="h-5 w-5 mr-2" /> Descargar
                                            </a>
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="default"
                                            size="lg"
                                            className="w-full"
                                            onClick={handlePurchase}
                                        >
                                            <Download className="h-5 w-5 mr-2" /> Comprar Preset
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className={`${isPremium ? "border-emerald-500" : ""}`}>
                            <CardHeader className="px-4 pb-2">
                                <h3 className="font-semibold">Información del preset</h3>
                            </CardHeader>
                            <CardContent className="px-4 pt-0 space-y-4">
                                <div>
                                    <h4 className="text-sm font-medium mb-1">Descripción</h4>
                                    <p className="text-muted-foreground leading-relaxed text-sm">
                                        {preset.description}
                                    </p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium mb-1">
                                        Fecha de publicación
                                    </h4>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        <span className="text-sm text-muted-foreground">
                                            {formatDate(preset.created_at)}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium mb-2">Etiquetas</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {preset.hashtags.map((hashtag) => (
                                            <Link
                                                key={hashtag.id}
                                                href={`/presets?hashtag=${encodeURIComponent(hashtag.name)}`}
                                                className="inline-block"
                                            >
                                                <Badge variant="default" className="cursor-pointer text-xs">
                                                    #{hashtag.name}
                                                </Badge>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* MODAL DE CONFIRMACIÓN DE BORRADO */}
                <Dialog
                    open={isDeleteDialogOpen}
                    onOpenChange={setIsDeleteDialogOpen}
                >
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Confirmar eliminación</DialogTitle>
                            <DialogDescription>
                                ¿Estás seguro de que deseas eliminar el preset{" "}
                                <strong>{preset.name}</strong>? Esta acción no se puede deshacer.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="flex flex-wrap gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setIsDeleteDialogOpen(false)}
                            >
                                Cancelar
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleDelete}
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Eliminar preset
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* MODAL DE EDICIÓN */}
                <PresetDialog
                    trigger={null}
                    open={isEditOpen}
                    onOpenChange={setIsEditOpen}
                    isEditing
                    initialData={initialPresetValues}
                    onSubmit={handleUpdatePreset}
                />
            </div>
        </AppLayout >
    )
}
