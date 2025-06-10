import React, { useEffect } from "react"
import { usePage, router, Link, Head } from "@inertiajs/react"
import { Bookmark } from "lucide-react"
import { Breadcrumb, type BreadcrumbItem } from "@/components/ui/breadcrumb"
import ProfileLayout, { User, SavedPublication } from "@/Layouts/profile/layout"

type Props = {
    user: {
        id: number
        name: string
        username: string
        profile_image?: string
        profile_image_url: string | null
        description?: string | null
        publications?: any[]
        presets?: any[]
        saveds: SavedPublication[]     // Aquí recibes el array de saved pubs
        followers?: any[]
        following?: any[]
        isFollowing: boolean
        isOwnProfile: boolean
    }
}

export default function SavedsPage() {
    const { user } = usePage<Props>().props

    // Migas de pan
    const breadcrumbs: BreadcrumbItem[] = [
        { title: "Perfil", href: "/profile" },
        { title: "Guardados", href: route("profile.saveds.index", user) },
    ]

    // Al montarse, recarga la lista para reflejar cambios recientes
    useEffect(() => {
        router.reload()
    }, [])

    return (
        <>
            {/* Define el título de la página */}
            <Head title={`Guardados de ${user.username}`} />

            {/* Pasa las migas al layout para que las renderice */}
            <ProfileLayout user={user} breadcrumbs={breadcrumbs}>
                <div className="mt-6">
                    {user.saveds.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {user.saveds.map((item) => (
                                <Link
                                    key={item.id}
                                    href={route("publications.show", item.id)}
                                    className="aspect-square bg-muted rounded-sm overflow-hidden group cursor-pointer"
                                >
                                    <img
                                        src={item.url}
                                        alt={`Guardado ${item.id}`}
                                        className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                                    />
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
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
        </>
    )
}
