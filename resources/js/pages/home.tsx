import React, { useState } from "react";
import { Head, usePage, router, Link } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
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
import { PlaceholderPattern } from "@/components/ui/placeholder-pattern";
import {
    Heart,
    Share2,
    Bookmark,
    MoreHorizontal,
    ChevronLeft,
    ChevronRight,
    Star,
    Eye,
    EyeOff,
    Plus,
} from "lucide-react";
import type { BreadcrumbItem } from "@/types";

type Image = { id: number; url: string };
type User = {
    id: number;
    name: string;
    username: string;
    profile_image: string | null;
    plan_id: number;
};
type Hashtag = { id: number; name: string; slug: string };
type Publication = {
    id: number;
    title: string;
    description: string;
    created_at: string;
    likes_count: number;
    comments_count: number;
    liked: boolean;
    saved: boolean;
    images: Image[];
    user: User;
    hashtags: Hashtag[];
};
type Preset = {
    id: number;
    name: string;
    description: string;
    price: string;
    before_image?: string;
    after_image?: string;
    user: User;
    hashtags: Hashtag[];
};

type PageProps = {
    topPublications: Publication[];
    premiumPresets: Preset[];
};

const breadcrumbs: BreadcrumbItem[] = [{ title: "Inicio", href: "/home" }];

export default function Home() {
    const { topPublications, premiumPresets } = usePage<PageProps>().props;

    // Carousel state para publicaciones
    const [imgIndex, setImgIndex] = useState<Record<number, number>>({});
    const nextImage = (id: number, total: number) =>
        setImgIndex((p) => ({ ...p, [id]: ((p[id] || 0) + 1) % total }));
    const prevImage = (id: number, total: number) =>
        setImgIndex((p) => ({ ...p, [id]: ((p[id] || 0) - 1 + total) % total }));
    const getCurrentImageIndex = (id: number) => imgIndex[id] || 0;

    // Presets before/after toggle
    const [viewMode, setViewMode] = useState<Record<number, "before" | "after">>({});
    const togglePresetView = (id: number) =>
        setViewMode((p) => ({ ...p, [id]: p[id] === "before" ? "after" : "before" }));
    const getPresetView = (id: number) => viewMode[id] || "after";

    // Like / save handlers
    const toggleLike = (id: number) => {
        router.post(route("publications.toggleLike", id), {}, { preserveState: true, preserveScroll: true });
    };
    const toggleSave = (id: number) => {
        router.post(route("publications.toggleSave", id), {}, { preserveState: true, preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Inicio" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">

                {/* ⇨ Columna izquierda: Publicaciones Destacadas */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold">Publicaciones Destacadas</h2>
                    <div className="space-y-4">
                        {topPublications.map((pub) => {
                            const totalImgs = pub.images.length;
                            const idx = getCurrentImageIndex(pub.id);
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
                                                        <AvatarFallback>{pub.user.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                </Link>
                                                <div className="flex flex-col">
                                                    <div className="font-medium text-base flex items-center">
                                                        {pub.user.name}
                                                        {isPremium && (
                                                            <Badge variant="outline" className="ml-2 flex items-center">
                                                                <Star className="h-4 w-4 mr-1 text-amber-500" /> Premium
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
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal />
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
                                                    <DropdownMenuItem className="text-destructive">
                                                        Reportar
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="relative flex-grow p-0">
                                        <div className="relative aspect-square overflow-hidden bg-gray-100">
                                            {totalImgs > 0 ? (
                                                <img
                                                    src={pub.images[idx].url}
                                                    alt={pub.title}
                                                    className="w-full h-full object-cover transition-all duration-300"
                                                />
                                            ) : (
                                                <PlaceholderPattern className="absolute inset-0" />
                                            )}
                                            {totalImgs > 1 && (
                                                <>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full h-8 w-8"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            prevImage(pub.id, totalImgs);
                                                        }}
                                                    >
                                                        <ChevronLeft className="h-5 w-5" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full h-8 w-8"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            nextImage(pub.id, totalImgs);
                                                        }}
                                                    >
                                                        <ChevronRight className="h-5 w-5" />
                                                    </Button>
                                                    <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1">
                                                        {pub.images.map((_, i) => (
                                                            <div
                                                                key={i}
                                                                className={`h-1.5 rounded-full ${i === idx ? "w-4 bg-white" : "w-1.5 bg-white/60"
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
                                                className={pub.saved ? "text-primary" : ""}
                                            >
                                                <Bookmark
                                                    className="h-6 w-6 fill-current"
                                                />
                                                <span className="sr-only">Guardar</span>
                                            </Button>
                                        </div>
                                        <div className="flex flex-col gap-2 w-full">
                                            <div className="font-medium">{pub.likes_count} me gusta</div>
                                            <div className="font-medium">{pub.title}</div>
                                            <div>{pub.description}</div>
                                            <div className="flex flex-wrap gap-1 mb-3">
                                                {pub.hashtags.map((tag) => (
                                                    <Link
                                                        key={tag.id}
                                                        href={`/publications?hashtag=${encodeURIComponent(tag.slug)}`}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            router.get(`/publications?hashtag=${encodeURIComponent(tag.slug)}`);
                                                        }}
                                                    >
                                                        <Badge variant="default">#{tag.name}</Badge>
                                                    </Link>
                                                ))}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
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
                </section>

                {/* ⇨ Columna derecha: Presets Premium (sin cambios por ahora) */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold">Presets Premium</h2>
                    {/* … aquí va tu grid de presets, igual que antes … */}
                </section>
            </div>
        </AppLayout>
    );
}
