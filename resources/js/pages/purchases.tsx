import { useState } from "react"
import { usePage, Head, router } from "@inertiajs/react"
import {
    Search,
    Download,
    Calendar,
    Eye,
    UserRound,
    Filter,
    ChevronLeft,
    ChevronRight,
    X,
    MoreHorizontal,
    ShoppingBag,
    HandCoins,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { BreadcrumbItem } from "@/types"
import AppLayout from "@/layouts/app-layout"
import { userInfo } from "os"

// Breadcrumbs para la navegación
const breadcrumbs: BreadcrumbItem[] = [{ title: "Compras", href: "/compras" }]

export default function PurchasesPage() {
    const { purchases } = usePage().props as {
        purchases: Array<{
            id: number
            created_at: string
            preset: {
                id: number
                name: string
                user: { id: number; username: string }
                price: number
            }
        }>
    }

    const [searchTerm, setSearchTerm] = useState("")
    const [dateFrom, setDateFrom] = useState("")
    const [dateTo, setDateTo] = useState("")
    const [priceFrom, setPriceFrom] = useState("")
    const [priceTo, setPriceTo] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(5)

    // Filtrado
    const filteredPurchases = purchases.filter((p) => {
        const name = p.preset.name.toLowerCase()
        const username = p.preset.user.username.toLowerCase()
        const matchesSearch = name.includes(searchTerm.toLowerCase()) || username.includes(searchTerm.toLowerCase())

        const date = new Date(p.created_at)
        const fromD = dateFrom ? new Date(dateFrom) : null
        const toD = dateTo ? new Date(dateTo) : null
        const matchesDate = (!fromD || date >= fromD) && (!toD || date <= toD)

        const price = p.preset.price
        const fromP = priceFrom ? Number.parseFloat(priceFrom) : null
        const toP = priceTo ? Number.parseFloat(priceTo) : null
        const matchesPrice = (!fromP || price >= fromP) && (!toP || price <= toP)

        return matchesSearch && matchesDate && matchesPrice
    })

    // Paginación
    const totalPages = Math.ceil(filteredPurchases.length / itemsPerPage)
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentPurchases = filteredPurchases.slice(indexOfFirstItem, indexOfLastItem)

    const paginate = (pageNumber: number) => {
        if (pageNumber > 0 && pageNumber <= totalPages) setCurrentPage(pageNumber)
    }

    const formatDate = (d: string) =>
        new Date(d).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })

    const formatPrice = (v: number) =>
        new Intl.NumberFormat("es-ES", {
            style: "currency",
            currency: "EUR",
        }).format(v)

    const totalInvertido = filteredPurchases.reduce((sum, p) => sum + (Number(p.preset.price) || 0), 0)

    // Determina si hay filtros activos
    const hasActiveFilters = Boolean(dateFrom || dateTo || priceFrom || priceTo)

    const clearFilters = () => {
        setSearchTerm("")
        setDateFrom("")
        setDateTo("")
        setPriceFrom("")
        setPriceTo("")
        setCurrentPage(1)
    }

    const handlePreview = (presetId: number) => {
        router.get(route("presets.show", { preset: presetId }));
    };

    const handleProfile = (userId: number) => {
        // TODO
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Compras" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <h1 className="text-2xl font-bold">Gestión de Compras</h1>

                {/* Estadísticas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Total de Presets</p>
                                    <p className="text-2xl font-bold">{filteredPurchases.length}</p>
                                </div>
                                <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Invertido</p>
                                    <p className="text-2xl font-bold">{formatPrice(totalInvertido)}</p>
                                </div>
                                <HandCoins className="h-8 w-8 text-muted-foreground" />
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
                            placeholder="Buscar presets o autores..."
                            className="w-full pl-8"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value)
                                setCurrentPage(1)
                            }}
                        />
                    </div>

                    <div className="flex flex-wrap gap-2 items-center">
                        {/* Filtros */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="h-9 cursor-pointer">
                                    <Filter className="h-4 w-4 mr-2" />
                                    Filtros
                                    {hasActiveFilters && (
                                        <Badge variant="secondary" className="ml-2 px-1 py-0">
                                            {[dateFrom, dateTo, priceFrom, priceTo].filter(Boolean).length}
                                        </Badge>
                                    )}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-60">
                                <div className="p-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="date-from">Fecha desde</Label>
                                        <Input
                                            id="date-from"
                                            type="date"
                                            value={dateFrom}
                                            onChange={(e) => {
                                                setDateFrom(e.target.value)
                                                setCurrentPage(1)
                                            }}
                                        />
                                    </div>

                                    <div className="space-y-2 mt-3">
                                        <Label htmlFor="date-to">Fecha hasta</Label>
                                        <Input
                                            id="date-to"
                                            type="date"
                                            value={dateTo}
                                            onChange={(e) => {
                                                setDateTo(e.target.value)
                                                setCurrentPage(1)
                                            }}
                                        />
                                    </div>

                                    <div className="space-y-2 mt-3">
                                        <Label htmlFor="price-from">Precio desde (€)</Label>
                                        <Input
                                            id="price-from"
                                            type="number"
                                            placeholder="0"
                                            value={priceFrom}
                                            onChange={(e) => {
                                                setPriceFrom(e.target.value)
                                                setCurrentPage(1)
                                            }}
                                        />
                                    </div>

                                    <div className="space-y-2 mt-3">
                                        <Label htmlFor="price-to">Precio hasta (€)</Label>
                                        <Input
                                            id="price-to"
                                            type="number"
                                            placeholder="100"
                                            value={priceTo}
                                            onChange={(e) => {
                                                setPriceTo(e.target.value)
                                                setCurrentPage(1)
                                            }}
                                        />
                                    </div>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="mt-2 w-full cursor-pointer"
                                        onClick={clearFilters}
                                        disabled={!hasActiveFilters && !searchTerm}
                                    >
                                        Limpiar filtros
                                    </Button>
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Filtros activos */}
                {(dateFrom || dateTo || priceFrom || priceTo) && (
                    <div className="flex flex-wrap gap-2 mt-2">
                        {dateFrom && (
                            <Badge variant="secondary" className="flex items-center gap-1">
                                Desde: {formatDate(dateFrom)}
                                <Button variant="ghost" size="icon" className="h-4 w-4 p-0 ml-1 cursor-pointer" onClick={() => setDateFrom("")}>
                                    <X className="h-3 w-3" />
                                </Button>
                            </Badge>
                        )}
                        {dateTo && (
                            <Badge variant="secondary" className="flex items-center gap-1">
                                Hasta: {formatDate(dateTo)}
                                <Button variant="ghost" size="icon" className="h-4 w-4 p-0 ml-1 cursor-pointer" onClick={() => setDateTo("")}>
                                    <X className="h-3 w-3" />
                                </Button>
                            </Badge>
                        )}
                        {priceFrom && (
                            <Badge variant="secondary" className="flex items-center gap-1">
                                Precio desde: {formatPrice(Number.parseFloat(priceFrom))}
                                <Button variant="ghost" size="icon" className="h-4 w-4 p-0 ml-1 cursor-pointer" onClick={() => setPriceFrom("")}>
                                    <X className="h-3 w-3" />
                                </Button>
                            </Badge>
                        )}
                        {priceTo && (
                            <Badge variant="secondary" className="flex items-center gap-1">
                                Precio hasta: {formatPrice(Number.parseFloat(priceTo))}
                                <Button variant="ghost" size="icon" className="h-4 w-4 p-0 ml-1 cursor-pointer" onClick={() => setPriceTo("")}>
                                    <X className="h-3 w-3" />
                                </Button>
                            </Badge>
                        )}
                    </div>
                )}

                <Tabs defaultValue="table" className="w-full">
                    <TabsList>
                        <TabsTrigger value="table" className="cursor-pointer">Tabla</TabsTrigger>
                        <TabsTrigger value="grid" className="cursor-pointer">Tarjetas</TabsTrigger>
                    </TabsList>

                    {/* Vista de tabla */}
                    <TabsContent value="table" className="mt-4">
                        <Card>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="hover:bg-transparent">
                                            <TableHead>Preset</TableHead>
                                            <TableHead>Autor</TableHead>
                                            <TableHead>Fecha de Compra</TableHead>
                                            <TableHead>Precio</TableHead>
                                            <TableHead className="text-right">Acciones</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {currentPurchases.length > 0 ? (
                                            currentPurchases.map((purchase) => (
                                                <TableRow key={purchase.id}>
                                                    <TableCell>
                                                        <div className="font-medium">{purchase.preset.name}</div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="font-medium">@{purchase.preset.user.username}</div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                                            <span className="text-sm">{formatDate(purchase.created_at)}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="default" className="font-semibold">
                                                            {formatPrice(purchase.preset.price)}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <TooltipProvider>
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <Button
                                                                            variant="secondary"
                                                                            size="icon"
                                                                            className="cursor-pointer"
                                                                            onClick={() => handlePreview(purchase.preset.id)}
                                                                        >
                                                                            <Eye className="h-4 w-4" />
                                                                        </Button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <p>Ver preset</p>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>

                                                            <TooltipProvider>
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <Button
                                                                            variant="secondary"
                                                                            size="icon"
                                                                            className="cursor-pointer"
                                                                            onClick={() => handleProfile(purchase.preset.user.id)}
                                                                        >
                                                                            <UserRound className="h-4 w-4" />
                                                                        </Button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <p>Ver perfil de usuario</p>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>

                                                            <TooltipProvider>
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <Button
                                                                            asChild
                                                                            variant="default"
                                                                            size="icon"
                                                                            className="cursor-pointer"
                                                                        >
                                                                            <a
                                                                                href={route("purchases.download", { preset: purchase.preset.id })}
                                                                                data-inertia="false"
                                                                            >
                                                                                <Download className="h-4 w-4" />
                                                                            </a>
                                                                        </Button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <p>Descargar preset</p>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                                                    No se encontraron compras con los filtros aplicados
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>

                            {/* Paginación */}
                            {filteredPurchases.length > 0 && (
                                <CardFooter className="flex items-center justify-between p-4 border-t">
                                    <div className="text-sm text-muted-foreground">
                                        Mostrando {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredPurchases.length)} de{" "}
                                        {filteredPurchases.length} compras
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="cursor-pointer"
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
                                            className="cursor-pointer"
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
                                            <SelectTrigger className="w-[100px] cursor-pointer">
                                                <SelectValue placeholder="5 por página" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="5" className="cursor-pointer">5 por página</SelectItem>
                                                <SelectItem value="10" className="cursor-pointer">10 por página</SelectItem>
                                                <SelectItem value="20" className="cursor-pointer">20 por página</SelectItem>
                                                <SelectItem value="50" className="cursor-pointer">50 por página</SelectItem>
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
                            {currentPurchases.length > 0 ? (
                                currentPurchases.map((purchase) => (
                                    <Card key={purchase.id} className="overflow-hidden flex flex-col h-full">
                                        <CardHeader className="px-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <div className="font-medium text-lg">{purchase.preset.name}</div>
                                                </div>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreHorizontal className="h-5 w-5" />
                                                            <span className="sr-only">Más opciones</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem
                                                            className="cursor-pointer"
                                                            onClick={() => handleProfile(purchase.preset.user.id)}
                                                        >
                                                            <Eye className="h-4 w-4 mr-2" />
                                                            Ver preset
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            className="cursor-pointer"
                                                            onClick={() => handlePreview(purchase.preset.id)}
                                                        >
                                                            <UserRound className="h-4 w-4 mr-2" />
                                                            Ver perfil de usuario
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            asChild
                                                            className="cursor-pointer"
                                                        >
                                                            <a
                                                                href={route("purchases.download", { preset: purchase.preset.id })}
                                                                data-inertia="false"
                                                            >
                                                                <Download className="h-4 w-4 mr-2" />
                                                                Descargar preset
                                                            </a>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-4 pt-0 flex-grow">
                                            <div className="space-y-3">
                                                <div>
                                                    <div className="text-sm text-muted-foreground">Autor</div>
                                                    <div className="font-medium">@{purchase.preset.user.username}</div>
                                                </div>
                                                <div>
                                                    <div className="text-sm text-muted-foreground">Fecha de compra</div>
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                                        <span className="text-sm">{formatDate(purchase.created_at)}</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-sm text-muted-foreground">Precio</div>
                                                    <Badge variant="default">
                                                        {formatPrice(purchase.preset.price)}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </CardContent>
                                        <CardFooter className="p-4 border-t flex justify-end gap-2">
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="cursor-pointer"
                                                            onClick={() => handlePreview(purchase.preset.id)}
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Ver preset</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>

                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="cursor-pointer"
                                                            onClick={() => handlePreview(purchase.preset.id)}
                                                        >
                                                            <UserRound className="h-4 w-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Ver perfil de usuario</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>

                                            <Button asChild variant="default" size="sm" className="cursor-pointer">
                                                <a
                                                    href={route("purchases.download", { preset: purchase.preset.id })}
                                                    data-inertia="false"
                                                >
                                                    <Download className="h-4 w-4" />
                                                    Descargar
                                                </a>
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-10 text-muted-foreground">
                                    No se encontraron compras con los filtros aplicados
                                </div>
                            )}
                        </div>

                        {/* Paginación para vista de tarjetas */}
                        {filteredPurchases.length > 0 && (
                            <div className="flex items-center justify-between mt-4 p-4 bg-card border rounded-lg">
                                <div className="text-sm text-muted-foreground">
                                    Mostrando {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredPurchases.length)} de{" "}
                                    {filteredPurchases.length} compras
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="cursor-pointer"
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
                                        className="cursor-pointer"
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
                                        <SelectTrigger className="w-[100px] cursor-pointer">
                                            <SelectValue placeholder="5 por página" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="5" className="cursor-pointer">5 por página</SelectItem>
                                            <SelectItem value="10" className="cursor-pointer">10 por página</SelectItem>
                                            <SelectItem value="20" className="cursor-pointer">20 por página</SelectItem>
                                            <SelectItem value="50" className="cursor-pointer">50 por página</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    )
}
