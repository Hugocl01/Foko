import ProfileLayout from "@/layouts/profile/layout"
import { userData } from "@/lib/profile-data"
import { Heart, MessageCircle } from "lucide-react"

export default function SavedPage() {
    return (
        <ProfileLayout user={userData}>
            <div className="mt-6">
                <div className="grid grid-cols-3 gap-1 md:gap-4">
                    {Array.from({ length: 9 }).map((_, i) => (
                        <div key={i} className="aspect-square bg-muted rounded-sm overflow-hidden group cursor-pointer relative">
                            <img
                                src={`/placeholder.svg?height=300&width=300`}
                                alt={`Guardado ${i + 1}`}
                                className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <div className="flex items-center gap-1 text-white text-xs">
                                    <Heart className="w-3 h-3" />
                                    <span>{Math.floor(Math.random() * 1000) + 50}</span>
                                </div>
                                <div className="flex items-center gap-1 text-white text-xs">
                                    <MessageCircle className="w-3 h-3" />
                                    <span>{Math.floor(Math.random() * 100) + 5}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty state si no hay guardados */}
                {/* <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
            <Bookmark className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No tienes publicaciones guardadas</h3>
          <p className="text-muted-foreground">Guarda las publicaciones que te gusten para verlas más tarde.</p>
        </div> */}
            </div>
        </ProfileLayout>
    )
}
