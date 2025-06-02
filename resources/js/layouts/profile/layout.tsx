import type React from "react"
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
import { router } from "@inertiajs/react" // importamos el router de Inertia

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
    isFollowing: boolean
    isOwnProfile: boolean
}

export default function ProfileLayout({
    user,
    children,
}: {
    user: User
    children?: React.ReactNode
}) {
    // Calculamos iniciales (dos primeras letras de nombre+apellido)
    const initials = user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)

    // Formatea números grandes a K/M
    const formatNumber = (num: number) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
        return num.toString()
    }

    // Función para ir a editar perfil
    const goToEditProfile = () => {
        // Asumiendo que existe la ruta named 'profile.edit'
        router.get(route("profile.edit", user.id))
    }

    return (
        <AppLayout>
            <div className="min-h-screen">
                <div className="mx-auto">
                    {/* Profile Section */}
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
                                {/* Name y Username (móvil vs desktop) */}
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

                                {/* Stats */}
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
                                            {formatNumber(user.followers.length)}
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
                                                variant={user.isFollowing ? "outline" : "default"}
                                                className="flex-1 md:w-auto"
                                            >
                                                {user.isFollowing ? "Siguiendo" : "Seguir"}
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

                        {/* Bio Section (estática; parametrízala en user si quieres) */}
                        <div className="mt-6 space-y-3 text-center md:text-left">
                            <div className="space-y-2">
                                <p className="text-sm leading-relaxed">
                                    {user.description}
                                </p>
                            </div>
                        </div>
                    </div>

                    <Separator className="my-2" />

                    {/* Pestañas de contenido */}
                    <Tabs defaultValue="publicaciones" className="w-full">
                        <div className="flex justify-center py-4">
                            <TabsList className="bg-secondary/80 backdrop-blur-sm border border-border/50 p-1 h-auto">
                                <TabsTrigger
                                    value="publicaciones"
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
                                <TabsTrigger
                                    value="guardados"
                                    className="flex items-center justify-center gap-2 px-4 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md"
                                >
                                    <Bookmark className="h-4 w-4" />
                                    <span className="font-medium">Guardados</span>
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <TabsContent value="publicaciones" className="mt-0 min-h-[400px]">
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
                                        <h3 className="text-lg font-semibold mb-2">No hay presets aún</h3>
                                        <p className="text-muted-foreground">
                                            Cuando {user.username} publique presets, aparecerán aquí.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="guardados" className="mt-0 min-h-[400px]">
                            <div className="p-4">
                                {children || (
                                    <div className="text-center py-12">
                                        <Bookmark className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                        <h3 className="text-lg font-semibold mb-2">
                                            No hay publicaciones guardados
                                        </h3>
                                        <p className="text-muted-foreground">
                                            Guarda publicaciones para verlos de nuevo.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </AppLayout>
    )
}
