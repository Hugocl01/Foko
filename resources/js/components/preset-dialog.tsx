import type React from "react"

import { useState, useEffect, useMemo } from "react"
import { X, ImageIcon, File, DollarSign, FileText, Plus } from "lucide-react"

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

interface PresetFormData {
    id?: string
    name: string
    description: string
    price: string
    file: File | null
    before_image: File | null
    after_image: File | null
    hashtags: string[]
}

interface PresetDialogProps {
    initialData?: Partial<PresetFormData>
    onSubmit: (data: PresetFormData) => void
    trigger?: React.ReactNode
    isEditing?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

export function PresetDialog({
    initialData,
    onSubmit,
    trigger,
    isEditing = false,
    open: controlledOpen,
    onOpenChange: setControlledOpen,
}: PresetDialogProps) {
    // derive initial form state
    const initialForm = useMemo<PresetFormData>(() => ({
        id: initialData?.id,
        name: initialData?.name || "",
        description: initialData?.description || "",
        price: initialData?.price || "",
        file: initialData?.file || null,
        before_image: initialData?.before_image || null,
        after_image: initialData?.after_image || null,
        hashtags: initialData?.hashtags || [],
    }), [initialData])

    const [open, setOpen] = useState(false)
    const isControlled = controlledOpen !== undefined && setControlledOpen !== undefined
    const isDialogOpen = isControlled ? controlledOpen! : open
    const setIsDialogOpen = isControlled ? setControlledOpen! : setOpen

    const [formData, setFormData] = useState<PresetFormData>(initialForm)
    const [hashtagInput, setHashtagInput] = useState("")
    const [dragActive, setDragActive] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState("info")

    // reset form when dialog closes
    useEffect(() => {
        if (!isDialogOpen) {
            setFormData(initialForm)
            setHashtagInput("")
            setDragActive(null)
            setActiveTab("info")
        }
    }, [isDialogOpen, initialForm])

    const handleInputChange = (field: keyof PresetFormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleFileUpload = (field: keyof Omit<PresetFormData, 'name' | 'description' | 'price' | 'hashtags'>, file: File) => {
        setFormData((prev) => ({ ...prev, [field]: file }))
    }

    const handleDrag = (e: React.DragEvent, field: string) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") setDragActive(field)
        else if (e.type === "dragleave") setDragActive(null)
    }

    const handleDrop = (e: React.DragEvent, field: keyof Omit<PresetFormData, 'name' | 'description' | 'price' | 'hashtags'>) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(null)
        if (e.dataTransfer.files?.[0]) handleFileUpload(field, e.dataTransfer.files[0])
    }

    const addHashtag = () => {
        const tag = hashtagInput.trim()
        if (tag && !formData.hashtags.includes(tag)) {
            setFormData((prev) => ({ ...prev, hashtags: [...prev.hashtags, tag] }))
            setHashtagInput("")
        }
    }

    const removeHashtag = (hashtag: string) => {
        setFormData((prev) => ({ ...prev, hashtags: prev.hashtags.filter((h) => h !== hashtag) }))
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault()
            addHashtag()
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(formData)
        setIsDialogOpen(false)
    }

    const FileUploadArea = ({ field, accept, icon: Icon, title, description, }: { field: keyof Omit<PresetFormData, 'name' | 'description' | 'price' | 'hashtags'>; accept: string; icon: React.ElementType; title: string; description: string }) => (
        <div
            className={`relative border-2 border-dashed rounded-lg p-4 transition-colors ${dragActive === field ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-muted-foreground/50"
                }`}
            onDragEnter={(e) => handleDrag(e, field)}
            onDragLeave={(e) => handleDrag(e, field)}
            onDragOver={(e) => handleDrag(e, field)}
            onDrop={(e) => handleDrop(e, field)}
        >
            <input type="file" accept={accept} onChange={(e) => e.target.files?.[0] && handleFileUpload(field, e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            {formData[field] ? (
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Icon className="h-6 w-6 text-primary" />
                        <div>
                            <p className="font-medium text-sm">{(formData[field] as File)?.name}</p>
                            <p className="text-xs text-muted-foreground">{(((formData[field] as File)?.size ?? 0) / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                    </div>
                    <Button type="button" variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleFileUpload(field, null as any) }}>
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
        </div>
    )

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        {isEditing ? "Editar Preset" : "Crear Nuevo Preset"}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing ? "Modifica los detalles de tu preset existente" : "Completa la información para crear un nuevo preset"}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="info">Información</TabsTrigger>
                            <TabsTrigger value="files">Archivos</TabsTrigger>
                            <TabsTrigger value="tags">Hashtags</TabsTrigger>
                        </TabsList>

                        <TabsContent value="info" className="space-y-4 pt-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="flex items-center gap-2"><FileText className="h-4 w-4" /> Nombre del Preset</Label>
                                    <Input id="name" value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} placeholder="Ej: Preset Vintage Film" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="price" className="flex items-center gap-2"><DollarSign className="h-4 w-4" /> Precio</Label>
                                    <Input id="price" type="number" step="0.01" value={formData.price} onChange={(e) => handleInputChange("price", e.target.value)} placeholder="0.00" required />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description" className="flex items-center gap-2"><FileText className="h-4 w-4" /> Descripción</Label>
                                <Textarea id="description" value={formData.description} onChange={(e) => handleInputChange("description", e.target.value)} placeholder="Describe tu preset, su estilo y características..." rows={3} required />
                            </div>
                        </TabsContent>

                        <TabsContent value="files" className="space-y-4 pt-4">
                            <Alert className="mb-4"><AlertDescription>Arrastra y suelta los archivos o haz clic para seleccionarlos.</AlertDescription></Alert>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2 text-sm"><File className="h-4 w-4" /> Archivo del Preset</Label>
                                    <FileUploadArea field="file" accept=".lrtemplate,.xmp,.dng" icon={File} title="Subir archivo" description="Arrastra o haz clic" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2 text-sm"><ImageIcon className="h-4 w-4" /> Imagen Antes</Label>
                                    <FileUploadArea field="before_image" accept="image/*" icon={ImageIcon} title="Imagen original" description="Sin preset" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2 text-sm"><ImageIcon className="h-4 w-4" /> Imagen Después</Label>
                                    <FileUploadArea field="after_image" accept="image/*" icon={ImageIcon} title="Imagen editada" description="Con preset" />
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="tags" className="space-y-4 pt-4">
                            <div className="space-y-4">
                                <div className="flex gap-2">
                                    <Input value={hashtagInput} onChange={(e) => setHashtagInput(e.target.value)} onKeyPress={handleKeyPress} placeholder="Agregar hashtag..." className="flex-1" />
                                    <Button type="button" onClick={addHashtag} variant="outline" size="sm"><Plus className="h-4 w-4 mr-1" /> Agregar</Button>
                                </div>
                                <ScrollArea className="h-[150px] w-full rounded-md border p-2">
                                    {formData.hashtags.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {formData.hashtags.map((tag, i) => (
                                                <Badge key={i} variant="secondary" className="flex items-center gap-1">#{tag}<Button type="button" variant="ghost" size="sm" onClick={() => removeHashtag(tag)}><X className="h-3 w-3" /></Button></Badge>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-muted-foreground text-sm">No hay hashtags agregados</div>
                                    )}
                                </ScrollArea>
                            </div>
                        </TabsContent>
                    </Tabs>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                        <Button type="submit">{isEditing ? "Actualizar" : "Crear"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
