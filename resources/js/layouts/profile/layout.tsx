import type React from "react"
import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
    Bookmark,
    MessageCircle,
    Aperture,
    Camera,
} from "lucide-react"
import AppLayout from "../app-layout"
import { router } from "@inertiajs/react" // Router de Inertia + Ziggy
import { toast } from "sonner"           // Sonner para los toasts

type Publication = {
    id: number
    url: string
}

type Preset = {
    id: number
    url: string
}

type User = {
    id: number
    name: string
    username?: string
    profile_image_url: string | null
    description: string | null
    publications: Publication[]
    presets: Preset[]
    followers: { id: number; name: string; avatar_url?: string }[]
    following: { id: number; name: string; avatar_url?: string }[]
    isFollowing: boolean      // Si el visitante ya sigue a este usuario
    isOwnProfile: boolean     // Si este perfil es el del usuario autenticado
}

export default function ProfileLayout({
    user,
    children,
}: {
    user: User
    children?: React.ReactNode
}) {
    // Estado local: si ya sigo a este usuario
    const [isFollowing, setIsFollowing] = useState<boolean>(user.isFollowing)
    // Estado local: número de seguidores
    const [followersCount, setFollowersCount] = useState<number>(user.followers.length)
    // Bloqueo mientras se envía la petición
    const [loadingFollow, setLoadingFollow] = useState<boolean>(false)

    // Iniciales para el AvatarFallback
    const initials = user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)

    // Formatear números grandes (1.2K, 3.4M, etc.)
    const formatNumber = (num: number) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
        return num.toString()
    }

    // Navegar a editar perfil (solo si es mi propio perfil)
    const goToEditProfile = () => {
        router.get(route("profile.edit", user.id))
    }

    // Manejador de clic en “Seguir” / “Dejar de seguir”
    const handleFollowClick = () => {
        if (loadingFollow) return
        setLoadingFollow(true)

        if (isFollowing) {
            // Si ya sigo, hago DELETE /users/{id}/unfollow
            router.delete(
                route("users.unfollow", user.id),
                {}, // data vacío
                {
                    preserveState: true,
                    onSuccess: (page) => {
                        setIsFollowing(false)
                        setFollowersCount((prev) => Math.max(prev - 1, 0))
                        // El controlador debe devolver JSON con { message: "..."}
                        // Inertia guarda esa respuesta JSON en page.props último llamado
                        const msg = page.props?.flash?.message || "Has dejado de seguir"
                        toast.success(msg)
                        setLoadingFollow(false)
                    },
                    onError: (errors) => {
                        const errMsg = errors?.message || "Ocurrió un error al dejar de seguir"
                        toast.error(errMsg)
                        setLoadingFollow(false)
                    },
                }
            )
        } else {
            // Si no sigo, hago POST /users/{id}/follow
            router.post(
                route("users.follow", user.id),
                {}, // data vacío
                {
                    preserveState: true,
                    onSuccess: (page) => {
                        setIsFollowing(true)
                        setFollowersCount((prev) => prev + 1)
                        const msg = page.props?.flash?.message || "Ahora sigues a este usuario"
                        toast.success(msg)
                        setLoadingFollow(false)
                    },
                    onError: (errors) => {
                        const errMsg = errors?.message || "Ocurrió un error al seguir"
                        toast.error(errMsg)
                        setLoadingFollow(false)
                    },
                }
            )
        }
    }

    // Estados y lógica para las pestañas (invariante respecto a follow/unfollow)
    const [activeTab, setActiveTab] = useState<string>("publications")
    const baseUrl = `/profile/${user.username}`

    useEffect(() => {
        if (typeof window !== "undefined") {
            const segments = window.location.pathname.split("/")
            const last = segments[segments.length - 1]
            if (["publications", "presets", "saved"].includes(last)) {
                setActiveTab(last)
            }
        }
    }, [])

    const handleTabChange = (value: string) => {
        setActiveTab(value)
        router.get(`${baseUrl}/${value}`)
    }

    return (
        <AppLayout>
            <div className="min-h-screen">
                <div className="mx-auto">
                    {/* === Profile Section === */}
                    <div className="px-4 py-6">
                        <div className="flex flex-col md:flex-row gap-8">
                            {/* Avatar */}
                            <div className="flex justify-center md:justify-start">
                                <Avatar className="w-32 h-32 md:w-48 md:h-48 bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500">
                                    <AvatarImage
                                        src={
                                            user.profile_image_url ||
                                            "/placeholder.svg?height=144&width=144"
                                        }
                                        alt={user.name}
                                        className="object-cover"
                                    />
                                    <AvatarFallback className="text-2xl md:text-3xl font-semibold bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                            </div>

                            {/* Profile Info */}
                            <div className="flex-1 space-y-5">
                                {/* Nombre y @username */}
                                <div className="md:hidden text-center">
                                    <h2 className="font-semibold text-lg">{user.name}</h2>
                                    {user.username && user.username !== user.name && (
                                        <p className="text-muted-foreground">@{user.username}</p>
                                    )}
                                </div>
                                <div className="hidden md:block">
                                    <h2 className="font-semibold text-lg">{user.name}</h2>
                                    {user.username && user.username !== user.name && (
                                        <p className="text-muted-foreground">@{user.username}</p>
                                    )}
                                </div>

                                {/* Estadísticas */}
                                <div className="flex justify-center md:justify-start gap-8 md:gap-12">
                                    <div className="text-center md:text-left">
                                        <div className="text-xl font-bold">
                                            {formatNumber(user.publications.length)}
                                        </div>
                                        <div className="text-sm text-muted-foreground">Publicaciones</div>
                                    </div>
                                    <div className="text-center md:text-left">
                                        <div className="text-xl font-bold">
                                            {formatNumber(user.presets.length)}
                                        </div>
                                        <div className="text-sm text-muted-foreground">Presets</div>
                                    </div>
                                    <div className="text-center md:text-left">
                                        <div className="text-xl font-bold">
                                            {formatNumber(followersCount)}
                                        </div>
                                        <div className="text-sm text-muted-foreground">Seguidores</div>
                                    </div>
                                    <div className="text-center md:text-left">
                                        <div className="text-xl font-bold">
                                            {formatNumber(user.following.length)}
                                        </div>
                                        <div className="text-sm text-muted-foreground">Seguidos</div>
                                    </div>
                                </div>

                                {/* Botones de acción */}
                                <div className="flex gap-2 justify-center md:justify-start">
                                    {user.isOwnProfile ? (
                                        <Button
                                            variant="outline"
                                            className="flex-1 md:w-auto"
                                            onClick={goToEditProfile}
                                        >
                                            Editar perfil
                                        </Button>
                                    ) : (
                                        <>
                                            <Button
                                                onClick={handleFollowClick}
                                                disabled={loadingFollow}
                                                variant={isFollowing ? "outline" : "default"}
                                                className="flex-1 md:w-auto"
                                            >
                                                {isFollowing ? "Dejar de seguir" : "Seguir"}
                                            </Button>
                                            <Button variant="outline" className="flex-1 md:w-auto">
                                                <MessageCircle className="h-4 w-4 mr-2" />
                                                Mensaje
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Sección de la bio */}
                        <div className="mt-6 space-y-3 text-center md:text-left">
                            <div className="space-y-2">
                                <p className="text-sm leading-relaxed">
                                    {user.description}
                                </p>
                            </div>
                        </div>
                    </div>

                    <Separator className="my-2" />

                    {/* === Pestañas de contenido === */}
                    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                        <div className="flex justify-center py-4">
                            <TabsList className="bg-secondary/80 backdrop-blur-sm border border-border/50 p-1 h-auto">
                                <TabsTrigger
                                    value="publications"
                                    className="flex items-center justify-center gap-2 px-4 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md"
                                >
                                    <Camera className="h-4 w-4" />
                                    <span className="font-medium">Publicaciones</span>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="presets"
                                    className="flex items-center justify-center gap-2 px-4 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md"
                                >
                                    <Aperture className="h-4 w-4" />
                                    <span className="font-medium">Presets</span>
                                </TabsTrigger>
                                {user.isOwnProfile && (
                                    <TabsTrigger
                                        value="saved"
                                        className="flex items-center justify-center gap-2 px-4 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md"
                                    >
                                        <Bookmark className="h-4 w-4" />
                                        <span className="font-medium">Guardados</span>
                                    </TabsTrigger>
                                )}
                            </TabsList>
                        </div>

                        <TabsContent value="publications" className="mt-0 min-h-[400px]">
                            <div className="p-4">
                                {children || (
                                    <div className="text-center py-12">
                                        <Camera className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                        <h3 className="text-lg font-semibold mb-2">
                                            No hay publicaciones aún
                                        </h3>
                                        <p className="text-muted-foreground">
                                            Cuando {user.username} cree una publicación, aparecerán en tu perfil.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="presets" className="mt-0 min-h-[400px]">
                            <div className="p-4">
                                {children || (
                                    <div className="text-center py-12">
                                        <Aperture className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                        <h3 className="text-lg font-semibold mb-2">
                                            No hay presets aún
                                        </h3>
                                        <p className="text-muted-foreground">
                                            Cuando {user.username} publique presets, aparecerán aquí.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </TabsContent>

                        {user.isOwnProfile && (
                            <TabsContent value="saved" className="mt-0 min-h-[400px]">
                                <div className="p-4">
                                    {children || (
                                        <div className="text-center py-12">
                                            <Bookmark className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                            <h3 className="text-lg font-semibold mb-2">
                                                No hay publicaciones guardadas
                                            </h3>
                                            <p className="text-muted-foreground">
                                                Guarda publicaciones para verlos de nuevo.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </TabsContent>
                        )}
                    </Tabs>
                </div>
            </div>
        </AppLayout>
    )
}
