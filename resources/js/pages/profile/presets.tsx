import ProfileLayout from "@/layouts/profile/layout"
import { userData } from "@/lib/profile-data"
import { Button } from "@/components/ui/button"
import { Download, Eye } from "lucide-react"

export default function PresetsPage() {
    return (
        <ProfileLayout user={userData}>
            <div className="mt-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="bg-card rounded-lg border overflow-hidden group">
                            <div className="aspect-square bg-muted overflow-hidden relative">
                                <img
                                    src={`/placeholder.svg?height=200&width=200`}
                                    alt={`Preset ${i + 1}`}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <Button size="icon" variant="secondary" className="w-8 h-8">
                                        <Eye className="w-4 h-4" />
                                    </Button>
                                    <Button size="icon" variant="secondary" className="w-8 h-8">
                                        <Download className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                            <div className="p-3">
                                <h3 className="font-medium text-sm">Preset Vintage {i + 1}</h3>
                                <p className="text-xs text-muted-foreground mt-1">Filtro profesional</p>
                                <div className="flex items-center justify-between mt-2">
                                    <span className="text-xs text-muted-foreground">
                                        {Math.floor(Math.random() * 500) + 100} descargas
                                    </span>
                                    <span className="text-xs font-medium">Gratis</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty state si no hay presets */}
                {/* <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
            <Settings className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No hay presets disponibles</h3>
          <p className="text-muted-foreground">Aquí aparecerán tus presets y filtros personalizados.</p>
        </div> */}
            </div>
        </ProfileLayout>
    )
}
