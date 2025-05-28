import type React from "react"
import { useState, useEffect } from "react"
import {
    Search,
    Filter,
    MoreHorizontal,
    ChevronLeft,
    ChevronRight,
    Trash2,
    Edit,
    UsersRound,
    UserRoundCheck,
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
import AdminLayout from "@/layouts/admin/layout"
import type { BreadcrumbItem } from "@/types"
import { router, usePage, Head } from "@inertiajs/react"
import { toast } from 'sonner'
import { User } from "@/types/User"
import { Plan } from "@/types/Plan"
import { Role } from "@/types/Role"

// Tipos de datos
type UserData = User & { plan: Plan; role: Role }

interface UsersPageProps {
    users: UserData[] | { data: UserData[] }
    plans: Plan[]
    roles: Role[]
}

// Colores para los planes
// Colores para los planes usando plan_id
const planColors: Record<number, string> = {
    1: "bg-orange-500", // Ilimitado
    2: "bg-zinc-500",   // Básico
    3: "bg-teal-500",  // Premium
}

// Colores para los roles
const roleColors: Record<number, string> = {
    1: "bg-purple-500",  // Amdin
    2: "bg-blue-500",   // User
}

// Colores para los estados
const statusColors: { [key: number]: string } = {
    0: "bg-red-500",
    1: "bg-green-500",
}

// Breadcrumbs para la navegación
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Usuarios",
        href: "/users",
    },
]

export default function Users({ users: initialUsers, plans: initialPlans, roles: initialRoles }: UsersPageProps) {
    const { props } = usePage<{ users: UserData[] | { data: UserData[] } }>()
    const [users, setUsers] = useState<UserData[]>(
        Array.isArray(props.users) ? props.users : props.users.data
    )

    const [filterPlan, setFilterPlan] = useState<string>("all")
    const [filterRole, setFilterRole] = useState<string>("all")
    const [filterStatus, setFilterStatus] = useState<string>("all")

    // Paginación y formularios (idénticos a tu código anterior)
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(5)
    const [searchTerm, setSearchTerm] = useState("")

    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [currentUser, setCurrentUser] = useState<UserData | null>(null)
    const [isEditing, setIsEditing] = useState(false)

    const [formData, setFormData] = useState({
        name: "",
        username: "",
        password: null,
        email: "",
        plan_id: 0,
        role_id: 0,
        status: 1,
    })

    // Filtrado de usuarios
    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesPlan = filterPlan === "all" ? true : user.plan.name === filterPlan
        const matchesRole = filterRole === "all" ? true : user.role.name === filterRole
        const matchesStatus = filterStatus === "all" ? true : user.status === parseInt(filterStatus, 10)

        return matchesSearch && matchesPlan && matchesRole && matchesStatus
    })

    // Paginación
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem)

    const paginate = (pageNumber: number) => {
        if (pageNumber > 0 && pageNumber <= totalPages) setCurrentPage(pageNumber)
    }

    // Diálogos
    const openCreateDialog = () => {
        setFormData({
            name: "",
            username: "",
            password: null,
            email: "",
            plan_id: 0,
            role_id: 0,
            status: 1
        })
        setIsEditing(false)
        setCurrentUser(null)
        setIsDialogOpen(true)
    }

    const openEditDialog = (user: UserData) => {
        setFormData({
            name: user.name,
            username: user.username,
            password: null,
            email: user.email,
            plan_id: user.plan.id,
            role_id: user.role.id,
            status: user.status
        })
        setIsEditing(true)
        setCurrentUser(user)
        setIsDialogOpen(true)
    }

    const openDeleteDialog = (user: UserData) => {
        setCurrentUser(user)
        setIsDeleteDialogOpen(true)
    }

    // Formularios
    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [name]: parseInt(value, 10),
        }))
    }

    const saveUser = () => {
        // 1) Payload base
        let payload: Record<string, any> = {
            name: formData.name,
            username: formData.username,
            email: formData.email,
            plan_id: formData.plan_id,
            role_id: formData.role_id,
            status: formData.status,
        };

        // 2) Si es creación, añade la contraseña
        if (!isEditing) {
            if (!formData.password) {
                toast.error('La contraseña es obligatoria al crear un usuario');
                return;
            }
            payload.password = formData.password;
        }

        // 3) Opciones compartidas de Inertia
        const inertiaOptions = {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setIsDialogOpen(false);
            },
            onError: () => {
                // Queda abierto para mostrar errores en `errors`
            },
        };

        // 4) Dispara la petición
        if (isEditing && currentUser) {
            // Para update usamos POST + método PATCH
            router.post(
                route('users.update', currentUser.username),
                {
                    _method: 'patch',
                    ...payload,
                },
                inertiaOptions
            );
        } else {
            // Para creación, POST directo
            router.post(
                route('users.store'),
                payload,
                inertiaOptions
            );
        }
    };

    const deleteUser = () => {
        if (!currentUser) return;

        router.delete(route('users.destroy', currentUser.id), {
            preserveScroll: true,
            onSuccess: () => {
                // Actualizamos la lista local solo tras el borrado exitoso
                setUsers((prev) => prev.filter((u) => u.id !== currentUser.id));
            },
            onFinish: () => {
                // Cerramos el diálogo en cualquier caso
                setIsDeleteDialogOpen(false);
            },
        });
    };

    const clearFilters = () => { setSearchTerm(""); setFilterPlan("all"); setFilterRole("all"); setFilterStatus("all") }

    const { flash, errors } = usePage().props
    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        } else if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    // sincroniza cuando Inertia actualice props.users
    useEffect(() => {
        const list = Array.isArray(props.users) ? props.users : props.users.data
        setUsers(list)
    }, [props.users])

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestión de Usuarios" />

            <AdminLayout>
                <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                    <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>

                    {/* Estadísticas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Total de Usuarios</p>
                                        <p className="text-2xl font-bold">{filteredUsers.length}</p>
                                    </div>
                                    <UsersRound className="h-8 w-8 text-muted-foreground" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Usuarios Activos</p>
                                        <p className="text-2xl font-bold">{filteredUsers.filter(user => user.status === 1).length}</p>
                                    </div>
                                    <UserRoundCheck className="h-8 w-8 text-muted-foreground" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

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
                                            <Select value={filterPlan} onValueChange={setFilterPlan}>
                                                <SelectTrigger id="filter-plan">
                                                    <SelectValue placeholder="Todos los planes" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all" disabled >Todos los planes</SelectItem>
                                                    {initialPlans.map(plan => (
                                                        <SelectItem key={plan.id} value={plan.name}>{plan.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2 mt-3">
                                            <Label htmlFor="filter-role">Rol</Label>
                                            <Select
                                                value={filterRole}
                                                onValueChange={setFilterRole}
                                            >
                                                <SelectTrigger id="filter-role">
                                                    <SelectValue placeholder="Seleccionar rol" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all" disabled>Todos los roles</SelectItem>
                                                    {initialRoles.map((role) => (
                                                        <SelectItem key={role.id} value={role.name}>
                                                            {role.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2 mt-3">
                                            <Label htmlFor="filter-status">Estado</Label>
                                            <Select
                                                value={filterStatus}
                                                onValueChange={(value) => setFilterStatus(value)}
                                            >
                                                <SelectTrigger id="filter-status">
                                                    <SelectValue placeholder="Todos los estados" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">Todos los estados</SelectItem>
                                                    <SelectItem value="1">Activo</SelectItem>
                                                    <SelectItem value="0">Inactivo</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="mt-2 w-full"
                                            onClick={clearFilters}
                                            disabled={filterPlan === "all" && filterRole === "all" && filterStatus === "all" && !searchTerm}
                                        >
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
                                    Estado: {filterStatus == "1" ? "Activo" : "Inactivo"}
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
                                    <Table >
                                        <TableHeader>
                                            <TableRow className="hover:bg-transparent">
                                                <TableHead>Usuario</TableHead>
                                                <TableHead>Plan</TableHead>
                                                <TableHead>Rol</TableHead>
                                                <TableHead>Estado</TableHead>
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
                                                                    {user.profile_image ? (
                                                                        <AvatarImage src={user.profile_image} alt={user.name} />
                                                                    ) : (
                                                                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                                                    )}
                                                                </Avatar>
                                                                <div>
                                                                    <div className="font-medium">{user.name}</div>
                                                                    <div className="text-sm text-muted-foreground">@{user.username}</div>
                                                                    <div className="text-xs text-muted-foreground">{user.email}</div>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge className={`${planColors[user.plan?.id ?? 0]} text-white`}>
                                                                {user.plan?.name ?? "Ilimitado"}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge className={`${roleColors[user.role.id]} text-white`}>
                                                                {user.role.name}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge className={`${statusColors[user.status]} text-white`}>
                                                                {user.status == 1 ? "Activo" : "Inactivo"}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex justify-end gap-2">
                                                                <TooltipProvider>
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <Button variant="secondary"
                                                                                size="icon"
                                                                                onClick={() => openEditDialog(user)}
                                                                            >
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
                                                                                variant="destructive"
                                                                                size="icon"
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
                                            <CardHeader className="px-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar>
                                                            {user.profile_image ? (
                                                                <AvatarImage src={user.profile_image} alt={user.name} />
                                                            ) : (
                                                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                                            )}
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
                                                            <Badge className={`${planColors[user.plan?.id ?? 0]} text-white`}>
                                                                {user.plan?.name ?? "Ilimitado"}
                                                            </Badge>
                                                        </div>
                                                        <div>
                                                            <div className="text-sm text-muted-foreground">Rol</div>
                                                            <Badge className={`${roleColors[user.role.id]} text-white`}>
                                                                {user.role.name}
                                                            </Badge>
                                                        </div>
                                                        <div>
                                                            <div className="text-sm text-muted-foreground">Estado</div>
                                                            <Badge className={`${statusColors[user.status]} text-white`}>
                                                                {user.status == 1 ? "Activo" : "Inactivo"}
                                                            </Badge>
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
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                saveUser();
                            }}
                            className="sm:max-w-[500px]"
                        >
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
                                            {errors.name && (
                                                <p className="text-destructive text-sm mt-1">{errors.name}</p>
                                            )}
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
                                            {errors.username && (
                                                <p className="text-destructive text-sm mt-1">{errors.username}</p>
                                            )}
                                        </div>

                                        {!isEditing ? (
                                            <div className="space-y-2">
                                                <Label htmlFor="name">Contraseña</Label>
                                                <Input
                                                    id="password"
                                                    name="password"
                                                    type="password"
                                                    value={formData.password}
                                                    onChange={handleFormChange}
                                                />
                                                {errors.password && (
                                                    <p className="text-destructive text-sm mt-1">{errors.password}</p>
                                                )}
                                            </div>
                                        ) : ''}

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
                                            {errors.email && (
                                                <p className="text-destructive text-sm mt-1">{errors.email}</p>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div className="space-y-2">
                                                <Label htmlFor="plan">Plan</Label>
                                                <Select
                                                    value={formData.plan_id.toString()}
                                                    onValueChange={val => handleSelectChange('plan_id', val)}
                                                >
                                                    <SelectTrigger id="filter-plan">
                                                        <SelectValue placeholder="Todos los planes" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="0" disabled >Todos los planes</SelectItem>
                                                        {initialPlans.map(plan => (
                                                            <SelectItem key={plan.id} value={plan.id.toString()}>{plan.name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {errors.plan_id && (
                                                    <p className="text-destructive text-sm mt-1">{errors.plan_id}</p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="role">Rol</Label>
                                                <Select
                                                    value={formData.role_id.toString()}
                                                    onValueChange={(val) => handleSelectChange("role_id", val)}
                                                >
                                                    <SelectTrigger id="role">
                                                        <SelectValue placeholder="Seleccionar rol" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="0" disabled >Todos los roles</SelectItem>
                                                        {initialRoles.map((role) => (
                                                            <SelectItem key={role.id} value={role.id.toString()}>
                                                                {role.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {errors.role_id && (
                                                    <p className="text-destructive text-sm mt-1">{errors.role_id}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="status">Estado</Label>
                                            <Select
                                                value={formData.status.toString()}
                                                onValueChange={(value) => handleSelectChange("status", value)}
                                            >
                                                <SelectTrigger id="status">
                                                    <SelectValue placeholder="Seleccionar estado" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="1">Activo</SelectItem>
                                                    <SelectItem value="0">Inactivo</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors.status && (
                                                <p className="text-destructive text-sm mt-1">{errors.status}</p>
                                            )}
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
                        </form>
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
                            <DialogFooter className="flex flex-wrap gap-2">
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
            </AdminLayout>
        </AppLayout >
    )
}
