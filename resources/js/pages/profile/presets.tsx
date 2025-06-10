import { usePage, Link, Head } from "@inertiajs/react"
import { Aperture } from "lucide-react"
import { Breadcrumb, type BreadcrumbItem } from "@/components/ui/breadcrumb"
import ProfileLayout, { Preset } from "@/Layouts/profile/layout"

type Props = {
    user: {
        id: number
        name: string
        username: string
        profile_image?: string
        profile_image_url: string | null
        description?: string | null
        presets: Array<{
            id: number
            name: string
            description: string
            price: string
            before_image_url: string | null
            after_image_url: string | null
        }>
        publications?: any[]
        saveds?: any[]
        followers?: any[]
        following?: any[]
        isFollowing: boolean
        isOwnProfile: boolean
    }
}

export default function PresetsPage() {
    const { user } = usePage<Props>().props

    const breadcrumbs: BreadcrumbItem[] = [
        { title: "Perfil", href: "/profile" },
        { title: "Presets", href: route("profile.presets.index", user) },
    ]

    return (
        <>
            {/* Define el título de la página */}
            <Head title={`Presets de ${user.username}`} />

            {/* Pasa las migas al layout para que las renderice */}
            <ProfileLayout user={user} breadcrumbs={breadcrumbs}>
                <div className="mt-6">
                    {user.presets.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {user.presets.map((preset) => (
                                <Link
                                    key={preset.id}
                                    href={route("presets.show", preset.id)}
                                    className="aspect-square bg-muted rounded-sm overflow-hidden group cursor-pointer"
                                >
                                    <img
                                        src={preset.after_image_url || "/placeholder.svg"}
                                        alt={`Preset ${preset.name}`}
                                        className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                                    />
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                                <Aperture />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">No hay presets aún</h3>
                            <p className="text-muted-foreground">
                                Cuando compartas presets, aparecerán en tu perfil.
                            </p>
                        </div>
                    )}
                </div>
            </ProfileLayout>
        </>
    )
}
