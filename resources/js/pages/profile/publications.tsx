import ProfileLayout from "@/layouts/profile/layout"
import { userData } from "@/lib/profile-data"

export default function PublicacionesPage() {
    return (
        <ProfileLayout user={userData}>
            <div className="mt-6">
                <div className="grid grid-cols-3 gap-1 md:gap-4">
                    {Array.from({ length: 15 }).map((_, i) => (
                        <div key={i} className="aspect-square bg-muted rounded-sm overflow-hidden group cursor-pointer">
                            <img
                                src={`/placeholder.svg?height=300&width=300`}
                                alt={`Publicación ${i + 1}`}
                                className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                            />
                        </div>
                    ))}
                </div>

                {/* Empty state si no hay publicaciones */}
                {/* <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
            <Grid3X3 className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No hay publicaciones aún</h3>
          <p className="text-muted-foreground">Cuando compartas fotos y videos, aparecerán en tu perfil.</p>
        </div> */}
            </div>
        </ProfileLayout>
    )
}
