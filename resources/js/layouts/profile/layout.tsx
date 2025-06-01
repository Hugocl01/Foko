import type React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
    Settings,
    Grid3X3,
    Play,
    Bookmark,
    MessageCircle,
    MapPin,
    Sparkles,
    LinkIcon,
} from "lucide-react"
import AppLayout from "../app-layout"
import { router } from "@inertiajs/react" // importamos el router de Inertia

type Publication = {
    id: number
    url: string
}

type User = {
    id: number
    name: string
    username?: string
    profile_image_url: string | null
    publications: Publication[]
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
                                        <div className="text-sm text-muted-foreground">posts</div>
                                    </div>
                                    <div className="text-center md:text-left">
                                        <div className="text-xl font-bold">
                                            {formatNumber(user.followers.length)}
                                        </div>
                                        <div className="text-sm text-muted-foreground">followers</div>
                                    </div>
                                    <div className="text-center md:text-left">
                                        <div className="text-xl font-bold">
                                            {formatNumber(user.following.length)}
                                        </div>
                                        <div className="text-sm text-muted-foreground">following</div>
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
                                                {user.isFollowing ? "Following" : "Follow"}
                                            </Button>
                                            <Button variant="outline" className="flex-1 md:w-auto">
                                                <MessageCircle className="h-4 w-4 mr-2" />
                                                Message
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
                                    <span className="inline-flex items-center gap-1">
                                        <Sparkles className="h-3 w-3" />
                                        Content Creator & Designer
                                    </span>
                                    <br />
                                    <span className="inline-flex items-center gap-1">
                                        <MapPin className="h-3 w-3" />
                                        New York, NY
                                    </span>
                                    <br />🎨 Sharing my creative journey
                                    <br />👇 Check out my latest work
                                </p>
                                <a
                                    href="#"
                                    className="inline-flex items-center gap-1 text-sm text-primary hover:underline font-medium"
                                >
                                    <LinkIcon className="h-3 w-3" />
                                    linktr.ee/username
                                </a>
                            </div>
                        </div>
                    </div>

                    <Separator className="my-2" />

                    {/* Pestañas de contenido */}
                    <Tabs defaultValue="posts" className="w-full">
                        <div className="flex justify-center py-4">
                            <TabsList className="bg-secondary/80 backdrop-blur-sm border border-border/50 p-1 h-auto">
                                <TabsTrigger
                                    value="posts"
                                    className="flex items-center justify-center gap-2 px-4 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md"
                                >
                                    <Grid3X3 className="h-4 w-4" />
                                    <span className="font-medium">Posts</span>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="reels"
                                    className="flex items-center justify-center gap-2 px-4 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md"
                                >
                                    <Play className="h-4 w-4" />
                                    <span className="font-medium">Reels</span>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="tagged"
                                    className="flex items-center justify-center gap-2 px-4 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md"
                                >
                                    <Bookmark className="h-4 w-4" />
                                    <span className="font-medium">Saved</span>
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <TabsContent value="posts" className="mt-0 min-h-[400px]">
                            <div className="p-4">
                                {children || (
                                    <div className="text-center py-12">
                                        <Grid3X3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                        <h3 className="text-lg font-semibold mb-2">
                                            No hay publicaciones aún
                                        </h3>
                                        <p className="text-muted-foreground">
                                            Cuando compartas fotos y videos, aparecerán en tu perfil.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="reels" className="mt-0 min-h-[400px]">
                            <div className="p-4">
                                {children || (
                                    <div className="text-center py-12">
                                        <Play className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                        <h3 className="text-lg font-semibold mb-2">No hay reels aún</h3>
                                        <p className="text-muted-foreground">
                                            Cuando compartas reels, aparecerán aquí.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="tagged" className="mt-0 min-h-[400px]">
                            <div className="p-4">
                                {children || (
                                    <div className="text-center py-12">
                                        <Bookmark className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                        <h3 className="text-lg font-semibold mb-2">
                                            No hay posts guardados
                                        </h3>
                                        <p className="text-muted-foreground">
                                            Guarda posts para verlos de nuevo.
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
