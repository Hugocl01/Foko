import React, { useState, useMemo, useEffect } from "react";
import { Head, usePage, Link, router } from "@inertiajs/react";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
    Heart,
    Bookmark,
    MessageCircle,
    Share2,
    MoreHorizontal,
    ChevronLeft,
    ChevronRight,
    Trash2,
    Star,
} from "lucide-react";
import AppLayout from "@/layouts/app-layout";
import type { BreadcrumbItem } from "@/types";
import { PlaceholderPattern } from "@/components/ui/placeholder-pattern";
import { toast } from "sonner";
import { PostDialog } from "@/components/publication-dialog";
import { Textarea } from "@/components/ui/textarea";

interface BackendImage {
    id: number;
    url: string;
}

interface BackendUser {
    id: number;
    name: string;
    username: string;
    profile_image_url?: string;
    plan_id: number;
}

interface BackendPreset {
    id: number;
    name: string;
    description: string;
    price: number;
}

interface BackendHashtag {
    id: number;
    name: string;
}

interface BackendComment {
    id: number;
    body: string;
    created_at: string;
    user: BackendUser;
}

interface BackendPublication {
    id: number;
    title: string;
    description: string;
    created_at: string;
    user: BackendUser;
    images: BackendImage[];
    preset: BackendPreset | null;
    hashtags: BackendHashtag[];
    likes_count: number;
    comments_count: number;
    liked: boolean;
    saved: boolean;
}

interface PostFormData {
    id?: string;
    preset_id?: number;
    title: string;
    description: string;
    featured_image: File | null;
    images: File[];
    hashtags: string[];
}

export default function Publication() {
    const { props } = usePage<{
        publication: BackendPublication;
        comments: BackendComment[];
        presets: BackendPreset[];
        auth: { user: { id: number; role_id: number } };
        flash: { success?: string };
    }>();

    const { publication: pub, comments, presets, auth, flash } = props;
    const loggedUser = auth.user;
    const isPremium = pub.user.plan_id !== 2;

    useEffect(() => {
        if (flash.success) toast.success(flash.success);
    }, [flash.success]);

    const isOwner = pub.user.id === loggedUser.id;

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [liked, setLiked] = useState(pub.liked);
    const [likesCount, setLikesCount] = useState(pub.likes_count);
    const [saved, setSaved] = useState(pub.saved);
    const [newComment, setNewComment] = useState("");
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const initialPostValues = useMemo<PostFormData>(
        () => ({
            id: String(pub.id),
            title: pub.title,
            description: pub.description,
            featured_image: null,
            images: [],
            hashtags: pub.hashtags.map((h) => h.name),
            preset_id: pub.preset?.id,
        }),
        [pub]
    );

    const totalImages = pub.images.length;
    const nextImage = () => setCurrentImageIndex((i) => (i + 1) % totalImages);
    const prevImage = () => setCurrentImageIndex((i) => (i - 1 + totalImages) % totalImages);

    function toggleLike() {
        router.post(route("publications.toggleLike", pub.id), {}, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: (page) => {
                const updated: BackendPublication = page.props.publication;
                setLiked(updated.liked);
                setLikesCount(updated.likes_count);
            },
        });
    }

    function toggleSave() {
        router.post(route("publications.toggleSave", pub.id), {}, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: (page) => {
                const updated: BackendPublication = page.props.publication;
                setSaved(updated.saved);
            },
        });
    }

    function handleUpdatePublication(data: PostFormData) {
        const payload: Record<string, any> = {
            _method: "patch",
            title: data.title,
            description: data.description,
            hashtags: data.hashtags,
            preset_id: data.preset_id,
        };

        if (data.featured_image) payload.featured_image = data.featured_image;
        if (data.images.length > 0) payload.images = data.images;

        router.post(route("publications.update", pub.id), payload, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Publicación actualizada con éxito");
                setIsEditOpen(false);
                router.reload();
            },
            onError: () => {
                toast.error("Error al actualizar la publicación");
            },
        });
    }

    function handleDelete() {
        setIsDeleteDialogOpen(false);
        router.delete(route("publications.destroy", pub.id), {}, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Publicación eliminada correctamente");
                router.visit(route("publications.index"));
            },
            onError: () => {
                toast.error("Error al eliminar la publicación");
            },
        });
    }

    function handleCommentSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!newComment.trim()) return;

        router.post(route("publications.comments.store", pub.id), { body: newComment }, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Comentario añadido");
                setNewComment("");
                router.reload();
            },
            onError: () => {
                toast.error("Error al enviar el comentario");
            },
        });
    }

    const breadcrumbs: BreadcrumbItem[] = [
        { title: "Publicaciones", href: "/publications" },
        { title: pub.title, href: "" },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={pub.title} />
            <div className="flex flex-col gap-4 p-4 max-w-2xl mx-auto">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold">{pub.title}</h1>
                    {isOwner && (
                        <>
                            <Button size="sm" onClick={() => setIsEditOpen(true)}>Editar</Button>
                            <Button size="sm" variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>Eliminar</Button>
                        </>
                    )}
                </div>

                <Card className={`flex flex-col h-full ${isPremium ? "border-emerald-500" : ""}`}>
                    <CardHeader className="px-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Link href={route("profile.user", pub.user.username)} onClick={(e) => e.stopPropagation()}>
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={pub.user.profile_image_url || "/placeholder.svg"} alt={pub.user.name} />
                                        <AvatarFallback>{pub.user.name.charAt(0)}</AvatarFallback>
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
                                    <div className="text-sm text-muted-foreground">@{pub.user.username}</div>
                                </div>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MoreHorizontal className="h-5 w-5" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <Link href={route("profile.user", pub.user.username)} onClick={(e) => e.stopPropagation()}>
                                        <DropdownMenuItem>Ver perfil</DropdownMenuItem>
                                    </Link>
                                    <DropdownMenuItem>Copiar enlace</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-destructive">Reportar</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </CardHeader>

                    <CardContent className="relative p-0">
                        <div className="relative aspect-square overflow-hidden bg-gray-100">
                            {totalImages > 0 ? (
                                <img src={pub.images[currentImageIndex].url} alt={`Imagen ${currentImageIndex + 1}`} className="w-full h-full object-cover" />
                            ) : (
                                <PlaceholderPattern />
                            )}
                            {totalImages > 1 && (
                                <>
                                    <Button variant="ghost" size="icon" className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white rounded-full" onClick={prevImage}>
                                        <ChevronLeft className="h-5 w-5" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white rounded-full" onClick={nextImage}>
                                        <ChevronRight className="h-5 w-5" />
                                    </Button>
                                </>
                            )}
                        </div>
                    </CardContent>

                    <CardFooter className="flex flex-col gap-4 p-4">
                        <div className="flex justify-between w-full">
                            <div className="flex gap-4">
                                <Button variant="ghost" size="icon" onClick={toggleLike} className={liked ? "text-destructive" : ""}>
                                    <Heart className={`h-6 w-6 ${liked ? "fill-destructive" : ""}`} />
                                </Button>
                                <Button variant="ghost" size="icon">
                                    <MessageCircle className="h-6 w-6" />
                                </Button>
                                <Button variant="ghost" size="icon">
                                    <Share2 className="h-6 w-6" />
                                </Button>
                            </div>
                            <Button variant="ghost" size="icon" onClick={toggleSave} className={saved ? "text-primary" : ""}>
                                <Bookmark className={`h-6 w-6 ${saved ? "fill-primary" : ""}`} />
                            </Button>
                        </div>

                        <div className="flex flex-col gap-2 w-full">
                            <div className="font-medium">{likesCount} me gusta</div>
                            <div className="font-medium">{pub.title}</div>
                            <div>{pub.description}</div>
                            <div className="flex flex-wrap gap-1">
                                {pub.hashtags.map((hashtag) => (
                                    <Link key={hashtag.name} href={`/publications?hashtag=${encodeURIComponent(hashtag.name)}`}>
                                        <Badge variant="default">#{hashtag.name}</Badge>
                                    </Link>
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

                        {pub.preset && (
                            <Card className="mt-8 w-full group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 hover:border-border">
                                <Link href={route("presets.show", pub.preset.id)} className="block">
                                    <CardHeader className="pb-3">
                                        <Badge variant="secondary" className="text-xs font-medium">
                                            Preset aplicado
                                        </Badge>
                                    </CardHeader>
                                    <CardContent className="pb-4">
                                        <h3 className="text-lg font-semibold mb-2 group-hover:text-primary">
                                            {pub.preset.name}
                                        </h3>
                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                            {pub.preset.description}
                                        </p>
                                    </CardContent>
                                    <CardFooter className="pt-4 border-t">
                                        <div className="flex items-center justify-between w-full">
                                            <span className="text-sm text-muted-foreground">Precio</span>
                                            <div className="text-lg font-semibold">
                                                <Badge>{pub.preset.price} €</Badge>
                                            </div>
                                        </div>
                                    </CardFooter>
                                </Link>
                            </Card>
                        )}
                    </CardFooter>
                </Card>

                {/* COMENTARIOS */}
                <div className="mt-8 space-y-4">
                    <h2 className="text-xl font-semibold">
                        Comentarios ({comments.length})
                    </h2>

                    {/* Formulario de nuevo comentario */}
                    {loggedUser && (
                        <form onSubmit={handleCommentSubmit} className="space-y-2">
                            <Textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Escribe un comentario..."
                                rows={3}
                                required
                            />
                            <Button type="submit" disabled={!newComment.trim()}>
                                Publicar comentario
                            </Button>
                        </form>
                    )}

                    {/* Lista de comentarios */}
                    <div className="space-y-4">
                        {comments.map((c) => {
                            const isPremium = c.user.plan_id !== 2;

                            return (
                                <div key={c.id} className="flex gap-3">
                                    <Link
                                        href={route("profile.user", c.user.username)}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage
                                                src={c.user.profile_image_url || "/placeholder.svg"}
                                                alt={c.user.name}
                                            />
                                            <AvatarFallback>
                                                {c.user.name.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Link>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium flex items-center">
                                                {c.user.name}
                                                {isPremium && (
                                                    <Badge variant="outline" className="ml-2 flex items-center">
                                                        <Star className="h-4 w-4 mr-1 text-amber-500" />
                                                        Premium
                                                    </Badge>
                                                )}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(c.created_at).toLocaleString("es-ES", {
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </span>
                                        </div>
                                        <p className="mt-1">{c.body}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Eliminar publicación</DialogTitle>
                            <DialogDescription>
                                ¿Estás seguro de que deseas eliminar <strong>{pub.title}</strong>? Esta acción no se puede deshacer.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancelar</Button>
                            <Button variant="destructive" onClick={handleDelete}>
                                <Trash2 className="h-4 w-4 mr-2" /> Eliminar
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <PostDialog
                    trigger={null}
                    open={isEditOpen}
                    onOpenChange={setIsEditOpen}
                    isEditing
                    initialData={initialPostValues}
                    onSubmit={handleUpdatePublication}
                    userRole_id={loggedUser.role_id}
                    presets={presets}
                />
            </div>
        </AppLayout>
    );
}
