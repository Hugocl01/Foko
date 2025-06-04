import type React from "react"
import { useState } from "react"
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
import { Badge } from "@/components/ui/badge"
import AppLayout from "@/layouts/app-layout"
import { usePage, Head, router } from "@inertiajs/react"
import type { BreadcrumbItem } from "@/types"
import { PlaceholderPattern } from "@/components/ui/placeholder-pattern"

interface Publication {
    id: number
    user: {
        name: string
        avatar_url: string | null
        username: string
    }
    images: string[]
    content: string
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
    const { props } = usePage<{ publications: Paginated<Publication> }>()
    const { data: publications, current_page, last_page, per_page, total } = props.publications

    const indexOfFirstItem = (current_page - 1) * per_page + 1
    const indexOfLastItem = Math.min(current_page * per_page, total)

    // Carrusel de imágenes por publicación
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

    // Likes y guardado (solo en estado local)
    const [localPublications, setLocalPublications] = useState<Publication[]>(publications)
    const toggleLike = (id: number) => {
        setLocalPublications((prev) =>
            prev.map((pub) => {
                if (pub.id === id) {
                    const liked = !pub.liked
                    return {
                        ...pub,
                        liked,
                        likes_count: liked ? pub.likes_count + 1 : pub.likes_count - 1,
                    }
                }
                return pub
            })
        )
    }
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Publicaciones" />
            <div className="flex flex-col gap-4 p-4">
                <h1 className="text-2xl font-bold">Publicaciones</h1>

                <div className="flex justify-end items-center">
                    <Button variant="default" className="flex items-center cursor-pointer">
                        <Plus className="h-4 w-4 mr-1" />
                        Nueva publicación
                    </Button>
                </div>

                {/* CONTENEDOR CENTRADO Y COLUMNA ÚNICA MÁS ESTRECHA */}
                <div className="max-w-xl mx-auto grid grid-cols-1 gap-4">
                    {localPublications.map((pub) => (
                        <Card
                            key={pub.id}
                            className="flex flex-col h-full cursor-pointer hover:shadow-lg transition-shadow duration-200"
                        >
                            <CardHeader className="px-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage
                                                src={pub.user.avatar_url || "/placeholder.svg"}
                                                alt={pub.user.name}
                                            />
                                            <AvatarFallback className="text-sm">
                                                {pub.user.name.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
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
                                            src={pub.images[getCurrentImageIndex(pub.id)]}
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
                                                onClick={() => prevImage(pub.id, pub.images.length)}
                                            >
                                                <ChevronLeft className="h-5 w-5" />
                                                <span className="sr-only">Anterior</span>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full h-8 w-8"
                                                onClick={() => nextImage(pub.id, pub.images.length)}
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

                            <CardFooter className="flex flex-col items-start gap-3 p-4">
                                <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center gap-4">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => toggleLike(pub.id)}
                                            className={pub.liked ? "text-destructive" : ""}
                                        >
                                            <Heart
                                                className={`h-6 w-6 ${pub.liked ? "fill-destructive" : ""}`}
                                            />
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
                                        onClick={() => toggleSave(pub.id)}
                                        className={pub.saved ? "text-primary" : ""}
                                    >
                                        <Bookmark
                                            className={`h-6 w-6 ${pub.saved ? "fill-primary" : ""}`}
                                        />
                                        <span className="sr-only">Guardar</span>
                                    </Button>
                                </div>
                                <div>
                                    <div className="font-medium">{pub.likes_count} me gusta</div>
                                    <div className="mt-1 line-clamp-2">
                                        <span className="font-medium">@{pub.user.username}</span>{" "}
                                        <span>{pub.content}</span>
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
        </AppLayout>
    )
}
