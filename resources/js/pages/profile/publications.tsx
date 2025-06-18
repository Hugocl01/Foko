import { usePage, Link, Head } from "@inertiajs/react"
import { Camera } from "lucide-react"
import { Breadcrumb, type BreadcrumbItem } from "@/components/ui/breadcrumb"
import ProfileLayout, { User, Publication } from "./../../layouts/profile/layout"
import { userInfo } from "os"

type Props = {
    user: {
        id: number
        name: string
        username: string
        profile_image?: string
        profile_image_url: string | null
        description?: string | null
        publications: Publication[]  // cada Publication tiene un campo `images: { url: string }[]`
        presets?: any[]   // no es estrictamente necesario aquí, pero el layout lo puede recibir
        saveds?: any[]    // idem
        followers?: any[]
        following?: any[]
        isFollowing: boolean
        isOwnProfile: boolean
    }
}

export default function PublicationsPage() {
    const { user } = usePage<Props>().props

    const breadcrumbs: BreadcrumbItem[] = [
        { title: "Perfil", href: "/profile" },
        { title: "Publicaciones", href: route("profile.publications.index", user) },
    ]

    return (
        <>
            {/* Define el title de la página */}
            <Head title={`Publicaciones de ${user.username}`} />

            {/* Pasa las migas al layout para que las renderice */}
            <ProfileLayout user={user} breadcrumbs={breadcrumbs}>
                <div className="mt-6">
                    {user.publications.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {user.publications.map((pub) => (
                                <Link
                                    key={pub.id}
                                    href={route("publications.show", pub.id)}
                                    className="aspect-square bg-muted rounded-sm overflow-hidden group cursor-pointer"
                                >
                                    <img
                                        src={pub.images[0]?.url || "/placeholder.svg"}
                                        alt={`Publicación ${pub.id}`}
                                        className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                                    />
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            {/* Estado vacío */}
                            <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                                <Camera />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">No hay publicaciones aún</h3>
                            <p className="text-muted-foreground">
                                Cuando compartas fotos y videos, aparecerán en tu perfil.
                            </p>
                        </div>
                    )}
                </div>
            </ProfileLayout>
        </>
    )
}
