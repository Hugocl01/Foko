import type React from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MoreHorizontal, Settings, UserPlus, Grid3X3, Play, Bookmark } from "lucide-react"
import AppLayout from "../app-layout"

export default function ProfileLayout({ children }: { children?: React.ReactNode }) {

    return (
        <AppLayout>
            <div className="">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center gap-2">
                        <h1 className="text-xl font-semibold">username</h1>
                        <Badge variant="secondary" className="text-xs">
                            Verified
                        </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                            <UserPlus className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                {/* Profile Info */}
                <div className="p-4">
                    <div className="flex items-start gap-4 mb-4">
                        {/* Avatar */}
                        <Avatar className="w-20 h-20 md:w-32 md:h-32">
                            <AvatarImage src="/placeholder.svg?height=128&width=128" alt="Profile" />
                            <AvatarFallback>UN</AvatarFallback>
                        </Avatar>

                        {/* Stats and Actions */}
                        <div className="flex-1">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="text-center">
                                    <div className="font-semibold text-lg">1,234</div>
                                    <div className="text-sm text-muted-foreground">posts</div>
                                </div>
                                <div className="text-center">
                                    <div className="font-semibold text-lg">567K</div>
                                    <div className="text-sm text-muted-foreground">followers</div>
                                </div>
                                <div className="text-center">
                                    <div className="font-semibold text-lg">890</div>
                                    <div className="text-sm text-muted-foreground">following</div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                                <Button variant="outline" className="flex-1">
                                    Following
                                </Button>
                                <Button variant="outline" className="flex-1">
                                    Message
                                </Button>
                                <Button variant="outline" size="icon">
                                    <Settings className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Bio */}
                    <div className="space-y-1">
                        <h2 className="font-semibold">Display Name</h2>
                        <p className="text-sm text-muted-foreground">
                            ✨ Content Creator & Designer
                            <br />📍 New York, NY
                            <br />🎨 Sharing my creative journey
                            <br />👇 Check out my latest work
                        </p>
                        <a href="#" className="text-sm text-primary font-medium">
                            linktr.ee/username
                        </a>
                    </div>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="posts" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 rounded-none border-t">
                        <TabsTrigger value="posts" className="flex items-center gap-1">
                            <Grid3X3 className="h-4 w-4" />
                            <span className="hidden sm:inline">POSTS</span>
                        </TabsTrigger>
                        <TabsTrigger value="reels" className="flex items-center gap-1">
                            <Play className="h-4 w-4" />
                            <span className="hidden sm:inline">REELS</span>
                        </TabsTrigger>
                        <TabsTrigger value="tagged" className="flex items-center gap-1">
                            <Bookmark className="h-4 w-4" />
                            <span className="hidden sm:inline">TAGGED</span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="posts" className="mt-0">
                        {children}
                    </TabsContent>

                    <TabsContent value="reels" className="mt-0">
                        {children}
                    </TabsContent>

                    <TabsContent value="tagged" className="mt-0">
                        {children}
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    )
}
