"use client"

import type React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Grid3X3, Bookmark, Settings, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface ProfileUser {
    avatar: string
    name: string
    username: string
    description: string
    postsCount: number
    followersCount: number
    followingCount: number
}

interface ProfileLayoutProps {
    user: ProfileUser
    children: React.ReactNode
}

export default function ProfileLayout({ user, children }: ProfileLayoutProps) {
    const pathname = usePathname()

    const getActiveTab = () => {
        if (pathname.includes("/presets")) return "presets"
        if (pathname.includes("/guardados")) return "guardados"
        return "publicaciones"
    }

    const activeTab = getActiveTab()

    return (
        <div className="min-h-screen bg-background">
            {/* Main Content Container */}
            <div className="w-full max-w-4xl mx-auto">
                {/* Profile Header */}
                <Card className="border-0 shadow-none bg-background">
                    <CardContent className="p-6">
                        {/* Profile Info Section */}
                        <div className="flex flex-col md:flex-row gap-6 mb-6">
                            {/* Avatar */}
                            <div className="flex justify-center md:justify-start">
                                <Avatar className="w-32 h-32 md:w-40 md:h-40">
                                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.username} />
                                    <AvatarFallback className="text-2xl">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                                </Avatar>
                            </div>

                            {/* Profile Details */}
                            <div className="flex-1 space-y-4">
                                {/* Username and Action Buttons */}
                                <div className="flex flex-col sm:flex-row items-center gap-4">
                                    <h1 className="text-xl font-normal">{user.username}</h1>
                                    <div className="flex gap-2">
                                        <Button variant="secondary" size="sm" className="px-6">
                                            Seguir
                                        </Button>
                                        <Button variant="secondary" size="sm" className="px-6">
                                            Mensaje
                                        </Button>
                                        <Button variant="ghost" size="icon">
                                            <MoreHorizontal className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="flex justify-center md:justify-start gap-8">
                                    <div className="text-center md:text-left">
                                        <span className="font-semibold">{user.postsCount.toLocaleString()}</span>
                                        <span className="text-muted-foreground ml-1">publicaciones</span>
                                    </div>
                                    <div className="text-center md:text-left">
                                        <span className="font-semibold">{user.followersCount.toLocaleString()}</span>
                                        <span className="text-muted-foreground ml-1">seguidores</span>
                                    </div>
                                    <div className="text-center md:text-left">
                                        <span className="font-semibold">{user.followingCount.toLocaleString()}</span>
                                        <span className="text-muted-foreground ml-1">seguidos</span>
                                    </div>
                                </div>

                                {/* Name and Bio */}
                                <div className="text-center md:text-left">
                                    <h2 className="font-semibold">{user.name}</h2>
                                    <p className="text-sm text-foreground mt-1 whitespace-pre-line">{user.description}</p>
                                </div>
                            </div>
                        </div>

                        <Separator className="my-6" />

                        {/* Navigation Tabs */}
                        <div className="flex justify-center">
                            <div className="flex">
                                <Link href="/profile/publicaciones">
                                    <Button
                                        variant="ghost"
                                        className={`flex items-center gap-2 px-6 py-3 border-t-2 transition-colors ${activeTab === "publicaciones"
                                                ? "border-foreground text-foreground"
                                                : "border-transparent text-muted-foreground hover:text-foreground"
                                            }`}
                                    >
                                        <Grid3X3 className="w-4 h-4" />
                                        <span className="hidden sm:inline text-xs font-semibold uppercase tracking-wide">
                                            Publicaciones
                                        </span>
                                    </Button>
                                </Link>

                                <Link href="/profile/presets">
                                    <Button
                                        variant="ghost"
                                        className={`flex items-center gap-2 px-6 py-3 border-t-2 transition-colors ${activeTab === "presets"
                                                ? "border-foreground text-foreground"
                                                : "border-transparent text-muted-foreground hover:text-foreground"
                                            }`}
                                    >
                                        <Settings className="w-4 h-4" />
                                        <span className="hidden sm:inline text-xs font-semibold uppercase tracking-wide">Presets</span>
                                    </Button>
                                </Link>

                                <Link href="/profile/guardados">
                                    <Button
                                        variant="ghost"
                                        className={`flex items-center gap-2 px-6 py-3 border-t-2 transition-colors ${activeTab === "guardados"
                                                ? "border-foreground text-foreground"
                                                : "border-transparent text-muted-foreground hover:text-foreground"
                                            }`}
                                    >
                                        <Bookmark className="w-4 h-4" />
                                        <span className="hidden sm:inline text-xs font-semibold uppercase tracking-wide">Guardado</span>
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Content Area */}
                <div className="px-6 pb-6">{children}</div>
            </div>
        </div>
    )
}
