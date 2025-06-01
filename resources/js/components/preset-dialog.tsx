import React, { useState, useEffect } from "react";
import { useForm, usePage } from "@inertiajs/react";
import { X, ImageIcon, File, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PresetDialogProps {
    /**
     * Si deseas abrir/cerrar el diálogo desde fuera, proporciona estas props.
     * Si no, bastará con omitirse y se usará estado interno.
     */
    trigger?: React.ReactNode;
    isEditing?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export function PresetDialog({
    trigger,
    isEditing = false,
    open: controlledOpen,
    onOpenChange: setControlledOpen,
}: PresetDialogProps) {
    // 1) Integración con Inertia: useForm para manejar todos los campos
    const form = useForm({
        name: "",
        description: "",
        price: "",
        file: null as File | null,
        before_image: null as File | null,
        after_image: null as File | null,
        hashtags: [] as string[],
    });

    // Inertia inyecta aquí los errores de validación (Laravel)
    const { errors } = usePage<{ errors: Record<string, string[]> }>().props;

    // 2) Manejo de apertura/cierre del diálogo (controlado o no controlado)
    const [openInternal, setOpenInternal] = useState(false);
    const isControlled = controlledOpen !== undefined && setControlledOpen !== undefined;
    const isDialogOpen = isControlled ? controlledOpen! : openInternal;
    const setIsDialogOpen = isControlled ? setControlledOpen! : setOpenInternal;

    // 3) Cuando el modal se cierra, reiniciamos el formulario (datos y errores)
    useEffect(() => {
        if (!isDialogOpen) {
            form.reset("name", "description", "price", "file", "before_image", "after_image", "hashtags");
            form.clearErrors();
            setHashtagInput("");
            setDragActive(null);
            setActiveTab("info");
        }
    }, [isDialogOpen]);

    // 4) Pestañas internas: "info", "files", "tags"
    const [activeTab, setActiveTab] = useState<"info" | "files" | "tags">("info");

    // 5) Lógica para arrastrar/soltar archivos
    const [dragActive, setDragActive] = useState<string | null>(null);
    const handleDrag = (e: React.DragEvent, field: string) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") setDragActive(field);
        else if (e.type === "dragleave") setDragActive(null);
    };

    const handleDrop = (e: React.DragEvent, field: keyof typeof form.data) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(null);
        if (e.dataTransfer.files?.[0]) {
            form.setData(field, e.dataTransfer.files[0]);
        }
    };

    // 6) Manejo de hashtags
    const [hashtagInput, setHashtagInput] = useState("");
    const addHashtag = () => {
        const tag = hashtagInput.trim();
        if (tag && !form.data.hashtags.includes(tag)) {
            form.setData("hashtags", [...form.data.hashtags, tag]);
            setHashtagInput("");
        }
    };
    const removeHashtag = (tagToRemove: string) => {
        form.setData("hashtags", form.data.hashtags.filter((h) => h !== tagToRemove));
    };
    const handleHashtagKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addHashtag();
        }
    };

    // 7) Componente reutilizable para subir archivos (file input + arrastrar)
    const FileUploadArea = ({
        field,
        accept,
        icon: Icon,
        title,
        description,
    }: {
        field: "file" | "before_image" | "after_image";
        accept: string;
        icon: React.ElementType;
        title: string;
        description: string;
    }) => (
        <div
            className={`relative border-2 border-dashed rounded-lg p-4 transition-colors ${dragActive === field ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-muted-foreground/50"
                }`}
            onDragEnter={(e) => handleDrag(e, field)}
            onDragLeave={(e) => handleDrag(e, field)}
            onDragOver={(e) => handleDrag(e, field)}
            onDrop={(e) => handleDrop(e, field)}
        >
            <input
                type="file"
                accept={accept}
                onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                        form.setData(field, e.target.files[0]);
                    }
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />

            {form.data[field] ? (
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Icon className="h-6 w-6 text-primary" />
                        <div>
                            <p className="font-medium text-sm">{(form.data[field] as File)?.name}</p>
                            <p className="text-xs text-muted-foreground">
                                {(((form.data[field] as File)?.size ?? 0) / 1024 / 1024).toFixed(2)} MB
                            </p>
                        </div>
                    </div>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            form.setData(field, null as any);
                        }}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            ) : (
                <div className="text-center">
                    <Icon className="mx-auto h-8 w-8 text-muted-foreground" />
                    <div className="mt-2">
                        <p className="text-xs font-medium">{title}</p>
                        <p className="text-xs text-muted-foreground">{description}</p>
                    </div>
                </div>
            )}

            {/* Mostrar error si existe */}
            {errors[field] && (
                <p className="mt-2 text-sm text-destructive">{/* @ts-ignore */}
                    {errors[field][0]}
                </p>
            )}
        </div>
    );

    // 8) Enviar datos al backend (Laravel) vía Inertia
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Nota: para enviar archivos, Inertia detecta automáticamente multipart/form-data
        form.post(route("presets.store"), {
            preserveScroll: true,
            onSuccess: () => {
                setIsDialogOpen(false);
            },
            onError: () => {
                // Si hay errores de validación, Inertia los mete en form.errors/props.errors
                // y los mostramos ya en los componentes correspondientes
            },
        });
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        {isEditing ? "Editar Preset" : "Crear Nuevo Preset"}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? "Modifica los detalles de tu preset existente"
                            : "Completa la información para crear un nuevo preset"}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="info" className="cursor-pointer">
                                Información
                            </TabsTrigger>
                            <TabsTrigger value="files" className="cursor-pointer">
                                Archivos
                            </TabsTrigger>
                            <TabsTrigger value="tags" className="cursor-pointer">
                                Hashtags
                            </TabsTrigger>
                        </TabsList>

                        {/* =================== PESTAÑA “Información” =================== */}
                        <TabsContent value="info" className="space-y-4 pt-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Nombre */}
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="flex items-center gap-2">
                                        Nombre del Preset *
                                    </Label>
                                    <Input
                                        id="name"
                                        value={form.data.name}
                                        onChange={(e) => form.setData("name", e.target.value)}
                                        placeholder="Ej: Preset Vintage Film"
                                        required
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-sm text-destructive">{errors.name[0]}</p>
                                    )}
                                </div>

                                {/* Precio */}
                                <div className="space-y-2">
                                    <Label htmlFor="price" className="flex items-center gap-2">
                                        Precio (€) *
                                    </Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        value={form.data.price}
                                        onChange={(e) => form.setData("price", e.target.value)}
                                        placeholder="0.00"
                                        required
                                    />
                                    {errors.price && (
                                        <p className="mt-1 text-sm text-destructive">{errors.price[0]}</p>
                                    )}
                                </div>
                            </div>

                            {/* Descripción */}
                            <div className="space-y-2">
                                <Label htmlFor="description" className="flex items-center gap-2">
                                    Descripción *
                                </Label>
                                <Textarea
                                    id="description"
                                    value={form.data.description}
                                    onChange={(e) => form.setData("description", e.target.value)}
                                    placeholder="Describe tu preset, su estilo y características..."
                                    rows={3}
                                    required
                                />
                                {errors.description && (
                                    <p className="mt-1 text-sm text-destructive">{errors.description[0]}</p>
                                )}
                            </div>
                        </TabsContent>

                        {/* =================== PESTAÑA “Archivos” =================== */}
                        <TabsContent value="files" className="space-y-4 pt-4">
                            <Alert className="mb-4">
                                <AlertDescription>
                                    Arrastra y suelta los archivos o haz clic para seleccionarlos.
                                </AlertDescription>
                            </Alert>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Archivo del Preset */}
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2 text-sm">
                                        <File className="h-4 w-4" /> Archivo del Preset *
                                    </Label>
                                    <FileUploadArea
                                        field="file"
                                        accept=".lrtemplate,.xmp,.dng"
                                        icon={File}
                                        title="Subir archivo"
                                        description="Arrastra o haz clic"
                                    />
                                </div>

                                {/* Imagen “Antes” */}
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2 text-sm">
                                        <ImageIcon className="h-4 w-4" /> Imagen Antes *
                                    </Label>
                                    <FileUploadArea
                                        field="before_image"
                                        accept="image/*"
                                        icon={ImageIcon}
                                        title="Imagen original"
                                        description="Sin preset"
                                    />
                                </div>

                                {/* Imagen “Después” */}
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2 text-sm">
                                        <ImageIcon className="h-4 w-4" /> Imagen Después *
                                    </Label>
                                    <FileUploadArea
                                        field="after_image"
                                        accept="image/*"
                                        icon={ImageIcon}
                                        title="Imagen editada"
                                        description="Con preset"
                                    />
                                </div>
                            </div>
                        </TabsContent>

                        {/* =================== PESTAÑA “Hashtags” =================== */}
                        <TabsContent value="tags" className="space-y-4 pt-4">
                            <div className="space-y-4">
                                <div className="flex gap-2">
                                    <Input
                                        value={hashtagInput}
                                        onChange={(e) => setHashtagInput(e.target.value)}
                                        onKeyPress={handleHashtagKeyPress}
                                        placeholder="Agregar hashtag..."
                                        className="flex-1"
                                    />
                                    <Button
                                        type="button"
                                        onClick={addHashtag}
                                        variant="outline"
                                        size="sm"
                                        className="cursor-pointer"
                                    >
                                        <Plus className="h-4 w-4 mr-1" />
                                        Agregar
                                    </Button>
                                </div>

                                <ScrollArea className="h-[150px] w-full rounded-md border p-2">
                                    {form.data.hashtags.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {form.data.hashtags.map((tag, i) => (
                                                <Badge
                                                    key={i}
                                                    variant="secondary"
                                                    className="flex items-center gap-1"
                                                >
                                                    #{tag}
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeHashtag(tag)}
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </Button>
                                                </Badge>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                                            No hay hashtags agregados
                                        </div>
                                    )}
                                </ScrollArea>
                            </div>
                        </TabsContent>
                    </Tabs>

                    <DialogFooter className="flex justify-end space-x-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsDialogOpen(false)}
                            className="cursor-pointer"
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" className="cursor-pointer">
                            {isEditing ? "Actualizar" : "Crear"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
