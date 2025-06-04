import { usePage } from "@inertiajs/react"
import ProfileLayout from "@/Layouts/profile/layout"
import { Aperture } from "lucide-react"

type Preset = {
    id: number
    url: string
}

type Props = {
    user: {
        id: number
        name: string
        username: string
        profile_image: string
        presets: Preset[]
    }
}

export default function PresetsPage() {
    const { user } = usePage<Props>().props

    return (
        <ProfileLayout user={user}>
            <div className="mt-6">
                {user.presets.length > 0 ? (
                    <div className="grid grid-cols-3 gap-1 md:gap-4">
                        {user.presets.map((preset) => (
                            <div
                                key={preset.id}
                                className="aspect-square bg-muted rounded-sm overflow-hidden group cursor-pointer"
                            >
                                <img
                                    src={preset.url}
                                    alt={`Preset ${preset.id}`}
                                    className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        {/* Estado vacío */}
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
    )
}
