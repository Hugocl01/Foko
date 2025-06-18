import React, { useState, useEffect } from "react";
import {
    Heart,
    Bookmark,
    Share2,
    MoreHorizontal,
    ChevronLeft,
    ChevronRight,
    Plus,
    Star,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import AppLayout from "@/layouts/app-layout";
import { usePage, Head, router, Link } from "@inertiajs/react";
import type { BreadcrumbItem } from "@/types";
import { PlaceholderPattern } from "@/components/ui/placeholder-pattern";
import { PostDialog } from "@/components/publication-dialog";
import { Role } from "@/types/Role";
import { Preset } from "@/types/Preset";
import { SharedData } from "@/types";
import { toast } from "sonner";

interface BackendImage {
    id: number;
    publication_id: number;
    url: string;
    created_at: string;
    updated_at: string;
}

interface BackendUser {
    id: number;
    name: string;
    username: string;
    email: string;
    profile_image: string | null;
    status: number;
    plan_id: number;
    role_id: number;
    description: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    profile_image_url: string | null;
}

interface BackendHashtag {
    id: number;
    name: string;
    slug: string;
    created_at: string;
    updated_at: string;
    pivot: { publication_id: number; hashtag_id: number };
}

interface BackendPublication {
    id: number;
    user_id: number;
    title: string;
    description: string;
    preset_id: number;
    created_at: string;
    updated_at: string;
    user: BackendUser;
    images: BackendImage[];
    preset: Preset;
    hashtags: BackendHashtag[];
    likes_count: number;
    comments_count: number;
    liked: boolean;
    saved: boolean;
}

interface Publication {
    id: number;
    user: {
        name: string;
        username: string;
        profile_image: string | null;
        role: Role;
        plan_id: number;
    };
    images: BackendImage[];
    title: string;
    description: string;
    likes_count: number;
    comments_count: number;
    created_at: string;
    liked: boolean;
    saved: boolean;
    hashtags: string[];
}

interface Paginated<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: "Publicaciones", href: "/publications" },
];

export default function PublicationsPage() {
    const { props } = usePage<{
        publications: Paginated<BackendPublication>;
        presets: Preset[];
    }>();
    const page = usePage<SharedData>();
    const { auth, flash } = page.props;
    const { data: backendPubs, current_page, last_page, per_page, total } =
        props.publications;
    const presets = props.presets;

    const [localPublications, setLocalPublications] = useState<Publication[]>([]);
    const [createOpen, setCreateOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState<Record<number, number>>(
        {}
    );

    useEffect(() => {
        setLocalPublications(
            backendPubs.map((pub) => ({
                id: pub.id,
                user: {
                    name: pub.user.name,
                    username: pub.user.username,
                    profile_image: pub.user.profile_image,
                    role: auth.user.role_id as Role,
                    plan_id: pub.user.plan_id,
                },
                images: pub.images,
                title: pub.title,
                description: pub.description,
                likes_count: pub.likes_count,
                comments_count: pub.comments_count,
                liked: pub.liked,
                saved: pub.saved,
                created_at: pub.created_at,
                hashtags: pub.hashtags.map((h) => h.name),
            }))
        );
    }, [backendPubs, auth.user.role_id]);

    useEffect(() => {
        if (flash.success) toast.success(flash.success);
    }, [flash.success]);

    const nextImage = (pubId: number, totalImages: number) =>
        setCurrentImageIndex((prev) => ({
            ...prev,
            [pubId]: ((prev[pubId] || 0) + 1) % totalImages,
        }));

    const prevImage = (pubId: number, totalImages: number) =>
        setCurrentImageIndex((prev) => ({
            ...prev,
            [pubId]: ((prev[pubId] || 0) - 1 + totalImages) % totalImages,
        }));

    const getCurrentImageIndex = (pubId: number) =>
        currentImageIndex[pubId] || 0;

    const toggleLike = (id: number) => {
        router.post(
            route("publications.toggleLike", id),
            {},
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: (page) => {
                    const updated = (page.props.publications
                        .data as BackendPublication[]
                    ).find((p) => p.id === id);
                    if (updated) {
                        setLocalPublications((prev) =>
                            prev.map((pub) =>
                                pub.id === id
                                    ? { ...pub, liked: updated.liked, likes_count: updated.likes_count }
                                    : pub
                            )
                        );
                    }
                },
            }
        );
    };

    const toggleSave = (id: number) => {
        router.post(
            route("publications.toggleSave", id),
            {},
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: (page) => {
                    const updated = (page.props.publications
                        .data as BackendPublication[]
                    ).find((p) => p.id === id);
                    if (updated) {
                        setLocalPublications((prev) =>
                            prev.map((pub) =>
                                pub.id === id ? { ...pub, saved: updated.saved } : pub
                            )
                        );
                    }
                },
            }
        );
    };

    const paginate = (pageNum: number) => {
        if (pageNum < 1 || pageNum > last_page) return;
        router.get(
            route("publications.index", { page: pageNum, perPage: per_page }),
            {},
            { preserveState: true }
        );
    };

    const indexOfFirstItem = (current_page - 1) * per_page + 1;
    const indexOfLastItem = Math.min(current_page * per_page, total);

    // → NUEVO MÉTODO store
    const handleCreatePublication = (data: {
        title: string;
        description: string;
        preset_id?: number;
        images: File[];
        hashtags: string[];
    }) => {
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("description", data.description);
        if (data.preset_id) formData.append("preset_id", data.preset_id.toString());
        data.images.forEach((file) => formData.append("images[]", file));
        formData.append("hashtags", JSON.stringify(data.hashtags));

        router.post(route("publications.store"), formData, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: (resp) => {
                toast.success(resp.props.flash.message || "¡Publicación creada!");
                setCreateOpen(false);
                // Opcional: recargar o actualizar estado
            },
            onError: (errors) => {
                console.error(errors);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Publicaciones" />
            <div className="flex flex-col gap-4 p-4">
                <h1 className="text-2xl font-bold">Publicaciones</h1>

                <div className="flex justify-end items-center">
                    <PostDialog
                        trigger={
                            <Button variant="default" className="flex items-center cursor-pointer">
                                <Plus className="h-4 w-4 mr-1" />
                                Nueva publicación
                            </Button>
                        }
                        open={createOpen}
                        onOpenChange={setCreateOpen}
                        onSubmit={handleCreatePublication}
                        userRole_id={auth.user.role_id}
                        presets={presets}
                    />
                </div>

                <div className="max-w-xl mx-auto grid grid-cols-1 gap-4">
                    {localPublications.map((pub) => {
                        const isPremium = pub.user.plan_id !== 2;

                        return (
                            <Card
                                key={pub.id}
                                onClick={() => router.get(route("publications.show", pub.id))}
                                className={`flex flex-col h-full cursor-pointer hover:shadow-lg transition-shadow duration-200 ${isPremium ? "border-emerald-500" : ""
                                    }`}
                            >
                                <CardHeader className="px-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Link
                                                href={route("profile.user", pub.user.username)}
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <Avatar className="h-10 w-10">
                                                    <AvatarImage
                                                        src={pub.user.profile_image || "/placeholder.svg"}
                                                        alt={pub.user.name}
                                                    />
                                                    <AvatarFallback className="text-sm">
                                                        {pub.user.name.charAt(0)}
                                                    </AvatarFallback>
                                                </Avatar>
                                            </Link>
                                            <div className="flex flex-col">
                                                <div className="font-medium text-base flex items-center">
                                                    {pub.user.name}
                                                    {isPremium && (
                                                        <Badge variant="outline" className="ml-2 flex items-center">
                                                            <Star className="h-4 w-4 mr-1 text-amber-500" />
                                                            Premium
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    @{pub.user.username}
                                                </div>
                                            </div>
                                        </div>

                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-9 w-9 cursor-pointer">
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
                                                <DropdownMenuItem
                                                    className="text-destructive"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        router.post(
                                                            route("publications.report", pub.id),
                                                            {},
                                                            {
                                                                preserveState: true,
                                                                preserveScroll: true,
                                                                onSuccess: (page) => {
                                                                    toast.success("¡Gracias! Hemos recibido tu reporte.");
                                                                },
                                                                onError: (errors) => {
                                                                    toast.error("Algo salió mal al enviar el reporte.");
                                                                    console.error(errors);
                                                                },
                                                            }
                                                        );
                                                    }}
                                                >
                                                    Reportar
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </CardHeader>

                                <CardContent className="relative flex-grow p-0">
                                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                                        {pub.images.length > 0 ? (
                                            <img
                                                src={pub.images[getCurrentImageIndex(pub.id)].url}
                                                alt={`Publicación ${pub.id}`}
                                                className="w-full h-full object-cover transition-all duration-300"
                                            />
                                        ) : (
                                            <PlaceholderPattern />
                                        )}

                                        {pub.images.length > 1 && (
                                            <>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full h-8 w-8"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        prevImage(pub.id, pub.images.length);
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
                                                        e.stopPropagation();
                                                        nextImage(pub.id, pub.images.length);
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
                                    <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center gap-4">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleLike(pub.id);
                                                }}
                                                className={pub.liked ? "text-destructive" : ""}
                                            >
                                                <Heart className={`h-6 w-6 ${pub.liked ? "fill-destructive" : ""}`} />
                                                <span className="sr-only">Me gusta</span>
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                                                <Share2 className="h-6 w-6" />
                                                <span className="sr-only">Compartir</span>
                                            </Button>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleSave(pub.id);
                                            }}
                                            className={pub.saved ? "fill-primary" : ""}
                                        >
                                            <Bookmark className={`h-6 w-6 ${pub.saved ? "fill-primary" : ""}`} />
                                            <span className="sr-only">Guardar</span>
                                        </Button>
                                    </div>

                                    <div className="flex flex-col gap-2 w-full">
                                        <div className="font-medium">{pub.likes_count} me gusta</div>
                                        <div className="font-medium">{pub.title}</div>
                                        <div>{pub.description}</div>
                                        <div className="flex flex-wrap gap-1 mb-3">
                                            {pub.hashtags.map((tag) => (
                                                <a
                                                    key={tag}
                                                    href={`/publications?hashtag=${encodeURIComponent(
                                                        tag
                                                    )}`}
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        router.get(
                                                            `/publications?hashtag=${encodeURIComponent(
                                                                tag
                                                            )}`
                                                        )
                                                    }}
                                                >
                                                    <Badge
                                                        variant="default"
                                                        className="cursor-pointer"
                                                    >
                                                        #{tag}
                                                    </Badge>
                                                </a>
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
                                </CardFooter>
                            </Card>
                        );
                    })}
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
    );
}
