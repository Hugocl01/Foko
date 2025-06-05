import React, { useState } from "react"
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
    ArrowRight,
} from "lucide-react"
import AppLayout from "@/layouts/app-layout"
import type { BreadcrumbItem } from "@/types"
import { PlaceholderPattern } from "@/components/ui/placeholder-pattern"

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

interface BackendPreset {
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
    preset: BackendPreset
    hashtags: BackendHashtag[]
}

interface PublicationProps {
    publication: BackendPublication
}

export default function PublicationShow() {
    const { props } = usePage<{ publication: BackendPublication }>()
    const pub = props.publication

    // Añadimos el breadcrumb de la publicación actual (solo título, sin href)
    const pageBreadcrumbs: BreadcrumbItem[] = [
        { title: "Publicaciones", href: "/publications" },
        { title: pub.title, href: "" },
    ]

    // Estado local para carrusel de imágenes (solo índice actual)
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0)

    const totalImages = pub.images.length

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % totalImages)
    }
    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + totalImages) % totalImages)
    }

    // Estados locales de “me gusta” y “guardar” (solo UI)
    const [liked, setLiked] = useState<boolean>(false)
    const [likesCount, setLikesCount] = useState<number>(0) // Podrías inicializar desde pub.likes_count si lo envías
    const [saved, setSaved] = useState<boolean>(false)

    const toggleLike = () => {
        const nuevoLiked = !liked
        setLiked(nuevoLiked)
        setLikesCount((prev) => (nuevoLiked ? prev + 1 : Math.max(prev - 1, 0)))
        // Aquí podrías hacer la llamada al servidor:
        // router.post(route("publications.like", pub.id))
    }

    const toggleSave = () => {
        setSaved((prev) => !prev)
        // Aquí podrías hacer la llamada para “guardar publicación”
    }

    return (
        <AppLayout breadcrumbs={pageBreadcrumbs}>
            <Head title={pub.title} />

            <div className="flex flex-col gap-4 p-4 max-w-2xl mx-auto">
                {/* Botón “Volver a listado” */}
                <div className="flex items-center gap-4">
                    <Link href="/publications">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold">{pub.title}</h1>
                </div>

                <Card className="flex flex-col h-full">
                    {/* — Header: Avatar y usuario — */}
                    <CardHeader className="px-4 py-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage
                                        src={pub.user.profile_image_url || "/placeholder.svg"}
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
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
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

                    {/* — Carrusel de imágenes — */}
                    <CardContent className="relative flex-grow p-0">
                        <div className="relative aspect-square overflow-hidden bg-gray-100">
                            {totalImages > 0 ? (
                                <img
                                    src={pub.images[currentImageIndex].url}
                                    alt={`Imagen ${currentImageIndex + 1} de ${totalImages}`}
                                    className="w-full h-full object-cover transition-all duration-300"
                                />
                            ) : (
                                <div className="w-full h-full">
                                    <PlaceholderPattern />
                                </div>
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

                    {/* — Footer: “Me gusta”, “Guardar”, descripción, hashtags, preset, fecha — */}
                    <CardFooter className="flex flex-col items-start gap-4 p-4">
                        {/* Botones de interacción */}
                        <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-4">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={toggleLike}
                                    className={liked ? "text-destructive" : ""}
                                >
                                    <Heart
                                        className={`h-6 w-6 ${liked ? "fill-destructive" : ""}`}
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
                                onClick={toggleSave}
                                className={saved ? "text-primary" : ""}
                            >
                                <Bookmark
                                    className={`h-6 w-6 ${saved ? "fill-primary" : ""}`}
                                />
                                <span className="sr-only">Guardar</span>
                            </Button>
                        </div>

                        {/* Conteo de me gusta y descripción de la publicación */}
                        <div className="w-full">
                            <div className="font-medium">{likesCount} me gusta</div>
                            <div className="mt-1">
                                <span className="font-medium">@{pub.user.username}</span>{" "}
                                <span>{pub.description}</span>
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

                        {/* — Hashtags — */}
                        {pub.hashtags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {pub.hashtags.map((h) => (
                                    <Badge key={h.id} variant="default">
                                        #{h.name}
                                    </Badge>
                                ))}
                            </div>
                        )}

                        {/* — Datos del preset aplicado, envueltos en Link para redirigir a preset.show — */}
                        <Card className="w-full group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 hover:border-border">
                            <Link href={route("presets.show", pub.preset.id)} className="block">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <Badge variant="secondary" className="text-xs font-medium">
                                            Preset aplicado
                                        </Badge>
                                    </div>
                                </CardHeader>

                                <CardContent className="pb-4">
                                    <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-200">
                                        {pub.preset.name}
                                    </h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{pub.preset.description}</p>
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
            </div>
        </AppLayout>
    )
}
