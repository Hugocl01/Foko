import React, { useState, useEffect, useMemo } from "react"
import { X, ImageIcon, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface PostFormData {
    id?: string
    title: string
    content: string
    featured_image: File | null
    images: File[]
    hashtags: string[]
}

interface PostDialogProps {
    initialData?: Partial<PostFormData>
    onSubmit: (data: PostFormData) => void
    trigger?: React.ReactNode
    isEditing?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
    userRole_id: number
}

export function PostDialog({
    initialData,
    onSubmit,
    trigger,
    isEditing = false,
    open: controlledOpen,
    onOpenChange: setControlledOpen,
    userRole_id,
}: PostDialogProps) {
    const initialForm = useMemo<PostFormData>(
        () => ({
            id: initialData?.id,
            title: initialData?.title || "",
            content: initialData?.content || "",
            featured_image: initialData?.featured_image || null,
            images: initialData?.images ? [...initialData.images] : [],
            hashtags: initialData?.hashtags ? [...initialData.hashtags] : [],
        }),
        [initialData]
    )

    const [uncontrolledOpen, setUncontrolledOpen] = useState(false)
    const isControlled = controlledOpen !== undefined && setControlledOpen !== undefined
    const isDialogOpen = isControlled ? controlledOpen! : uncontrolledOpen
    const setIsDialogOpen = isControlled ? setControlledOpen! : setUncontrolledOpen

    const [formData, setFormData] = useState<PostFormData>(initialForm)
    const [hashtagInput, setHashtagInput] = useState("")
    const [dragActive, setDragActive] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState("info")

    useEffect(() => {
        setFormData(initialForm)
        setHashtagInput("")
        setDragActive(null)
        setActiveTab("info")
    }, [initialForm, isDialogOpen])

    const handleInputChange = (field: keyof PostFormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const maxImages = userRole_id === 1 ? 3 : 1

    const handleFileSelect = (files: File[]) => {
        // filter only images
        const imgs = files.filter((f) => f.type.startsWith("image/"))
        const remaining = maxImages - formData.images.length
        return imgs.slice(0, remaining)
    }

    const handleDrop = (
        e: React.DragEvent,
    ) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(null)
        const dropped = Array.from(e.dataTransfer.files)
        if (!dropped.length) return
        const toAdd = handleFileSelect(dropped)
        if (toAdd.length) {
            setFormData((prev) => ({ ...prev, images: [...prev.images, ...toAdd] }))
        }
    }

    const addHashtag = () => {
        const tag = hashtagInput.trim()
        if (tag && !formData.hashtags.includes(tag)) {
            setFormData((prev) => ({ ...prev, hashtags: [...prev.hashtags, tag] }))
            setHashtagInput("")
        }
    }

    const removeHashtag = (tag: string) => {
        setFormData((prev) => ({ ...prev, hashtags: prev.hashtags.filter((h) => h !== tag) }))
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault()
            addHashtag()
        }
    }

    const isTitleValid = formData.title.trim().length > 0
    const isContentValid = formData.content.trim().length > 0
    const isFormValid = isTitleValid && isContentValid

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!isFormValid) return
        onSubmit(formData)
        setIsDialogOpen(false)
    }

    const FileUploadArea = () => (
        <div
            className={`relative border-2 border-dashed rounded-lg p-4 transition-colors ${dragActive === "images" ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-muted-foreground/50"
                }`}
            onDragEnter={(e) => { e.preventDefault(); setDragActive("images") }}
            onDragLeave={(e) => { e.preventDefault(); setDragActive(null) }}
            onDragOver={(e) => { e.preventDefault(); setDragActive("images") }}
            onDrop={handleDrop}
        >
            <input
                type="file"
                accept="image/*"
                multiple
                disabled={formData.images.length >= maxImages}
                onChange={(e) => {
                    const files = e.target.files ? Array.from(e.target.files) : []
                    const toAdd = handleFileSelect(files)
                    if (toAdd.length) {
                        setFormData((prev) => ({ ...prev, images: [...prev.images, ...toAdd] }))
                    }
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            {formData.images.length > 0 ? (
                <div className="flex flex-col gap-2">
                    {formData.images.map((f, i) => (
                        <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <ImageIcon className="h-6 w-6 text-primary" />
                                <div>
                                    <p className="font-medium text-sm">{f.name}</p>
                                    <p className="text-xs text-muted-foreground">{(f.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                            </div>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        images: prev.images.filter((_, idx) => idx !== i),
                                    }))
                                }
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                    {formData.images.length < maxImages && (
                        <p className="text-xs text-muted-foreground">
                            Puedes subir {maxImages - formData.images.length} imagen(es) más.
                        </p>
                    )}
                </div>
            ) : (
                <div className="text-center">
                    <ImageIcon className="mx-auto h-8 w-8 text-muted-foreground" />
                    <div className="mt-2">
                        <p className="text-xs font-medium">Subir imagen(es)</p>
                        <p className="text-xs text-muted-foreground">
                            {userRole_id === 1
                                ? "Hasta 3 imágenes"
                                : "1 imagen máxima"}
                        </p>
                    </div>
                </div>
            )}
        </div>
    )

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Editar Publicación" : "Crear Nueva Publicación"}</DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? "Modifica tu publicación existente."
                            : "Completa la información para publicar."}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="info">Información</TabsTrigger>
                            <TabsTrigger value="media">Imágenes</TabsTrigger>
                            <TabsTrigger value="tags">Hashtags</TabsTrigger>
                        </TabsList>

                        <TabsContent value="info" className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Título</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => handleInputChange("title", e.target.value)}
                                    placeholder="Título de la publicación"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="content">Contenido</Label>
                                <Textarea
                                    id="content"
                                    value={formData.content}
                                    onChange={(e) => handleInputChange("content", e.target.value)}
                                    placeholder="Escribe tu contenido aquí..."
                                    rows={5}
                                    required
                                />
                            </div>
                        </TabsContent>

                        <TabsContent value="media" className="space-y-4 pt-4">
                            <Alert>
                                <AlertDescription>
                                    Arrastra y suelta solo imágenes, o haz clic para seleccionar.
                                </AlertDescription>
                            </Alert>
                            <FileUploadArea />
                        </TabsContent>

                        <TabsContent value="tags" className="space-y-4 pt-4">
                            <div className="flex gap-2">
                                <Input
                                    value={hashtagInput}
                                    onChange={(e) => setHashtagInput(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Agregar hashtag..."
                                    className="flex-1"
                                />
                                <Button variant="outline" size="sm" onClick={addHashtag}>
                                    <Plus className="h-4 w-4 mr-1" />Agregar
                                </Button>
                            </div>
                            <ScrollArea className="h-[150px] w-full rounded-md border p-2">
                                {formData.hashtags.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {formData.hashtags.map((tag, i) => (
                                            <Badge key={i} variant="secondary" className="flex items-center gap-1">
                                                #{tag}
                                                <Button
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
                                        Sin hashtags
                                    </div>
                                )}
                            </ScrollArea>
                        </TabsContent>
                    </Tabs>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={!isFormValid}>
                            {isEditing ? "Actualizar" : "Publicar"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
