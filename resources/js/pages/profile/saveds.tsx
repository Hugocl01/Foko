import { usePage } from "@inertiajs/react"
import ProfileLayout from "@/Layouts/profile/layout"
import { Bookmark } from "lucide-react"

type SavedItem = {
    id: number
    url: string
}

type Props = {
    user: {
        id: number
        name: string
        username: string
        profile_image: string
        saveds: SavedItem[]
    }
}

export default function SavedsPage() {
    const { user } = usePage<Props>().props

    return (
        <ProfileLayout user={user}>
            <div className="mt-6">
                {user.saveds.length > 0 ? (
                    <div className="grid grid-cols-3 gap-1 md:gap-4">
                        {user.saveds.map((item) => (
                            <div
                                key={item.id}
                                className="aspect-square bg-muted rounded-sm overflow-hidden group cursor-pointer"
                            >
                                <img
                                    src={item.url}
                                    alt={`Guardado ${item.id}`}
                                    className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        {/* Estado vacío */}
                        <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                            <Bookmark />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">No hay elementos guardados</h3>
                        <p className="text-muted-foreground">
                            Cuando guardes publicaciones, aparecerán aquí.
                        </p>
                    </div>
                )}
            </div>
        </ProfileLayout>
    )
}
