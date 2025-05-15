import { useState } from "react"
import {
    Heart,
    Bookmark,
    Share2,
    MoreHorizontal,
    ChevronLeft,
    ChevronRight,
    Sliders,
    Info,
    Download,
    Eye,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AppLayout from "@/layouts/app-layout"
import { Head } from "@inertiajs/react"
import type { BreadcrumbItem } from "@/types"

interface Preset {
    id: number
    name: string
    description: string
    price: number
    before_image_id: string
    after_image_id: string
    user_id: number
    user: {
        name: string
        avatar: string
        username: string
    }
    likes: number
    downloads: number
    liked: boolean
    saved: boolean
    settings?: {
        contrast?: number
        brightness?: number
        saturation?: number
        temperature?: number
        grain?: number
        vignette?: number
    }
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Presets",
        href: "/presets",
    },
]

export default function PresetsPage() {
    const [presets, setPresets] = useState<Preset[]>([
        {
            id: 1,
            name: "Vintage Summer",
            description: "Efecto retro con tonos cálidos y grano suave, perfecto para fotos de verano",
            price: 19.99,
            before_image_id: "/placeholder.svg?height=500&width=500&text=Original",
            after_image_id: "/placeholder.svg?height=500&width=500&text=Vintage",
            user_id: 1,
            user: {
                name: "Carlos Mendez",
                avatar: "/placeholder.svg?height=40&width=40",
                username: "carlosmendez",
            },
            likes: 124,
            downloads: 56,
            liked: false,
            saved: false,
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
            name: "Clarity Pro",
            description: "Aumenta el detalle y la nitidez para paisajes espectaculares",
            price: 24.99,
            before_image_id: "/placeholder.svg?height=500&width=500&text=Original",
            after_image_id: "/placeholder.svg?height=500&width=500&text=Clarity",
            user_id: 2,
            user: {
                name: "Laura Sánchez",
                avatar: "/placeholder.svg?height=40&width=40",
                username: "laurasanchez",
            },
            likes: 89,
            downloads: 42,
            liked: true,
            saved: false,
            settings: {
                contrast: 20,
                brightness: 5,
                saturation: 10,
                temperature: -5,
            },
        },
        {
            id: 3,
            name: "Moody Dark",
            description: "Tonos oscuros y dramáticos con contraste alto para fotos urbanas",
            price: 14.99,
            before_image_id: "/placeholder.svg?height=500&width=500&text=Original",
            after_image_id: "/placeholder.svg?height=500&width=500&text=Moody",
            user_id: 3,
            user: {
                name: "Miguel Torres",
                avatar: "/placeholder.svg?height=40&width=40",
                username: "migueltorres",
            },
            likes: 215,
            downloads: 98,
            liked: false,
            saved: true,
            settings: {
                contrast: 25,
                brightness: -15,
                saturation: -5,
                temperature: -10,
                vignette: 25,
            },
        },
        {
            id: 4,
            name: "Natural Light",
            description: "Realza los colores naturales manteniendo un aspecto auténtico",
            price: 9.99,
            before_image_id: "/placeholder.svg?height=500&width=500&text=Original",
            after_image_id: "/placeholder.svg?height=500&width=500&text=Natural",
            user_id: 4,
            user: {
                name: "Ana Gómez",
                avatar: "/placeholder.svg?height=40&width=40",
                username: "anagomez",
            },
            likes: 76,
            downloads: 31,
            liked: false,
            saved: false,
            settings: {
                contrast: 5,
                brightness: 8,
                saturation: 3,
                temperature: 0,
            },
        },
    ])

    // State to track if preset details are shown
    const [showPresetDetails, setShowPresetDetails] = useState<Record<number, boolean>>({})

    // State to track which image is being viewed (before/after)
    const [viewMode, setViewMode] = useState<Record<number, "before" | "after" | "split">>({})

    const toggleLike = (presetId: number) => {
        setPresets(
            presets.map((preset) => {
                if (preset.id === presetId) {
                    return {
                        ...preset,
                        liked: !preset.liked,
                        likes: preset.liked ? preset.likes - 1 : preset.likes + 1,
                    }
                }
                return preset
            }),
        )
    }

    const toggleSave = (presetId: number) => {
        setPresets(
            presets.map((preset) => {
                if (preset.id === presetId) {
                    return {
                        ...preset,
                        saved: !preset.saved,
                    }
                }
                return preset
            }),
        )
    }

    // Toggle preset details visibility
    const togglePresetDetails = (presetId: number) => {
        setShowPresetDetails((prev) => ({
            ...prev,
            [presetId]: !prev[presetId],
        }))
    }

    // Get current view mode for a preset
    const getViewMode = (presetId: number) => {
        return viewMode[presetId] || "after"
    }

    // Set view mode for a preset
    const setPresetViewMode = (presetId: number, mode: "before" | "after" | "split") => {
        setViewMode((prev) => ({
            ...prev,
            [presetId]: mode,
        }))
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Presets Fotográficos" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <h1 className="text-2xl font-bold">Presets</h1>

                <Tabs defaultValue="grid" className="w-full">
                    <TabsList>
                        <TabsTrigger value="grid">Cuadrícula</TabsTrigger>
                        <TabsTrigger value="list">Lista</TabsTrigger>
                    </TabsList>

                    <TabsContent value="grid" className="mt-4">
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {presets.map((preset) => (
                                    <Card key={preset.id} className="overflow-hidden flex flex-col h-full bg-card border border-border rounded-lg shadow-md">
                                        <CardHeader className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <Avatar>
                                                        <AvatarImage src={preset.user.avatar || "/placeholder.svg"} alt={preset.user.name} />
                                                        <AvatarFallback>{preset.user.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="font-medium">{preset.user.name}</div>
                                                        <div className="text-sm text-muted-foreground">@{preset.user.username}</div>
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
                                                        <DropdownMenuItem>Ver perfil del creador</DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="text-destructive">Reportar</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-0 relative flex-grow">
                                            {/* Image Display with Before/After */}
                                            <div className="relative overflow-hidden aspect-square">
                                                {getViewMode(preset.id) === "before" && (
                                                    <img
                                                        src={preset.before_image_id || "/placeholder.svg"}
                                                        alt={`Original para ${preset.name}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                )}

                                                {getViewMode(preset.id) === "after" && (
                                                    <img
                                                        src={preset.after_image_id || "/placeholder.svg"}
                                                        alt={`Resultado de ${preset.name}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                )}

                                                {getViewMode(preset.id) === "split" && (
                                                    <div className="relative w-full h-full">
                                                        <img
                                                            src={preset.before_image_id || "/placeholder.svg"}
                                                            alt={`Original para ${preset.name}`}
                                                            className="absolute top-0 left-0 w-full h-full object-cover"
                                                        />
                                                        <div className="absolute top-0 right-0 w-1/2 h-full overflow-hidden">
                                                            <img
                                                                src={preset.after_image_id || "/placeholder.svg"}
                                                                alt={`Resultado de ${preset.name}`}
                                                                className="absolute top-0 left-0 w-[200%] h-full object-cover"
                                                                style={{ transform: "translateX(-50%)" }}
                                                            />
                                                        </div>
                                                        <div className="absolute top-0 left-1/2 h-full w-0.5 bg-white shadow-lg z-10"></div>
                                                        <div className="absolute top-1/2 left-1/2 h-8 w-8 bg-white rounded-full shadow-lg transform -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center">
                                                            <ChevronLeft className="h-4 w-4 -ml-1" />
                                                            <ChevronRight className="h-4 w-4 -mr-1" />
                                                        </div>
                                                    </div>
                                                )}

                                                {/* View Mode Controls */}
                                                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant={getViewMode(preset.id) === "before" ? "secondary" : "outline"}
                                                                    size="sm"
                                                                    className="bg-black/50 hover:bg-black/70 text-white border-none h-8"
                                                                    onClick={() => setPresetViewMode(preset.id, "before")}
                                                                >
                                                                    Original
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>Ver imagen original</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>

                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant={getViewMode(preset.id) === "split" ? "secondary" : "outline"}
                                                                    size="sm"
                                                                    className="bg-black/50 hover:bg-black/70 text-white border-none h-8"
                                                                    onClick={() => setPresetViewMode(preset.id, "split")}
                                                                >
                                                                    Comparar
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>Comparar antes/después</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>

                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant={getViewMode(preset.id) === "after" ? "secondary" : "outline"}
                                                                    size="sm"
                                                                    className="bg-black/50 hover:bg-black/70 text-white border-none h-8"
                                                                    onClick={() => setPresetViewMode(preset.id, "after")}
                                                                >
                                                                    Resultado
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>Ver resultado con preset</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </div>

                                                {/* Preset Badge */}
                                                <div className="absolute top-3 left-3 flex items-center gap-2">
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Badge
                                                                    variant="secondary"
                                                                    className="flex items-center gap-1 bg-black/50 hover:bg-black/70 text-white border-none"
                                                                >
                                                                    <Sliders className="h-3 w-3" />
                                                                    <span>{preset.name}</span>
                                                                </Badge>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>{preset.description}</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>

                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6 rounded-full bg-black/50 hover:bg-black/70 text-white p-1"
                                                        onClick={() => togglePresetDetails(preset.id)}
                                                    >
                                                        <Info className="h-4 w-4" />
                                                        <span className="sr-only">Detalles del preset</span>
                                                    </Button>
                                                </div>

                                                {/* Price Badge */}
                                                <div className="absolute top-3 right-3">
                                                    <Badge className="bg-primary hover:bg-primary/90 text-white border-none font-bold">
                                                        {preset.price.toFixed(2)} €
                                                    </Badge>
                                                </div>

                                                {/* Preset Details Panel */}
                                                {showPresetDetails[preset.id] && (
                                                    <div className="absolute inset-0 bg-black/80 text-white p-4 flex flex-col">
                                                        <div className="flex justify-between items-center mb-4">
                                                            <h3 className="text-lg font-bold">Preset: {preset.name}</h3>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="text-white hover:bg-white/20"
                                                                onClick={() => togglePresetDetails(preset.id)}
                                                            >
                                                                Cerrar
                                                            </Button>
                                                        </div>
                                                        <p className="text-sm mb-4">{preset.description}</p>
                                                        {preset.settings && (
                                                            <div className="space-y-3 flex-1">
                                                                <h4 className="text-sm font-medium">Ajustes:</h4>
                                                                {Object.entries(preset.settings).map(([key, value]) => (
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
                                                        )}
                                                        <Button variant="default" className="mt-4 bg-primary hover:bg-primary/90">
                                                            <Download className="h-4 w-4 mr-2" />
                                                            Comprar por {preset.price.toFixed(2)} €
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                        <CardFooter className="flex flex-col items-start p-4 gap-3">
                                            <div className="flex items-center justify-between w-full">
                                                <div className="flex items-center gap-4">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => toggleLike(preset.id)}
                                                        className={preset.liked ? "text-destructive" : ""}
                                                    >
                                                        <Heart className={`h-5 w-5 ${preset.liked ? "fill-destructive" : ""}`} />
                                                        <span className="sr-only">Me gusta</span>
                                                    </Button>
                                                    <Button variant="ghost" size="icon">
                                                        <Share2 className="h-5 w-5" />
                                                        <span className="sr-only">Compartir</span>
                                                    </Button>
                                                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                                                        <Eye className="h-4 w-4" />
                                                        <span>{preset.downloads}</span>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => toggleSave(preset.id)}
                                                    className={preset.saved ? "text-primary" : ""}
                                                >
                                                    <Bookmark className={`h-5 w-5 ${preset.saved ? "fill-primary" : ""}`} />
                                                    <span className="sr-only">Guardar</span>
                                                </Button>
                                            </div>
                                            <div>
                                                <div className="font-medium text-lg">{preset.name}</div>
                                                <div className="mt-1 text-sm text-muted-foreground line-clamp-2">{preset.description}</div>
                                                <div className="mt-2 flex justify-between items-center">
                                                    <div className="font-bold text-lg">{preset.price.toFixed(2)} €</div>
                                                    <Button size="sm" className="bg-primary hover:bg-primary/90">
                                                        <Download className="h-4 w-4 mr-2" />
                                                        Comprar
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="list" className="mt-6">
                        <div className="space-y-4">
                            {presets.map((preset) => (
                                <Card key={preset.id} className="overflow-hidden">
                                    <div className="flex flex-col md:flex-row">
                                        <div className="md:w-1/3 relative">
                                            <div className="relative aspect-square md:aspect-auto md:h-full">
                                                {getViewMode(preset.id) === "before" && (
                                                    <img
                                                        src={preset.before_image_id || "/placeholder.svg"}
                                                        alt={`Original para ${preset.name}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                )}

                                                {getViewMode(preset.id) === "after" && (
                                                    <img
                                                        src={preset.after_image_id || "/placeholder.svg"}
                                                        alt={`Resultado de ${preset.name}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                )}

                                                {getViewMode(preset.id) === "split" && (
                                                    <div className="relative w-full h-full">
                                                        <img
                                                            src={preset.before_image_id || "/placeholder.svg"}
                                                            alt={`Original para ${preset.name}`}
                                                            className="absolute top-0 left-0 w-full h-full object-cover"
                                                        />
                                                        <div className="absolute top-0 right-0 w-1/2 h-full overflow-hidden">
                                                            <img
                                                                src={preset.after_image_id || "/placeholder.svg"}
                                                                alt={`Resultado de ${preset.name}`}
                                                                className="absolute top-0 left-0 w-[200%] h-full object-cover"
                                                                style={{ transform: "translateX(-50%)" }}
                                                            />
                                                        </div>
                                                        <div className="absolute top-0 left-1/2 h-full w-0.5 bg-white shadow-lg z-10"></div>
                                                        <div className="absolute top-1/2 left-1/2 h-8 w-8 bg-white rounded-full shadow-lg transform -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center">
                                                            <ChevronLeft className="h-4 w-4 -ml-1" />
                                                            <ChevronRight className="h-4 w-4 -mr-1" />
                                                        </div>
                                                    </div>
                                                )}

                                                {/* View Mode Controls */}
                                                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
                                                    <Button
                                                        variant={getViewMode(preset.id) === "before" ? "secondary" : "outline"}
                                                        size="sm"
                                                        className="bg-black/50 hover:bg-black/70 text-white border-none h-8"
                                                        onClick={() => setPresetViewMode(preset.id, "before")}
                                                    >
                                                        Original
                                                    </Button>
                                                    <Button
                                                        variant={getViewMode(preset.id) === "split" ? "secondary" : "outline"}
                                                        size="sm"
                                                        className="bg-black/50 hover:bg-black/70 text-white border-none h-8"
                                                        onClick={() => setPresetViewMode(preset.id, "split")}
                                                    >
                                                        Comparar
                                                    </Button>
                                                    <Button
                                                        variant={getViewMode(preset.id) === "after" ? "secondary" : "outline"}
                                                        size="sm"
                                                        className="bg-black/50 hover:bg-black/70 text-white border-none h-8"
                                                        onClick={() => setPresetViewMode(preset.id, "after")}
                                                    >
                                                        Resultado
                                                    </Button>
                                                </div>

                                                {/* Price Badge */}
                                                <div className="absolute top-3 right-3">
                                                    <Badge className="bg-primary hover:bg-primary/90 text-white border-none font-bold">
                                                        {preset.price.toFixed(2)} €
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="md:w-2/3 p-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <Avatar>
                                                        <AvatarImage src={preset.user.avatar || "/placeholder.svg"} alt={preset.user.name} />
                                                        <AvatarFallback>{preset.user.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="font-medium">{preset.user.name}</div>
                                                        <div className="text-sm text-muted-foreground">@{preset.user.username}</div>
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
                                                        <DropdownMenuItem>Ver perfil del creador</DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="text-destructive">Reportar</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>

                                            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                                                {preset.name}
                                                <Badge variant="outline" className="flex items-center gap-1 ml-2">
                                                    <Sliders className="h-3 w-3" />
                                                    <span>Preset</span>
                                                </Badge>
                                            </h3>

                                            <p className="text-muted-foreground mb-4">{preset.description}</p>

                                            <div className="flex flex-wrap gap-4 mb-4">
                                                <div className="flex items-center gap-1">
                                                    <Heart className={`h-4 w-4 ${preset.liked ? "fill-destructive text-destructive" : ""}`} />
                                                    <span>{preset.likes} me gusta</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Download className="h-4 w-4" />
                                                    <span>{preset.downloads} descargas</span>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-3 mt-auto">
                                                <Button variant="outline" size="sm" onClick={() => togglePresetDetails(preset.id)}>
                                                    <Info className="h-4 w-4 mr-2" />
                                                    Ver detalles
                                                </Button>

                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => toggleSave(preset.id)}
                                                    className={preset.saved ? "text-primary border-primary" : ""}
                                                >
                                                    <Bookmark className={`h-4 w-4 mr-2 ${preset.saved ? "fill-primary" : ""}`} />
                                                    {preset.saved ? "Guardado" : "Guardar"}
                                                </Button>

                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => toggleLike(preset.id)}
                                                    className={preset.liked ? "text-destructive border-destructive" : ""}
                                                >
                                                    <Heart className={`h-4 w-4 mr-2 ${preset.liked ? "fill-destructive" : ""}`} />
                                                    {preset.liked ? "Me gusta" : "Me gusta"}
                                                </Button>

                                                <Button className="ml-auto bg-primary hover:bg-primary/90">
                                                    <Download className="h-4 w-4 mr-2" />
                                                    Comprar por {preset.price.toFixed(2)} €
                                                </Button>
                                            </div>

                                            {/* Preset Details Panel */}
                                            {showPresetDetails[preset.id] && (
                                                <div className="mt-4 pt-4 border-t">
                                                    <div className="flex justify-between items-center mb-3">
                                                        <h4 className="font-medium">Detalles del preset</h4>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 px-2"
                                                            onClick={() => togglePresetDetails(preset.id)}
                                                        >
                                                            Cerrar
                                                        </Button>
                                                    </div>

                                                    {preset.settings && (
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                            {Object.entries(preset.settings).map(([key, value]) => (
                                                                <div key={key} className="flex items-center gap-2">
                                                                    <span className="text-sm capitalize w-24">{key}:</span>
                                                                    <div className="flex-grow bg-muted rounded-full h-2">
                                                                        <div
                                                                            className="rounded-full h-2"
                                                                            style={{
                                                                                width: `${Math.abs(Number(value)) * 2}%`,
                                                                                backgroundColor: Number(value) < 0 ? "#ef4444" : "#10b981",
                                                                            }}
                                                                        ></div>
                                                                    </div>
                                                                    <span className="text-xs w-8 text-right">{value > 0 ? `+${value}` : value}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    )
}
