import type React from "react"

import { useState } from "react"
import {
    Search,
    Filter,
    MoreHorizontal,
    ChevronLeft,
    ChevronRight,
    Trash2,
    Edit,
    UserPlus,
    X,
    Save,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import AppLayout from "@/layouts/app-layout"
import { Head } from "@inertiajs/react"
import type { BreadcrumbItem } from "@/types"

// Tipos de datos
interface User {
    id: number
    name: string
    username: string
    plan: "free" | "basic" | "pro" | "enterprise"
    role: "user" | "admin" | "editor" | "viewer"
    avatar: string
    email: string
    createdAt: string
    lastLogin: string
    status: "active" | "inactive" | "suspended"
}

// Colores para los planes
const planColors = {
    free: "bg-gray-500",
    basic: "bg-blue-500",
    pro: "bg-purple-500",
    enterprise: "bg-amber-500",
}

// Colores para los roles
const roleColors = {
    user: "bg-gray-500",
    admin: "bg-red-500",
    editor: "bg-green-500",
    viewer: "bg-blue-500",
}

// Colores para los estados
const statusColors = {
    active: "bg-green-500",
    inactive: "bg-gray-500",
    suspended: "bg-red-500",
}

// Breadcrumbs para la navegación
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Usuarios",
        href: "/users",
    },
]

export default function Users() {
    // Estado para los usuarios
    const [users, setUsers] = useState<User[]>([
        {
            id: 1,
            name: "Carlos Mendez",
            username: "carlosmendez",
            plan: "pro",
            role: "admin",
            avatar: "/placeholder.svg?height=40&width=40",
            email: "carlos@example.com",
            createdAt: "2023-01-15",
            lastLogin: "2023-05-10",
            status: "active",
        },
        {
            id: 2,
            name: "Laura Sánchez",
            username: "laurasanchez",
            plan: "basic",
            role: "editor",
            avatar: "/placeholder.svg?height=40&width=40",
            email: "laura@example.com",
            createdAt: "2023-02-20",
            lastLogin: "2023-05-08",
            status: "active",
        },
        {
            id: 3,
            name: "Miguel Torres",
            username: "migueltorres",
            plan: "enterprise",
            role: "admin",
            avatar: "/placeholder.svg?height=40&width=40",
            email: "miguel@example.com",
            createdAt: "2023-03-05",
            lastLogin: "2023-05-09",
            status: "active",
        },
        {
            id: 4,
            name: "Ana Gómez",
            username: "anagomez",
            plan: "free",
            role: "user",
            avatar: "/placeholder.svg?height=40&width=40",
            email: "ana@example.com",
            createdAt: "2023-03-10",
            lastLogin: "2023-04-28",
            status: "inactive",
        },
        {
            id: 5,
            name: "Hugo Cayón",
            username: "hugocayon",
            plan: "pro",
            role: "editor",
            avatar: "/placeholder.svg?height=40&width=40",
            email: "hugo@example.com",
            createdAt: "2023-04-01",
            lastLogin: "2023-05-11",
            status: "active",
        },
        {
            id: 6,
            name: "Elena Martínez",
            username: "elenamartinez",
            plan: "basic",
            role: "viewer",
            avatar: "/placeholder.svg?height=40&width=40",
            email: "elena@example.com",
            createdAt: "2023-04-15",
            lastLogin: "2023-05-01",
            status: "suspended",
        },
        {
            id: 7,
            name: "Javier Rodríguez",
            username: "javierrodriguez",
            plan: "pro",
            role: "user",
            avatar: "/placeholder.svg?height=40&width=40",
            email: "javier@example.com",
            createdAt: "2023-04-20",
            lastLogin: "2023-05-07",
            status: "active",
        },
        {
            id: 8,
            name: "Sofía López",
            username: "sofialopez",
            plan: "enterprise",
            role: "admin",
            avatar: "/placeholder.svg?height=40&width=40",
            email: "sofia@example.com",
            createdAt: "2023-05-01",
            lastLogin: "2023-05-10",
            status: "active",
        },
    ])

    // Estado para la paginación
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(5)

    // Estado para los filtros
    const [searchTerm, setSearchTerm] = useState("")
    const [filterPlan, setFilterPlan] = useState<string>("all")
    const [filterRole, setFilterRole] = useState<string>("all")
    const [filterStatus, setFilterStatus] = useState<string>("all")

    // Estado para el diálogo de crear/editar usuario
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [currentUser, setCurrentUser] = useState<User | null>(null)
    const [isEditing, setIsEditing] = useState(false)

    // Estado para el formulario
    const [formData, setFormData] = useState({
        name: "",
        username: "",
        email: "",
        plan: "basic",
        role: "user",
        status: "active",
    })

    // Filtrar usuarios
    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesPlan = filterPlan === "all" ? true : user.plan === filterPlan
        const matchesRole = filterRole === "all" ? true : user.role === filterRole
        const matchesStatus = filterStatus === "all" ? true : user.status === filterStatus

        return matchesSearch && matchesPlan && matchesRole && matchesStatus
    })

    // Calcular paginación
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem)

    // Cambiar de página
    const paginate = (pageNumber: number) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber)
        }
    }

    // Abrir diálogo para crear usuario
    const openCreateDialog = () => {
        setFormData({
            name: "",
            username: "",
            email: "",
            plan: "basic",
            role: "user",
            status: "active",
        })
        setIsEditing(false)
        setCurrentUser(null)
        setIsDialogOpen(true)
    }

    // Abrir diálogo para editar usuario
    const openEditDialog = (user: User) => {
        setFormData({
            name: user.name,
            username: user.username,
            email: user.email,
            plan: user.plan,
            role: user.role,
            status: user.status,
        })
        setIsEditing(true)
        setCurrentUser(user)
        setIsDialogOpen(true)
    }

    // Abrir diálogo para eliminar usuario
    const openDeleteDialog = (user: User) => {
        setCurrentUser(user)
        setIsDeleteDialogOpen(true)
    }

    // Manejar cambios en el formulario
    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    // Manejar cambios en selects
    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    // Guardar usuario (crear o editar)
    const saveUser = () => {
        if (isEditing && currentUser) {
            // Editar usuario existente
            setUsers(
                users.map((user) =>
                    user.id === currentUser.id
                        ? {
                            ...user,
                            name: formData.name,
                            username: formData.username,
                            email: formData.email,
                            plan: formData.plan as any,
                            role: formData.role as any,
                            status: formData.status as any,
                        }
                        : user,
                ),
            )
        } else {
            // Crear nuevo usuario
            const newUser: User = {
                id: Math.max(...users.map((u) => u.id)) + 1,
                name: formData.name,
                username: formData.username,
                email: formData.email,
                plan: formData.plan as any,
                role: formData.role as any,
                avatar: "/placeholder.svg?height=40&width=40",
                createdAt: new Date().toISOString().split("T")[0],
                lastLogin: new Date().toISOString().split("T")[0],
                status: formData.status as any,
            }
            setUsers([...users, newUser])
        }

        setIsDialogOpen(false)
    }

    // Eliminar usuario
    const deleteUser = () => {
        if (currentUser) {
            setUsers(users.filter((user) => user.id !== currentUser.id))
            setIsDeleteDialogOpen(false)
        }
    }

    // Limpiar todos los filtros
    const clearFilters = () => {
        setSearchTerm("")
        setFilterPlan("all")
        setFilterRole("all")
        setFilterStatus("all")
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestión de Usuarios" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>

                {/* Barra de herramientas */}
                <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Buscar usuarios..."
                            className="w-full pl-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-wrap gap-2 items-center">
                        {/* Filtros */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="h-9">
                                    <Filter className="h-4 w-4 mr-2" />
                                    Filtros
                                    {(filterPlan !== "all" || filterRole !== "all" || filterStatus !== "all") && (
                                        <Badge variant="secondary" className="ml-2 px-1 py-0">
                                            {[filterPlan, filterRole, filterStatus].filter(Boolean).length}
                                        </Badge>
                                    )}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-60">
                                <div className="p-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="filter-plan">Plan</Label>
                                        <Select value={filterPlan} onValueChange={(value) => setFilterPlan(value)}>
                                            <SelectTrigger id="filter-plan">
                                                <SelectValue placeholder="Todos los planes" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Todos los planes</SelectItem>
                                                <SelectItem value="free">Free</SelectItem>
                                                <SelectItem value="basic">Basic</SelectItem>
                                                <SelectItem value="pro">Pro</SelectItem>
                                                <SelectItem value="enterprise">Enterprise</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2 mt-3">
                                        <Label htmlFor="filter-role">Rol</Label>
                                        <Select value={filterRole} onValueChange={(value) => setFilterRole(value)}>
                                            <SelectTrigger id="filter-role">
                                                <SelectValue placeholder="Todos los roles" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Todos los roles</SelectItem>
                                                <SelectItem value="user">Usuario</SelectItem>
                                                <SelectItem value="admin">Administrador</SelectItem>
                                                <SelectItem value="editor">Editor</SelectItem>
                                                <SelectItem value="viewer">Visualizador</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2 mt-3">
                                        <Label htmlFor="filter-status">Estado</Label>
                                        <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value)}>
                                            <SelectTrigger id="filter-status">
                                                <SelectValue placeholder="Todos los estados" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Todos los estados</SelectItem>
                                                <SelectItem value="active">Activo</SelectItem>
                                                <SelectItem value="inactive">Inactivo</SelectItem>
                                                <SelectItem value="suspended">Suspendido</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="mt-3 w-full"
                                        onClick={clearFilters}
                                        disabled={filterPlan === "all" && filterRole === "all" && filterStatus === "all" && !searchTerm}
                                    >
                                        <X className="h-4 w-4 mr-2" />
                                        Limpiar filtros
                                    </Button>
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Botón para crear usuario */}
                        <Button onClick={openCreateDialog} className="bg-primary hover:bg-primary/90">
                            <UserPlus className="h-4 w-4 mr-2" />
                            Nuevo Usuario
                        </Button>
                    </div>
                </div>

                {/* Filtros activos */}
                {(filterPlan !== "all" || filterRole !== "all" || filterStatus !== "all") && (
                    <div className="flex flex-wrap gap-2 mt-2">
                        {filterPlan !== "all" && (
                            <Badge variant="secondary" className="flex items-center gap-1">
                                Plan: {filterPlan}
                                <Button variant="ghost" size="icon" className="h-4 w-4 p-0 ml-1" onClick={() => setFilterPlan("all")}>
                                    <X className="h-3 w-3" />
                                </Button>
                            </Badge>
                        )}
                        {filterRole !== "all" && (
                            <Badge variant="secondary" className="flex items-center gap-1">
                                Rol: {filterRole}
                                <Button variant="ghost" size="icon" className="h-4 w-4 p-0 ml-1" onClick={() => setFilterRole("all")}>
                                    <X className="h-3 w-3" />
                                </Button>
                            </Badge>
                        )}
                        {filterStatus !== "all" && (
                            <Badge variant="secondary" className="flex items-center gap-1">
                                Estado: {filterStatus}
                                <Button variant="ghost" size="icon" className="h-4 w-4 p-0 ml-1" onClick={() => setFilterStatus("all")}>
                                    <X className="h-3 w-3" />
                                </Button>
                            </Badge>
                        )}
                    </div>
                )}

                <Tabs defaultValue="table" className="w-full">
                    <TabsList>
                        <TabsTrigger value="table">Tabla</TabsTrigger>
                        <TabsTrigger value="grid">Tarjetas</TabsTrigger>
                    </TabsList>

                    {/* Vista de tabla */}
                    <TabsContent value="table" className="mt-4">
                        <Card>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Usuario</TableHead>
                                            <TableHead>Plan</TableHead>
                                            <TableHead>Rol</TableHead>
                                            <TableHead>Estado</TableHead>
                                            <TableHead>Fecha de registro</TableHead>
                                            <TableHead>Último acceso</TableHead>
                                            <TableHead className="text-right">Acciones</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {currentUsers.length > 0 ? (
                                            currentUsers.map((user) => (
                                                <TableRow key={user.id}>
                                                    <TableCell>
                                                        <div className="flex items-center gap-3">
                                                            <Avatar>
                                                                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                                                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                                            </Avatar>
                                                            <div>
                                                                <div className="font-medium">{user.name}</div>
                                                                <div className="text-sm text-muted-foreground">@{user.username}</div>
                                                                <div className="text-xs text-muted-foreground">{user.email}</div>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge className={`${planColors[user.plan]} text-white`}>{user.plan}</Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className={`${roleColors[user.role]} text-white`}>
                                                            {user.role}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className={`${statusColors[user.status]} text-white`}>
                                                            {user.status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>{user.createdAt}</TableCell>
                                                    <TableCell>{user.lastLogin}</TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <TooltipProvider>
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(user)}>
                                                                            <Edit className="h-4 w-4" />
                                                                        </Button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <p>Editar usuario</p>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>

                                                            <TooltipProvider>
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            className="text-destructive"
                                                                            onClick={() => openDeleteDialog(user)}
                                                                        >
                                                                            <Trash2 className="h-4 w-4" />
                                                                        </Button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <p>Eliminar usuario</p>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                                                    No se encontraron usuarios con los filtros aplicados
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>

                            {/* Paginación */}
                            {filteredUsers.length > 0 && (
                                <CardFooter className="flex items-center justify-between p-4 border-t">
                                    <div className="text-sm text-muted-foreground">
                                        Mostrando {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredUsers.length)} de{" "}
                                        {filteredUsers.length} usuarios
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => paginate(currentPage - 1)}
                                            disabled={currentPage === 1}
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>
                                        <div className="text-sm">
                                            Página {currentPage} de {totalPages}
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => paginate(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Select
                                            value={itemsPerPage.toString()}
                                            onValueChange={(value) => {
                                                setItemsPerPage(Number.parseInt(value))
                                                setCurrentPage(1)
                                            }}
                                        >
                                            <SelectTrigger className="w-[100px]">
                                                <SelectValue placeholder="5 por página" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="5">5 por página</SelectItem>
                                                <SelectItem value="10">10 por página</SelectItem>
                                                <SelectItem value="20">20 por página</SelectItem>
                                                <SelectItem value="50">50 por página</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </CardFooter>
                            )}
                        </Card>
                    </TabsContent>

                    {/* Vista de tarjetas */}
                    <TabsContent value="grid" className="mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {currentUsers.length > 0 ? (
                                currentUsers.map((user) => (
                                    <Card key={user.id} className="overflow-hidden flex flex-col h-full">
                                        <CardHeader className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <Avatar>
                                                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                                                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="font-medium">{user.name}</div>
                                                        <div className="text-sm text-muted-foreground">@{user.username}</div>
                                                    </div>
                                                </div>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreHorizontal className="h-5 w-5" />
                                                            <span className="sr-only">Más opciones</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => openEditDialog(user)}>
                                                            <Edit className="h-4 w-4 mr-2" />
                                                            Editar usuario
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="text-destructive" onClick={() => openDeleteDialog(user)}>
                                                            <Trash2 className="h-4 w-4 mr-2" />
                                                            Eliminar usuario
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-4 pt-0 flex-grow">
                                            <div className="space-y-3">
                                                <div>
                                                    <div className="text-sm text-muted-foreground">Email</div>
                                                    <div>{user.email}</div>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    <div>
                                                        <div className="text-sm text-muted-foreground">Plan</div>
                                                        <Badge className={`${planColors[user.plan]} text-white mt-1`}>{user.plan}</Badge>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm text-muted-foreground">Rol</div>
                                                        <Badge variant="outline" className={`${roleColors[user.role]} text-white mt-1`}>
                                                            {user.role}
                                                        </Badge>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm text-muted-foreground">Estado</div>
                                                        <Badge variant="outline" className={`${statusColors[user.status]} text-white mt-1`}>
                                                            {user.status}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <div className="flex gap-4">
                                                    <div>
                                                        <div className="text-sm text-muted-foreground">Fecha de registro</div>
                                                        <div>{user.createdAt}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm text-muted-foreground">Último acceso</div>
                                                        <div>{user.lastLogin}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                        <CardFooter className="p-4 border-t flex justify-end gap-2">
                                            <Button variant="outline" size="sm" onClick={() => openEditDialog(user)}>
                                                <Edit className="h-4 w-4 mr-2" />
                                                Editar
                                            </Button>
                                            <Button variant="destructive" size="sm" onClick={() => openDeleteDialog(user)}>
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Eliminar
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-10 text-muted-foreground">
                                    No se encontraron usuarios con los filtros aplicados
                                </div>
                            )}
                        </div>

                        {/* Paginación para vista de tarjetas */}
                        {filteredUsers.length > 0 && (
                            <div className="flex items-center justify-between mt-4 p-4 bg-card border rounded-lg">
                                <div className="text-sm text-muted-foreground">
                                    Mostrando {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredUsers.length)} de{" "}
                                    {filteredUsers.length} usuarios
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => paginate(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <div className="text-sm">
                                        Página {currentPage} de {totalPages}
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => paginate(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Select
                                        value={itemsPerPage.toString()}
                                        onValueChange={(value) => {
                                            setItemsPerPage(Number.parseInt(value))
                                            setCurrentPage(1)
                                        }}
                                    >
                                        <SelectTrigger className="w-[100px]">
                                            <SelectValue placeholder="5 por página" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="5">5 por página</SelectItem>
                                            <SelectItem value="10">10 por página</SelectItem>
                                            <SelectItem value="20">20 por página</SelectItem>
                                            <SelectItem value="50">50 por página</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>

                {/* Diálogo para crear/editar usuario */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>{isEditing ? "Editar Usuario" : "Crear Nuevo Usuario"}</DialogTitle>
                            <DialogDescription>
                                {isEditing
                                    ? "Modifica los datos del usuario y guarda los cambios."
                                    : "Completa los datos para crear un nuevo usuario."}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-1 gap-3">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nombre completo</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleFormChange}
                                        placeholder="Nombre completo"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="username">Nombre de usuario</Label>
                                    <Input
                                        id="username"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleFormChange}
                                        placeholder="username"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleFormChange}
                                        placeholder="email@ejemplo.com"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                        <Label htmlFor="plan">Plan</Label>
                                        <Select value={formData.plan} onValueChange={(value) => handleSelectChange("plan", value)}>
                                            <SelectTrigger id="plan">
                                                <SelectValue placeholder="Seleccionar plan" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="free">Free</SelectItem>
                                                <SelectItem value="basic">Basic</SelectItem>
                                                <SelectItem value="pro">Pro</SelectItem>
                                                <SelectItem value="enterprise">Enterprise</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="role">Rol</Label>
                                        <Select value={formData.role} onValueChange={(value) => handleSelectChange("role", value)}>
                                            <SelectTrigger id="role">
                                                <SelectValue placeholder="Seleccionar rol" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="user">Usuario</SelectItem>
                                                <SelectItem value="admin">Administrador</SelectItem>
                                                <SelectItem value="editor">Editor</SelectItem>
                                                <SelectItem value="viewer">Visualizador</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="status">Estado</Label>
                                    <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                                        <SelectTrigger id="status">
                                            <SelectValue placeholder="Seleccionar estado" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="active">Activo</SelectItem>
                                            <SelectItem value="inactive">Inactivo</SelectItem>
                                            <SelectItem value="suspended">Suspendido</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                Cancelar
                            </Button>
                            <Button
                                onClick={saveUser}
                                disabled={!formData.name || !formData.username || !formData.email}
                                className="bg-primary hover:bg-primary/90"
                            >
                                <Save className="h-4 w-4 mr-2" />
                                {isEditing ? "Guardar cambios" : "Crear usuario"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Diálogo para confirmar eliminación */}
                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Confirmar eliminación</DialogTitle>
                            <DialogDescription>
                                ¿Estás seguro de que deseas eliminar al usuario <strong>{currentUser?.name}</strong>? Esta acción no se
                                puede deshacer.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                                Cancelar
                            </Button>
                            <Button variant="destructive" onClick={deleteUser}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Eliminar usuario
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    )
}
