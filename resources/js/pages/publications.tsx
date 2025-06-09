import React, { useState, useEffect } from "react"
import {
    Heart,
    Bookmark,
    MessageCircle,
    Share2,
    MoreHorizontal,
    ChevronLeft,
    ChevronRight,
    Plus,
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
import AppLayout from "@/layouts/app-layout"
import { usePage, Head, router, Link } from "@inertiajs/react"
import type { BreadcrumbItem } from "@/types"
import { PlaceholderPattern } from "@/components/ui/placeholder-pattern"
import { PostDialog } from "@/components/publication-dialog"
import { Role } from "@/types/Role"
import { Preset } from "@/types/Preset"
import { SharedData } from "@/types"
import { toast } from "sonner"

// ——— 1. Interfaces actualizadas según tu JSON real ———
interface BackendImage {
    id: number
    publication_id: number
    url: string
    created_at: string
    updated_at: string
}

interface BackendUser {
    id: number
    name: string
    username: string
    email: string
    profile_image: string | null
    status: number
    plan_id: number
    role_id: number
    description: string
    email_verified_at: string | null
    created_at: string
    updated_at: string
    profile_image_url: string | null
}

interface BackendHashtag {
    id: number
    name: string
    slug: string
    created_at: string
    updated_at: string
    pivot: {
        publication_id: number
        hashtag_id: number
    }
}

interface BackendPublication {
    id: number
    user_id: number
    title: string
    description: string
    preset_id: number
    created_at: string
    updated_at: string
    user: BackendUser
    images: BackendImage[]
    preset: Preset
    hashtags: BackendHashtag[]
}

// Nosotros queremos este shape “en memoria”, incluyendo likes_count, comments_count, etc.
interface Publication {
    id: number
    user: {
        name: string
        username: string
        avatar_url: string | null
        role: Role
    }
    images: BackendImage[]
    title: string
    description: string
    likes_count: number
    comments_count: number
    created_at: string
    liked: boolean
    saved: boolean
    hashtags: string[]
}

interface Paginated<T> {
    data: T[]
    current_page: number
    last_page: number
    per_page: number
    total: number
}

const breadcrumbs: BreadcrumbItem[] = [{ title: "Publicaciones", href: "/publications" }]

export default function PublicationsPage() {
    // 2. Desestructuramos el prop que viene de Inertia (este es el JSON “raw” que mostraste en tu pregunta)
    const { props } = usePage<{ publications: Paginated<BackendPublication> }>()
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const {
        data: backendPubs,
        current_page,
        last_page,
        per_page,
        total,
    } = props.publications

    // 3. Transformamos UNA SOLA VEZ los BackendPublication a Publication,
    //    inyectando likes_count = 0, comments_count = 0, liked = false, saved = false,
    //    y mapeando user y contenido.
    const [localPublications, setLocalPublications] = useState<Publication[]>([])
    const [createOpen, setCreateOpen] = useState(false) // estado del diálogo

    useEffect(() => {
        const mapped: Publication[] = backendPubs.map((pub) => ({
            id: pub.id,
            user: {
                name: pub.user.name,
                username: pub.user.username,
                avatar_url: pub.user.profile_image_url,
            },
            images: pub.images,
            title: pub.title,
            description: pub.description,
            likes_count: pub.likes_count,        // ← ahora usa el valor real
            comments_count: pub.comments_count,  // ← idem
            liked: pub.liked,                    // ← el booleano calculado en el controller
            saved: pub.saved ?? false,           // ← si lo envías, o false por defecto
            created_at: pub.created_at,
            hashtags: pub.hashtags.map((h) => h.name),
        }));

        setLocalPublications(mapped);
    }, [backendPubs]);

    // Helper para índice de imagen actual por publicación:
    const [currentImageIndex, setCurrentImageIndex] = useState<Record<number, number>>({})

    const nextImage = (pubId: number, totalImages: number) => {
        setCurrentImageIndex((prev) => {
            const current = prev[pubId] || 0
            return { ...prev, [pubId]: (current + 1) % totalImages }
        })
    }

    const prevImage = (pubId: number, totalImages: number) => {
        setCurrentImageIndex((prev) => {
            const current = prev[pubId] || 0
            return { ...prev, [pubId]: (current - 1 + totalImages) % totalImages }
        })
    }

    const getCurrentImageIndex = (pubId: number) => currentImageIndex[pubId] || 0

    // --- Función para manejar creación de publicación ---
    const handleCreateSubmit = (data: {
        title: string
        content: string
        featured_image: File | null
        attachments: File[]
        hashtags: string[]
    }) => {
        const formData = new FormData()
        formData.append("title", data.title)
        formData.append("description", data.content)
        if (data.featured_image) {
            formData.append("featured_image", data.featured_image)
        }
        data.attachments.forEach((file, idx) => {
            formData.append(`attachments[${idx}]`, file)
        })
        data.hashtags.forEach((tag, idx) => {
            formData.append(`hashtags[${idx}]`, tag)
        })
        router.post(route("publications.store"), formData, {
            preserveState: true,
            onSuccess: () => {
                setCreateOpen(false)
            },
        })
    }

    // Toggle de “Me gusta” (solo a nivel UI, sin persistencia aún)
    const toggleLike = (id: number) => {
        router.post(
            route('publications.toggleLike', id),
            {}, // no enviamos payload adicional
            {
                preserveState: true,   // mantiene el estado de la página actual
                preserveScroll: true,  // no pierde la posición de scroll
                onSuccess: (page) => {
                    // page.props contiene el JSON que devolviste en el controlador
                    const { liked, likes_count } = page.props
                    setLocalPublications(prev =>
                        prev.map(pub =>
                            pub.id === id
                                ? { ...pub, liked, likes_count }
                                : pub
                        )
                    )
                }
            }
        )
    };

    // En tu componente React:
    const { flash } = usePage().props;
    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success);
        }
    }, [flash.success]);


    // Toggle de “Guardar” (solo a nivel UI)
    const toggleSave = (id: number) => {
        setLocalPublications((prev) =>
            prev.map((pub) => {
                if (pub.id === id) return { ...pub, saved: !pub.saved }
                return pub
            })
        )
    }

    const paginate = (page: number) => {
        if (page < 1 || page > last_page) return
        router.get(
            route("publications.index", { page, perPage: per_page }),
            {},
            { preserveState: true }
        )
    }

    // Cálculo índice de items mostrados (solo para el texto de “Mostrando X–Y de Z”)
    const indexOfFirstItem = (current_page - 1) * per_page + 1
    const indexOfLastItem = Math.min(current_page * per_page, total)

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Publicaciones" />

            <div className="flex flex-col gap-4 p-4">
                <h1 className="text-2xl font-bold">Publicaciones</h1>

                <div className="flex justify-end items-center">
                    <PostDialog
                        trigger={
                            <Button variant="default" className="flex items-center">
                                <Plus className="h-4 w-4 mr-1" />
                                Nueva publicación
                            </Button>
                        }
                        open={createOpen}
                        onOpenChange={setCreateOpen}
                        onSubmit={handleCreateSubmit}
                        userRole_id={auth.user.role_id}
                    />
                </div>

                {/* Contenedor centralizado con una columna más estrecha */}
                <div className="max-w-xl mx-auto grid grid-cols-1 gap-4">
                    {localPublications.map((pub) => (
                        <Card
                            key={pub.id}
                            className="flex flex-col h-full cursor-pointer hover:shadow-lg transition-shadow duration-200"
                            onClick={() => router.get(route("publications.show", pub.id))}
                        >
                            <CardHeader className="px-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        {/* Envolvemos el Avatar en un <Link> para redirigir al perfil */}
                                        <Link
                                            href={route("profile.user", pub.user.username)}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage
                                                    src={pub.user.avatar_url || "/placeholder.svg"}
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
                                            <Button variant="ghost" size="icon" className="h-9 w-9">
                                                <MoreHorizontal className="h-5 w-5" />
                                                <span className="sr-only">Más opciones</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem>Copiar enlace</DropdownMenuItem>
                                            <DropdownMenuItem>Seguir usuario</DropdownMenuItem>
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
                                    {pub.images && pub.images.length > 0 ? (
                                        <img
                                            src={pub.images[getCurrentImageIndex(pub.id)].url}
                                            alt={`Publicación ${pub.id}`}
                                            className="w-full h-full object-cover transition-all duration-300"
                                        />
                                    ) : (
                                        <div className="w-full h-full">
                                            <PlaceholderPattern />
                                        </div>
                                    )}

                                    {/* Carrusel: flechas y puntos */}
                                    {pub.images && pub.images.length > 1 && (
                                        <>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full h-8 w-8"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    prevImage(pub.id, pub.images.length)
                                                }}
                                            >
                                                <ChevronLeft className="h-5 w-5" />
                                                <span className="sr-only">Anterior</span>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full h-8 w-8"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    nextImage(pub.id, pub.images.length)
                                                }}
                                            >
                                                <ChevronRight className="h-5 w-5" />
                                                <span className="sr-only">Siguiente</span>
                                            </Button>
                                            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1">
                                                {pub.images.map((_, idx) => (
                                                    <div
                                                        key={idx}
                                                        className={`h-1.5 rounded-full ${getCurrentImageIndex(pub.id) === idx
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
                                {/* Botones de interacción */}
                                <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center gap-4">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                toggleLike(pub.id)
                                            }}
                                            className={pub.liked ? "text-destructive" : ""}
                                        >
                                            <Heart
                                                className={`h-6 w-6 ${pub.liked ? "fill-destructive" : ""}`}
                                            />
                                            <span className="sr-only">Me gusta</span>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <MessageCircle className="h-6 w-6" />
                                            <span className="sr-only">Comentar</span>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <Share2 className="h-6 w-6" />
                                            <span className="sr-only">Compartir</span>
                                        </Button>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            toggleSave(pub.id)
                                        }}
                                        className={pub.saved ? "text-primary" : ""}
                                    >
                                        <Bookmark
                                            className={`h-6 w-6 ${pub.saved ? "fill-primary" : ""}`}
                                        />
                                        <span className="sr-only">Guardar</span>
                                    </Button>
                                </div>

                                {/* Información de la publicación */}
                                <div className="flex flex-col gap-2 w-full">
                                    {/* Me gusta */}
                                    <div className="font-medium">{pub.likes_count} me gusta</div>

                                    {/* Título */}
                                    <div className="font-medium">{pub.title}</div>

                                    {/* Descripción */}
                                    <div>{pub.description}</div>

                                    {/* Fecha */}
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
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                <div className="flex items-center justify-between mt-4 p-4 bg-card border rounded-lg">
                    <div className="text-sm text-muted-foreground">
                        Mostrando {indexOfFirstItem}-{indexOfLastItem} de {total} publicaciones
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => paginate(current_page - 1)}
                            disabled={current_page === 1}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <div className="text-sm">
                            Página {current_page} de {last_page}
                        </div>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => paginate(current_page + 1)}
                            disabled={current_page === last_page}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </AppLayout >
    )
}
