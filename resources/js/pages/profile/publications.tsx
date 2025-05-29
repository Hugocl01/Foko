import { usePage } from '@inertiajs/react'
import ProfileLayout from '@/Layouts/profile/layout'

type Publication = {
    id: number
    url: string
}

type Props = {
    user: {
        id: number
        name: string
        avatar_url: string
        publications: Publication[]
    }
}

export default function PublicationsPage() {
    // Extraes el prop "user" que enviaste desde Laravel
    const { user } = usePage<Props>().props
console.log(user)
    return (
        <ProfileLayout user={user}>
            <div className="mt-6">
                {user.publications.length > 0 ? (
                    <div className="grid grid-cols-3 gap-1 md:gap-4">
                        {user.publications.map((pub) => (
                            <div
                                key={pub.id}
                                className="aspect-square bg-muted rounded-sm overflow-hidden group cursor-pointer"
                            >
                                <img
                                    src={pub.url}
                                    alt={`Publicación ${pub.id}`}
                                    className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        {/* Estado vacío */}
                        <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                            <svg /* icono de cuadrícula */ />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">No hay publicaciones aún</h3>
                        <p className="text-muted-foreground">
                            Cuando compartas fotos y videos, aparecerán en tu perfil.
                        </p>
                    </div>
                )}
            </div>
        </ProfileLayout>
    )
}
