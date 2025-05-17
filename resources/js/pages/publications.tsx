import { useState } from "react"
import {
    Heart,
    Bookmark,
    MessageCircle,
    Share2,
    MoreHorizontal,
    ChevronLeft,
    ChevronRight,
    Sliders,
    Info,
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { PlaceholderPattern } from "@/components/ui/placeholder-pattern"
import AppLayout from "@/layouts/app-layout"
import type { BreadcrumbItem } from "@/types"
import { Head } from "@inertiajs/react"

interface Preset {
    id: number
    name: string
    description: string
    settings: {
        contrast?: number
        brightness?: number
        saturation?: number
        temperature?: number
        grain?: number
        vignette?: number
    }
}

interface Post {
    id: number
    user: {
        name: string
        avatar: string
        username: string
    }
    images: string[]
    caption: string
    likes: number
    comments: number
    timestamp: string
    liked: boolean
    saved: boolean
    preset?: Preset
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Publicaciones",
        href: "/publications",
    },
]

export default function Publications() {
    const presets: Preset[] = [
        {
            id: 1,
            name: "Vintage",
            description: "Efecto retro con tonos cálidos y grano suave",
            settings: {
                contrast: 10,
                brightness: -5,
                saturation: -10,
                temperature: 15,
                grain: 20,
                vignette: 15,
            },
        },
        {
            id: 2,
            name: "Clarity",
            description: "Aumenta el detalle y la nitidez para paisajes",
            settings: {
                contrast: 20,
                brightness: 5,
                saturation: 10,
                temperature: -5,
            },
        },
        {
            id: 3,
            name: "Moody",
            description: "Tonos oscuros y dramáticos con contraste alto",
            settings: {
                contrast: 25,
                brightness: -15,
                saturation: -5,
                temperature: -10,
                vignette: 25,
            },
        },
    ]

    const [posts, setPosts] = useState<Post[]>([
        {
            id: 1,
            user: {
                name: "Carlos Mendez",
                avatar: "/placeholder.svg?height=40&width=40",
                username: "carlosmendez",
            },
            images: [
                "/placeholder.svg?height=500&width=500",
                "/placeholder.svg?height=500&width=500&text=Foto+2",
                "/placeholder.svg?height=500&width=500&text=Foto+3",
            ],
            caption: "Explorando nuevos horizontes. La fotografía es mi pasión. #fotografia #arte",
            likes: 124,
            comments: 23,
            timestamp: "hace 2 horas",
            liked: false,
            saved: false,
            preset: presets[0], // Vintage preset
        },
        {
            id: 2,
            user: {
                name: "Laura Sánchez",
                avatar: "/placeholder.svg?height=40&width=40",
                username: "laurasanchez",
            },
            images: ["/placeholder.svg?height=500&width=500", "/placeholder.svg?height=500&width=500&text=Atardecer+2"],
            caption: "Capturando momentos únicos en la ciudad. La luz perfecta al atardecer. #ciudad #atardecer",
            likes: 89,
            comments: 12,
            timestamp: "hace 5 horas",
            liked: true,
            saved: false,
            preset: presets[2], // Moody preset
        },
        {
            id: 3,
            user: {
                name: "Miguel Torres",
                avatar: "/placeholder.svg?height=40&width=40",
                username: "migueltorres",
            },
            images: [
                "/placeholder.svg?height=500&width=500",
                "/placeholder.svg?height=500&width=500&text=Naturaleza+2",
                "/placeholder.svg?height=500&width=500&text=Naturaleza+3",
                "/placeholder.svg?height=500&width=500&text=Naturaleza+4",
            ],
            caption: "Naturaleza en su máxima expresión. Estos paisajes son increíbles. #naturaleza #paisaje",
            likes: 215,
            comments: 34,
            timestamp: "hace 1 día",
            liked: false,
            saved: true,
            preset: presets[1], // Clarity preset
        },
    ])

    // State to track current image for each post
    const [currentImageIndex, setCurrentImageIndex] = useState<Record<number, number>>({})

    // State to track if preset details are shown
    const [showPresetDetails, setShowPresetDetails] = useState<Record<number, boolean>>({})

    const toggleLike = (postId: number) => {
        setPosts(
            posts.map((post) => {
                if (post.id === postId) {
                    return {
                        ...post,
                        liked: !post.liked,
                        likes: post.liked ? post.likes - 1 : post.likes + 1,
                    }
                }
                return post
            }),
        )
    }

    const toggleSave = (postId: number) => {
        setPosts(
            posts.map((post) => {
                if (post.id === postId) {
                    return {
                        ...post,
                        saved: !post.saved,
                    }
                }
                return post
            }),
        )
    }

    const nextImage = (postId: number, totalImages: number) => {
        setCurrentImageIndex((prev) => {
            const currentIndex = prev[postId] || 0
            return {
                ...prev,
                [postId]: (currentIndex + 1) % totalImages,
            }
        })
    }

    const prevImage = (postId: number, totalImages: number) => {
        setCurrentImageIndex((prev) => {
            const currentIndex = prev[postId] || 0
            return {
                ...prev,
                [postId]: (currentIndex - 1 + totalImages) % totalImages,
            }
        })
    }

    // Get current image index for a post
    const getCurrentImageIndex = (postId: number) => {
        return currentImageIndex[postId] || 0
    }

    // Toggle preset details visibility
    const togglePresetDetails = (postId: number) => {
        setShowPresetDetails((prev) => ({
            ...prev,
            [postId]: !prev[postId],
        }))
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Publicaciones" />

            {/* Main Content */}
            <div className="max-w-3xl mx-auto p-4">
                <h1 className="text-2xl font-bold mb-6">Publicaciones</h1>

                {/* Standard Vertical Feed */}
                <div className="space-y-6">
                    {posts.map((post) => (
                        <Card key={post.id} className="overflow-hidden h-[80vh] flex flex-col">
                            <CardHeader className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage src={post.user.avatar || "/placeholder.svg"} alt={post.user.name} />
                                            <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-medium">{post.user.name}</div>
                                            <div className="text-sm text-muted-foreground">@{post.user.username}</div>
                                        </div>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="h-5 w-5" />
                                                <span className="sr-only">Más opciones</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem>Copiar enlace</DropdownMenuItem>
                                            <DropdownMenuItem>Seguir usuario</DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-destructive">Reportar</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0 relative flex-grow">
                                {/* Image Carousel */}
                                <div className="relative overflow-hidden h-full">
                                    {post.images.length > 0 ? (
                                        <img
                                            src={post.images[getCurrentImageIndex(post.id)] || "/placeholder.svg"}
                                            alt={`Publicación ${post.id}`}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full">
                                            <PlaceholderPattern />
                                        </div>
                                    )}

                                    {/* Preset Badge */}
                                    {post.preset && (
                                        <div className="absolute top-3 left-3 flex items-center gap-2">
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Badge
                                                            variant="secondary"
                                                            className="flex items-center gap-1 bg-black/50 hover:bg-black/70 text-white border-none"
                                                        >
                                                            <Sliders className="h-3 w-3" />
                                                            <span>{post.preset.name}</span>
                                                        </Badge>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>{post.preset.description}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>

                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 rounded-full bg-black/50 hover:bg-black/70 text-white p-1"
                                                onClick={() => togglePresetDetails(post.id)}
                                            >
                                                <Info className="h-4 w-4" />
                                                <span className="sr-only">Detalles del preset</span>
                                            </Button>
                                        </div>
                                    )}

                                    {/* Preset Details Panel */}
                                    {post.preset && showPresetDetails[post.id] && (
                                        <div className="absolute inset-0 bg-black/80 text-white p-4 flex flex-col">
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="text-lg font-bold">Preset: {post.preset.name}</h3>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-white hover:bg-white/20"
                                                    onClick={() => togglePresetDetails(post.id)}
                                                >
                                                    Cerrar
                                                </Button>
                                            </div>
                                            <p className="text-sm mb-4">{post.preset.description}</p>
                                            <div className="space-y-3 flex-1">
                                                <h4 className="text-sm font-medium">Ajustes:</h4>
                                                {Object.entries(post.preset.settings).map(([key, value]) => (
                                                    <div key={key} className="grid grid-cols-3 gap-2 items-center">
                                                        <span className="text-sm capitalize">{key}:</span>
                                                        <div className="col-span-2 bg-white/20 rounded-full h-2">
                                                            <div
                                                                className="bg-white rounded-full h-2"
                                                                style={{
                                                                    width: `${Math.abs(Number(value)) * 2}%`,
                                                                    backgroundColor: Number(value) < 0 ? "#ef4444" : "#10b981",
                                                                }}
                                                            ></div>
                                                        </div>
                                                        <span className="text-xs text-right">{value > 0 ? `+${value}` : value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <Button
                                                variant="outline"
                                                className="mt-4 border-white text-white hover:bg-white/20 hover:text-white"
                                            >
                                                Usar este preset
                                            </Button>
                                        </div>
                                    )}

                                    {/* Image Navigation */}
                                    {post.images.length > 1 && (
                                        <>
                                            {/* Left Arrow */}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full h-8 w-8"
                                                onClick={() => prevImage(post.id, post.images.length)}
                                            >
                                                <ChevronLeft className="h-5 w-5" />
                                                <span className="sr-only">Anterior</span>
                                            </Button>

                                            {/* Right Arrow */}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full h-8 w-8"
                                                onClick={() => nextImage(post.id, post.images.length)}
                                            >
                                                <ChevronRight className="h-5 w-5" />
                                                <span className="sr-only">Siguiente</span>
                                            </Button>

                                            {/* Dots Indicator */}
                                            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1">
                                                {post.images.map((_, index) => (
                                                    <div
                                                        key={index}
                                                        className={`h-1.5 rounded-full ${getCurrentImageIndex(post.id) === index ? "w-4 bg-white" : "w-1.5 bg-white/60"
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </CardContent>
                            <CardFooter className="flex flex-col items-start p-4 gap-3">
                                <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center gap-4">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => toggleLike(post.id)}
                                            className={post.liked ? "text-destructive" : ""}
                                        >
                                            <Heart className={`h-6 w-6 ${post.liked ? "fill-destructive" : ""}`} />
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
                                        onClick={() => toggleSave(post.id)}
                                        className={post.saved ? "text-primary" : ""}
                                    >
                                        <Bookmark className={`h-6 w-6 ${post.saved ? "fill-primary" : ""}`} />
                                        <span className="sr-only">Guardar</span>
                                    </Button>
                                </div>
                                <div>
                                    <div className="font-medium">{post.likes} me gusta</div>
                                    <div className="mt-1">
                                        <span className="font-medium">{post.user.username}</span> <span>{post.caption}</span>
                                    </div>
                                    <div className="text-sm text-muted-foreground mt-1">Ver los {post.comments} comentarios</div>
                                    <div className="text-xs text-muted-foreground mt-2">{post.timestamp}</div>
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </AppLayout>
    )
}
