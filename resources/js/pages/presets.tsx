import type React from "react"
import { useState } from "react"
import { MoreHorizontal, Eye, EyeOff, Plus, ChevronLeft, ChevronRight } from "lucide-react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Badge } from "@/components/ui/badge"
import AppLayout from "@/layouts/app-layout"
import { PresetDialog } from "@/components/preset-dialog"
import { usePage, Head, router, Link } from "@inertiajs/react"
import type { BreadcrumbItem } from "@/types"

interface Preset {
    id: number
    name: string
    description: string
    price: string
    user: {
        id: number
        name: string
        username: string | null
        profile_image: string | null
    }
    hashtags: string[]
    created_at: string
    before_image?: string
    after_image?: string
}

interface Paginated<T> {
    data: T[]
    current_page: number
    last_page: number
    per_page: number
    total: number
}

const breadcrumbs: BreadcrumbItem[] = [{ title: "Presets", href: "/presets" }]

export default function PresetsPage() {
    const { props } = usePage<{ presets: Paginated<Preset> }>()
    const { data: presets, current_page, last_page, per_page, total } = props.presets

    const indexOfFirstItem = (current_page - 1) * per_page + 1
    const indexOfLastItem = Math.min(current_page * per_page, total)
    const [viewMode, setViewMode] = useState<Record<number, "before" | "after">>({})

    const getViewMode = (id: number) => viewMode[id] || "after"
    const setPresetViewMode = (id: number, mode: "before" | "after") =>
        setViewMode((prev) => ({ ...prev, [id]: mode }))

    const avatarUrl = (filename: string | null) => (filename ? filename : "/placeholder.svg")

    const getImageUrl = (preset: Preset, mode: "before" | "after") =>
        mode === "before" ? preset.before_image ?? "/placeholder.svg" : preset.after_image ?? "/placeholder.svg"

    const paginate = (page: number) => {
        if (page < 1 || page > last_page) return
        router.get(
            route("presets.index", { page, perPage: per_page }),
            {},
            { preserveState: true }
        )
    }

    const handleCardClick = (presetId: number, e: React.MouseEvent) => {
        const target = e.target as HTMLElement
        if (
            target.closest("button") ||
            target.closest('[role="button"]') ||
            target.closest("a") ||
            target.closest(".toggle-group")
        ) {
            return
        }
        router.get(`/presets/${presetId}`)
    }

    const handleCreatePreset = (formData: Preset) => {
        router.post(route("presets.store"), formData)
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Presets" />
            <div className="flex flex-col gap-4 p-4">
                <h1 className="text-2xl font-bold">Presets</h1>
                <Tabs defaultValue="grid" className="w-full">
                    <div className="flex justify-between items-center">
                        <TabsList>
                            <TabsTrigger value="grid">Cuadrícula</TabsTrigger>
                            <TabsTrigger value="list">Lista</TabsTrigger>
                        </TabsList>

                        <PresetDialog
                            onSubmit={handleCreatePreset}
                            trigger={
                                <Button variant="default" className="flex items-center cursor-pointer">
                                    <Plus className="h-4 w-4 mr-1" />
                                    Publicar preset
                                </Button>
                            }
                        />
                    </div>

                    {/* VISTA GRID */}
                    <TabsContent value="grid" className="mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {presets.map((preset) => (
                                <Card
                                    key={preset.id}
                                    className="flex flex-col h-full cursor-pointer hover:shadow-lg transition-shadow duration-200"
                                    onClick={(e) => handleCardClick(preset.id, e)}
                                >
                                    <CardHeader className="px-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                {/* Avatar envuelto en Link a profile.user */}
                                                <Link href={route("profile.user", { user: preset.user.username })}>
                                                    <Avatar className="h-10 w-10 cursor-pointer">
                                                        <AvatarImage
                                                            src={avatarUrl(preset.user.profile_image)}
                                                            alt={preset.user.name}
                                                        />
                                                        <AvatarFallback className="text-sm">
                                                            {preset.user.name.charAt(0)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                </Link>
                                                <div className="flex flex-col">
                                                    <div className="font-medium text-base">
                                                        {preset.user.name}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        @{preset.user.username ?? "usuario"}
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
                                                    <DropdownMenuItem>Ver perfil</DropdownMenuItem>
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
                                            <img
                                                src={getImageUrl(preset, getViewMode(preset.id))}
                                                alt={`${preset.name} - ${getViewMode(preset.id)}`}
                                                className="w-full h-full object-cover transition-all duration-300"
                                            />

                                            {/* Controles de toggle de imagen */}
                                            <div className="absolute top-2 left-2 toggle-group">
                                                <ToggleGroup
                                                    type="single"
                                                    value={getViewMode(preset.id)}
                                                    onValueChange={(value) =>
                                                        value &&
                                                        setPresetViewMode(preset.id, value as "before" | "after")
                                                    }
                                                    className="bg-black/50 rounded-md p-1"
                                                >
                                                    <ToggleGroupItem
                                                        value="before"
                                                        size="sm"
                                                        className="text-white data-[state=on]:bg-white data-[state=on]:text-black transition-all duration-200"
                                                    >
                                                        <EyeOff className="h-3 w-3 mr-1" />
                                                        Antes
                                                    </ToggleGroupItem>
                                                    <ToggleGroupItem
                                                        value="after"
                                                        size="sm"
                                                        className="text-white data-[state=on]:bg-white data-[state=on]:text-black transition-all duration-200"
                                                    >
                                                        <Eye className="h-3 w-3 mr-1" />
                                                        Después
                                                    </ToggleGroupItem>
                                                </ToggleGroup>
                                            </div>

                                            <Badge variant="default" className="absolute top-2 right-2">
                                                {Number(preset.price).toFixed(2)} €
                                            </Badge>
                                        </div>
                                    </CardContent>

                                    <CardFooter className="flex flex-col items-start gap-3 p-4">
                                        <div className="w-full">
                                            <div className="font-semibold">{preset.name}</div>
                                            <div className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                                {preset.description}
                                            </div>
                                            <div className="flex flex-wrap gap-1 mb-3">
                                                {preset.hashtags.map((tag) => (
                                                    <a
                                                        key={tag}
                                                        href={`/presets?hashtag=${encodeURIComponent(tag)}`}
                                                        className="inline-block"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            router.get(`/presets?hashtag=${encodeURIComponent(tag)}`)
                                                        }}
                                                    >
                                                        <Badge variant="default" className="cursor-pointer">
                                                            #{tag}
                                                        </Badge>
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="default"
                                            className="w-full cursor-pointer"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                router.get(`/presets/${preset.id}`)
                                            }}
                                        >
                                            <Eye className="h-4 w-4 mr-1" /> Ver
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>

                        {/* Paginador igual que publicaciones */}
                        <div className="flex items-center justify-between mt-4 p-4 bg-card border rounded-lg">
                            <div className="text-sm text-muted-foreground">
                                Mostrando {indexOfFirstItem}-{indexOfLastItem} de {total} presets
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
                    </TabsContent>

                    {/* VISTA LIST */}
                    <TabsContent value="list" className="mt-4 space-y-4">
                        {presets.map((preset) => (
                            <Card
                                key={preset.id}
                                className="flex flex-col md:flex-row overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200"
                                onClick={(e) => handleCardClick(preset.id, e)}
                            >
                                <div className="md:w-1/3 ml-4 bg-transparent aspect-square relative">
                                    <img
                                        src={getImageUrl(preset, getViewMode(preset.id))}
                                        alt={`${preset.name} - ${getViewMode(preset.id)}`}
                                        className="w-full h-full object-cover transition-all duration-300 rounded-2xl"
                                    />
                                    <div className="absolute top-2 left-2 toggle-group">
                                        <ToggleGroup
                                            type="single"
                                            value={getViewMode(preset.id)}
                                            onValueChange={(value) =>
                                                value && setPresetViewMode(preset.id, value as "before" | "after")
                                            }
                                            className="bg-black/50 rounded-md p-1"
                                        >
                                            <ToggleGroupItem
                                                value="before"
                                                size="sm"
                                                className="text-white data-[state=on]:bg-white data-[state=on]:text-black transition-all duration-200"
                                            >
                                                <EyeOff className="h-3 w-3 mr-1" />
                                                Antes
                                            </ToggleGroupItem>
                                            <ToggleGroupItem
                                                value="after"
                                                size="sm"
                                                className="text-white data-[state=on]:bg-white data-[state=on]:text-black transition-all duration-200"
                                            >
                                                <Eye className="h-3 w-3 mr-1" />
                                                Después
                                            </ToggleGroupItem>
                                        </ToggleGroup>
                                    </div>
                                </div>
                                <div className="md:w-2/3 p-4 flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-3">
                                                {/* Avatar envuelto en Link a profile.user (vista lista) */}
                                                <Link href={route("profile.user", { user: preset.user.username })}>
                                                    <Avatar className="h-12 w-12 cursor-pointer">
                                                        <AvatarImage
                                                            src={avatarUrl(preset.user.profile_image)}
                                                            alt={preset.user.name}
                                                        />
                                                        <AvatarFallback className="text-base">
                                                            {preset.user.name.charAt(0)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                </Link>
                                                <div className="flex flex-col">
                                                    <div className="font-medium text-lg">
                                                        {preset.user.name}
                                                    </div>
                                                    <div className="text-base text-muted-foreground">
                                                        @{preset.user.username ?? "usuario"}
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
                                                    <DropdownMenuItem>Ver perfil</DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-destructive">
                                                        Reportar
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                        <h3 className="text-xl font-bold flex items-center gap-2 mb-2">
                                            {preset.name}
                                        </h3>
                                        <p className="text-sm text-muted-foreground mb-3">
                                            {preset.description}
                                        </p>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {preset.hashtags.map((tag) => (
                                                <a
                                                    key={tag}
                                                    href={`/presets?hashtag=${encodeURIComponent(tag)}`}
                                                    className="inline-block"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        router.get(`/presets?hashtag=${encodeURIComponent(tag)}`)
                                                    }}
                                                >
                                                    <Badge variant="default" className="cursor-pointer">
                                                        #{tag}
                                                    </Badge>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="font-bold text-lg">
                                            {Number(preset.price).toFixed(2)} €
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="default"
                                            className="cursor-pointer"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                router.get(`/presets/${preset.id}`)
                                            }}
                                        >
                                            <Eye className="h-4 w-4 mr-1" /> Ver
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}

                        {/* Paginador igual que publicaciones en lista */}
                        <div className="flex items-center justify-between mt-4 p-4 bg-card border rounded-lg">
                            <div className="text-sm text-muted-foreground">
                                Mostrando {indexOfFirstItem}-{indexOfLastItem} de {total} presets
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
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    )
}
