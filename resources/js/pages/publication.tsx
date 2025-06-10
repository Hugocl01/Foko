import React, { useState, useMemo, useEffect } from "react"
import { Head, usePage, Link, router } from "@inertiajs/react"
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
import {
    Heart,
    Bookmark,
    MessageCircle,
    Share2,
    MoreHorizontal,
    ChevronLeft,
    ChevronRight,
    ArrowLeft,
} from "lucide-react"
import AppLayout from "@/layouts/app-layout"
import type { BreadcrumbItem } from "@/types"
import { PlaceholderPattern } from "@/components/ui/placeholder-pattern"
import { toast } from "sonner"
import { PostDialog } from "@/components/publication-dialog"

interface BackendImage {
    id: number
    url: string
    // otros campos si los hubiera...
}

interface BackendUser {
    id: number
    name: string
    username: string
    profile_image_url?: string
}

interface BackendPreset {
    id: number
    name: string
    price: number
    description: string
}

interface BackendHashtag {
    id: number
    name: string
}

interface BackendPublication {
    id: number
    user_id: number
    title: string
    description: string
    created_at: string
    user: BackendUser
    images: BackendImage[]
    preset: BackendPreset
    hashtags: BackendHashtag[]
    likes_count: number
    liked: boolean
    saved: boolean          // <-- añadido
}

export default function PublicationShow() {
    const {
        props: { publication: pub, auth, flash },
    } = usePage<{
        publication: BackendPublication
        auth: { user: BackendUser }
        flash: { success?: string }
    }>()

    const loggedUser = auth.user

    // Mostrar toast de éxito si viene flash
    useEffect(() => {
        if (flash.success) toast.success(flash.success)
    }, [flash.success])

    // Determinar si el usuario actual es el creador
    const isOwner = useMemo(
        () => Number(pub.user.id) === Number(loggedUser.id),
        [pub.user.id, loggedUser.id]
    )

    // Control del diálogo de edición
    const [isEditOpen, setIsEditOpen] = useState(false)

    // Valores iniciales para el formulario de edición
    const initialPostValues = useMemo(
        () => ({
            id: String(pub.id),
            title: pub.title,
            content: pub.description,
            featured_image: null as File | null,
            images: [] as File[],
            hashtags: pub.hashtags.map((h) => h.name),
        }),
        [pub]
    )

    // Handlers de like y save
    const [liked, setLiked] = useState(pub.liked)
    const [likesCount, setLikesCount] = useState(pub.likes_count)
    const [saved, setSaved] = useState(pub.saved)  // <-- inicializado desde prop

    const toggleLike = () => {
        router.post(
            route("publications.toggleLike", pub.id),
            {},
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: (page) => {
                    const updated: BackendPublication = page.props.publication
                    setLiked(updated.liked)
                    setLikesCount(updated.likes_count)
                },
            }
        )
    }

    const toggleSave = () => {
        router.post(
            route("publications.toggleSave", pub.id),
            {},
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: (page) => {
                    const updated: BackendPublication = page.props.publication
                    setSaved(updated.saved)     // <-- actualizar estado
                },
            }
        )
    }

    // Handler para enviar la actualización
    const handleUpdatePublication = (data: {
        id?: string
        title: string
        content: string
        featured_image: File | null
        images: File[]
        hashtags: string[]
    }) => {
        router.post(
            route("publications.update", pub.id),
            {
                _method: "patch",
                title: data.title,
                content: data.content,
                hashtags: data.hashtags,
            },
            {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => {
                    toast.success("Publicación actualizada con éxito")
                    setIsEditOpen(false)
                    router.reload()
                },
                onError: () => {
                    toast.error("Error al actualizar la publicación")
                },
            }
        )
    }

    // Breadcrumbs
    const pageBreadcrumbs: BreadcrumbItem[] = [
        { title: "Publicaciones", href: "/publications" },
        { title: pub.title, href: "" },
    ]

    // Carrusel de imágenes
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const totalImages = pub.images.length
    const nextImage = () => setCurrentImageIndex((i) => (i + 1) % totalImages)
    const prevImage = () => setCurrentImageIndex((i) => (i - 1 + totalImages) % totalImages)

    return (
        <AppLayout breadcrumbs={pageBreadcrumbs}>
            <Head title={pub.title} />

            <div className="flex flex-col gap-4 p-4 max-w-2xl mx-auto">
                {/* Título + Editar */}
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold">{pub.title}</h1>
                    {isOwner && (
                        <Button size="sm" variant="outline" onClick={() => setIsEditOpen(true)}>
                            Editar
                        </Button>
                    )}
                </div>

                <Card className="flex flex-col h-full">
                    {/* Header */}
                    <CardHeader className="px-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Link
                                    href={route("profile.user", pub.user.username)}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage
                                            src={pub.user.profile_image_url || "/placeholder.svg"}
                                            alt={pub.user.name}
                                        />
                                        <AvatarFallback className="text-sm">
                                            {pub.user.name.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                </Link>
                                <div className="flex flex-col">
                                    <div className="font-medium text-base">{pub.user.name}</div>
                                    <div className="text-sm text-muted-foreground">
                                        @{pub.user.username}
                                    </div>
                                </div>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
                                        <MoreHorizontal className="h-5 w-5" />
                                        <span className="sr-only">Más opciones</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <Link
                                        href={route("profile.user", pub.user.username)}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <DropdownMenuItem className="cursor-pointer">Ver perfil</DropdownMenuItem>
                                    </Link>
                                    <DropdownMenuItem className="cursor-pointer">Copiar enlace</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-destructive cursor-pointer">
                                        Reportar
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </CardHeader>

                    {/* Carrusel */}
                    <CardContent className="relative flex-grow p-0">
                        <div className="relative aspect-square overflow-hidden bg-gray-100">
                            {totalImages > 0 ? (
                                <img
                                    src={pub.images[currentImageIndex].url}
                                    alt={`Imagen ${currentImageIndex + 1} de ${totalImages}`}
                                    className="w-full h-full object-cover transition-all duration-300"
                                />
                            ) : (
                                <PlaceholderPattern />
                            )}

                            {totalImages > 1 && (
                                <>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full h-8 w-8"
                                        onClick={prevImage}
                                    >
                                        <ChevronLeft className="h-5 w-5" />
                                        <span className="sr-only">Anterior</span>
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full h-8 w-8"
                                        onClick={nextImage}
                                    >
                                        <ChevronRight className="h-5 w-5" />
                                        <span className="sr-only">Siguiente</span>
                                    </Button>
                                    <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1">
                                        {pub.images.map((_, idx) => (
                                            <div
                                                key={idx}
                                                className={`h-1.5 rounded-full ${currentImageIndex === idx
                                                    ? "w-4 bg-white"
                                                    : "w-1.5 bg-white/60"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </CardContent>

                    {/* Footer */}
                    <CardFooter className="flex flex-col items-start gap-4 p-4">
                        <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-4">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={toggleLike}
                                    className={liked ? "text-destructive" : ""}
                                >
                                    <Heart className={`h-6 w-6 ${liked ? "fill-destructive" : ""}`} />
                                    <span className="sr-only">Me gusta</span>
                                </Button>
                                <Button variant="ghost" size="icon">
                                    <MessageCircle className="h-6 w-6" />
                                    <span className="sr-only">Comentar</span>
                                </Button>
                                <Button variant="ghost" size="icon">
                                    <Share2 className="h-6 w-6" />
                                    <span className="sr-only">Compartir</span>
                                </Button>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={toggleSave}
                                className={saved ? "text-primary" : ""}
                            >
                                <Bookmark className={`h-6 w-6 ${saved ? "fill-primary" : ""}`} />
                                <span className="sr-only">Guardar</span>
                            </Button>
                        </div>

                        <div className="w-full flex flex-col gap-2">
                            <div className="font-medium">{likesCount} me gusta</div>
                            <div className="font-medium">{pub.title}</div>
                            <div>{pub.description}</div>
                            <div className="text-xs text-muted-foreground mt-2">
                                {new Date(pub.created_at).toLocaleString("es-ES", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </div>
                        </div>

                        {pub.hashtags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {pub.hashtags.map((h) => (
                                    <Badge key={h.id} variant="default">
                                        #{h.name}
                                    </Badge>
                                ))}
                            </div>
                        )}

                        <Card className="w-full group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 hover:border-border">
                            <Link href={route("presets.show", pub.preset.id)} className="block">
                                <CardHeader className="pb-3">
                                    <Badge variant="secondary" className="text-xs font-medium">
                                        Preset aplicado
                                    </Badge>
                                </CardHeader>

                                <CardContent className="pb-4">
                                    <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-200">
                                        {pub.preset.name}
                                    </h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                                        {pub.preset.description}
                                    </p>
                                </CardContent>

                                <CardFooter className="pt-4 border-t bg-muted/30">
                                    <div className="flex items-center justify-between w-full">
                                        <span className="text-sm text-muted-foreground">Precio</span>
                                        <div className="flex items-center gap-1 text-lg font-semibold text-foreground">
                                            <Badge>{pub.preset.price} €</Badge>
                                        </div>
                                    </div>
                                </CardFooter>
                            </Link>
                        </Card>
                    </CardFooter>
                </Card>

                <PostDialog
                    trigger={null}
                    open={isEditOpen}
                    onOpenChange={setIsEditOpen}
                    isEditing
                    initialData={initialPostValues}
                    onSubmit={handleUpdatePublication}
                    userRole_id={loggedUser.role_id}
                />
            </div>
        </AppLayout>
    )
}
