// resources/js/Pages/publication.tsx
import React, { useState, useMemo, useEffect } from "react"
import { Head, usePage, Link, router } from "@inertiajs/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import {
    Heart,
    Bookmark,
    MessageCircle,
    Share2,
    MoreHorizontal,
    ChevronLeft,
    ChevronRight,
    Trash2,
} from "lucide-react"
import AppLayout from "@/layouts/app-layout"
import type { BreadcrumbItem } from "@/types"
import { PlaceholderPattern } from "@/components/ui/placeholder-pattern"
import { toast } from "sonner"
import { PostDialog } from "@/components/publication-dialog"

interface BackendImage {
    id: number
    url: string
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
    description: string
    price: number
}

interface BackendHashtag {
    id: number
    name: string
}

interface BackendComment {
    id: number
    body: string
    created_at: string
    user: BackendUser
}

interface BackendPublication {
    id: number
    title: string
    description: string
    created_at: string
    user: BackendUser
    images: BackendImage[]
    preset: BackendPreset | null
    hashtags: BackendHashtag[]
    likes_count: number
    comments_count: number
    liked: boolean
    saved: boolean
}

export default function Publication() {
    const { props } = usePage<{
        publication: BackendPublication
        comments: BackendComment[]
        presets: BackendPreset[]
        auth: { user: { id: number; role_id: number } }
        flash: { success?: string }
    }>()
    const { publication: pub, comments, presets, auth, flash } = props
    const loggedUser = auth.user

    // Toast al cargar
    useEffect(() => {
        if (flash.success) toast.success(flash.success)
    }, [flash.success])

    // ¿Es dueño?
    const isOwner = useMemo(
        () => pub.user.id === loggedUser.id,
        [pub.user.id, loggedUser.id]
    )

    // Control edición
    const [isEditOpen, setIsEditOpen] = useState(false)
    const initialPostValues = useMemo(
        () => ({
            id: String(pub.id),
            title: pub.title,
            description: pub.description,
            featured_image: null as File | null,
            images: [] as File[],
            hashtags: pub.hashtags.map((h) => h.name),
            preset_id: pub.preset?.id,
        }),
        [pub]
    )

    // Like / save
    const [liked, setLiked] = useState(pub.liked)
    const [likesCount, setLikesCount] = useState(pub.likes_count)
    const [saved, setSaved] = useState(pub.saved)

    function toggleLike() {
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

    function toggleSave() {
        router.post(
            route("publications.toggleSave", pub.id),
            {},
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: (page) => {
                    const updated: BackendPublication = page.props.publication
                    setSaved(updated.saved)
                },
            }
        )
    }

    // Actualizar publicación
    function handleUpdatePublication(data: PostFormData) {
        const payload: Record<string, any> = {
            _method: "patch",
            title: data.title,
            description: data.description,
            hashtags: data.hashtags,
            preset_id: data.preset_id,
        }

        // Si el usuario seleccionó un featured_image, lo añadimos
        if (data.featured_image) {
            payload.featured_image = data.featured_image
        }

        // Si subió imágenes adicionales, las añadimos
        if (data.images.length > 0) {
            payload.images = data.images
        }

        router.post(
            route("publications.update", pub.id),
            payload,
            {
                forceFormData: true,    // convierte payload en FormData y adjunta los File
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

    // Estado y handler para el diálogo de borrado
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    function handleDelete() {
        router.delete(
            route("publications.destroy", pub.id),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success("Publicación eliminada correctamente")
                },
                onError: () => {
                    toast.error("Error al eliminar la publicación")
                },
            }
        )
    }

    // Breadcrumbs
    const breadcrumbs: BreadcrumbItem[] = [
        { title: "Publicaciones", href: "/publications" },
        { title: pub.title, href: "" },
    ]

    // Carrusel
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const totalImages = pub.images.length
    const nextImage = () =>
        setCurrentImageIndex((i) => (i + 1) % totalImages)
    const prevImage = () =>
        setCurrentImageIndex((i) => (i - 1 + totalImages) % totalImages)

    console.log(pub)
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={pub.title} />

            <div className="flex flex-col gap-4 p-4 max-w-2xl mx-auto">
                {/* Título + editar */}
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold">{pub.title}</h1>
                    {isOwner && (
                        <>
                            <Button
                                size="sm"
                                variant="default"
                                onClick={() => setIsEditOpen(true)}              >
                                Editar
                            </Button>
                            <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => setIsDeleteDialogOpen(true)}
                            >
                                Eliminar
                            </Button>
                        </>
                    )}
                </div>

                {/* Card principal */}
                <Card className="flex flex-col h-full">
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
                                        <AvatarFallback>
                                            {pub.user.name.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                </Link>
                                <div className="flex flex-col">
                                    <div className="font-medium text-base">
                                        {pub.user.name}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        @{pub.user.username}
                                    </div>
                                </div>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 cursor-pointer"
                                    >
                                        <MoreHorizontal className="h-5 w-5" />
                                        <span className="sr-only">Más opciones</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <Link
                                        href={route("profile.user", pub.user.username)}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <DropdownMenuItem>Ver perfil</DropdownMenuItem>
                                    </Link>
                                    <DropdownMenuItem>Copiar enlace</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-destructive">
                                        Reportar
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </CardHeader>

                    <CardContent className="relative flex-grow p-0">
                        <div className="relative aspect-square overflow-hidden bg-gray-100">
                            {totalImages > 0 ? (
                                <img
                                    src={pub.images[currentImageIndex].url}
                                    alt={`Imagen ${currentImageIndex + 1}`}
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
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full h-8 w-8"
                                        onClick={nextImage}
                                    >
                                        <ChevronRight className="h-5 w-5" />
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

                    <CardFooter className="flex flex-col gap-4 p-4">
                        <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-4">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={toggleLike}
                                    className={liked ? "text-destructive" : ""}
                                >
                                    <Heart
                                        className={`h-6 w-6 ${liked ? "fill-destructive" : ""
                                            }`}
                                    />
                                </Button>
                                <Button variant="ghost" size="icon">
                                    <MessageCircle className="h-6 w-6" />
                                </Button>
                                <Button variant="ghost" size="icon">
                                    <Share2 className="h-6 w-6" />
                                </Button>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={toggleSave}
                                className={saved ? "text-primary" : ""}
                            >
                                <Bookmark
                                    className={`h-6 w-6 ${saved ? "fill-primary" : ""
                                        }`}
                                />
                            </Button>
                        </div>

                        <div className="flex flex-col gap-2 w-full">
                            <div className="font-medium">{likesCount} me gusta</div>
                            <div className="font-medium">{pub.title}</div>
                            <div>{pub.description}</div>
                            <div className="flex flex-wrap gap-1 mb-3">
                                {pub.hashtags.map((hashtag) => (
                                    <Link
                                        key={hashtag.id}
                                        href={`/publications?hashtag=${encodeURIComponent(hashtag.name)}`}
                                        className="inline-block"
                                    >
                                        <Badge variant="default" className="text-xs cursor-pointer">
                                            #{hashtag.name}
                                        </Badge>
                                    </Link>
                                ))}
                            </div>
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

                        {/* PRESET APLICADO */}
                        {pub.preset && (
                            <Card className="mt-8 w-full group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 hover:border-border">
                                <Link
                                    href={route("presets.show", pub.preset.id)}
                                    className="block"
                                >
                                    <CardHeader className="pb-3">
                                        <Badge
                                            variant="secondary"
                                            className="text-xs font-medium"
                                        >
                                            Preset aplicado
                                        </Badge>
                                    </CardHeader>
                                    <CardContent className="pb-4">
                                        <h3 className="text-lg font-semibold mb-2 group-hover:text-primary">
                                            {pub.preset.name}
                                        </h3>
                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                            {pub.preset.description}
                                        </p>
                                    </CardContent>
                                    <CardFooter className="pt-4 border-t">
                                        <div className="flex items-center justify-between w-full">
                                            <span className="text-sm text-muted-foreground">
                                                Precio
                                            </span>
                                            <div className="text-lg font-semibold">
                                                <Badge>{pub.preset.price} €</Badge>
                                            </div>
                                        </div>
                                    </CardFooter>
                                </Link>
                            </Card>
                        )}
                    </CardFooter>
                </Card>

                {/* COMENTARIOS */}
                <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-4">
                        Comentarios ({comments.length})
                    </h2>
                    <div className="space-y-4">
                        {comments.map((c) => (
                            <div key={c.id} className="flex gap-3">
                                <Link
                                    href={route("profile.user", c.user.username)}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage
                                            src={
                                                c.user.profile_image_url ||
                                                "/placeholder.svg"
                                            }
                                            alt={c.user.name}
                                        />
                                        <AvatarFallback>
                                            {c.user.name.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                </Link>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">
                                            {c.user.name}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {new Date(c.created_at).toLocaleString(
                                                "es-ES",
                                                {
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                }
                                            )}
                                        </span>
                                    </div>
                                    <p className="mt-1">{c.body}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Diálogo Confirmación Borrado */}
                <Dialog
                    open={isDeleteDialogOpen}
                    onOpenChange={setIsDeleteDialogOpen}
                >
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Confirmar eliminación</DialogTitle>
                            <DialogDescription>
                                ¿Estás seguro de que deseas eliminar la publicación{" "}
                                <strong>{pub.title}</strong>? Esta acción no se puede deshacer.
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
                                <Trash2 className="h-4 w-4 mr-1" />
                                Eliminar publicación
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* DIALOGO EDICIÓN */}
                <PostDialog
                    trigger={null}
                    open={isEditOpen}
                    onOpenChange={setIsEditOpen}
                    isEditing
                    initialData={initialPostValues}
                    onSubmit={handleUpdatePublication}
                    userRole_id={loggedUser.role_id}
                    presets={presets}
                />
            </div >
        </AppLayout >
    )
}
