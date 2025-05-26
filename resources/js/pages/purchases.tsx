"use client"

import { useState } from "react"
import { Search, Download, Eye, Calendar, Filter, ChevronLeft, ChevronRight, X, MoreHorizontal } from "lucide-react"
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
import { Head } from "@inertiajs/react"

// Datos de ejemplo para los presets de fotografía
const allPresets = [
    { id: "PRESET-001", name: "Golden Hour Portrait", date: "2024-01-15", price: 29.99 },
    { id: "PRESET-002", name: "Moody Landscape", date: "2024-01-10", price: 34.99 },
    { id: "PRESET-003", name: "Vintage Film Look", date: "2024-01-05", price: 24.99 },
    { id: "PRESET-004", name: "Clean Wedding Style", date: "2023-12-28", price: 39.99 },
    { id: "PRESET-005", name: "Urban Street Photography", date: "2023-12-20", price: 27.99 },
    { id: "PRESET-006", name: "Soft Newborn", date: "2023-12-15", price: 32.99 },
    { id: "PRESET-007", name: "Dramatic Black & White", date: "2023-12-10", price: 31.99 },
    { id: "PRESET-008", name: "Bright Summer Vibes", date: "2023-12-05", price: 28.99 },
    { id: "PRESET-009", name: "Cinematic Tones", date: "2023-11-30", price: 35.99 },
    { id: "PRESET-010", name: "Natural Light", date: "2023-11-25", price: 26.99 },
    { id: "PRESET-011", name: "Film Grain Effect", date: "2023-11-20", price: 33.99 },
    { id: "PRESET-012", name: "Sunset Glow", date: "2023-11-15", price: 30.99 },
]

// Breadcrumbs para la navegación
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Compras",
        href: "/compras",
    },
]

export default function PurchasesPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(5)

    // Estados de filtros
    const [dateFrom, setDateFrom] = useState("")
    const [dateTo, setDateTo] = useState("")
    const [priceFrom, setPriceFrom] = useState("")
    const [priceTo, setPriceTo] = useState("")

    const filteredPresets = allPresets.filter((preset) => {
        const matchesSearch = preset.name.toLowerCase().includes(searchTerm.toLowerCase())

        // Filtro por fecha
        const presetDate = new Date(preset.date)
        const fromDate = dateFrom ? new Date(dateFrom) : null
        const toDate = dateTo ? new Date(dateTo) : null
        const matchesDate = (!fromDate || presetDate >= fromDate) && (!toDate || presetDate <= toDate)

        // Filtro por precio
        const fromPrice = priceFrom ? Number.parseFloat(priceFrom) : null
        const toPrice = priceTo ? Number.parseFloat(priceTo) : null
        const matchesPrice = (!fromPrice || preset.price >= fromPrice) && (!toPrice || preset.price <= toPrice)

        return matchesSearch && matchesDate && matchesPrice
    })

    // Paginación
    const totalPages = Math.ceil(filteredPresets.length / itemsPerPage)
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentPresets = filteredPresets.slice(indexOfFirstItem, indexOfLastItem)

    const paginate = (pageNumber: number) => {
        if (pageNumber > 0 && pageNumber <= totalPages) setCurrentPage(pageNumber)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("es-ES", {
            style: "currency",
            currency: "EUR",
        }).format(price)
    }

    const handleDownload = (presetName: string) => {
        console.log(`Descargando preset: ${presetName}`)
    }

    const handlePreview = (presetName: string) => {
        console.log(`Viendo preset: ${presetName}`)
    }

    const clearFilters = () => {
        setDateFrom("")
        setDateTo("")
        setPriceFrom("")
        setPriceTo("")
        setSearchTerm("")
    }

    const hasActiveFilters = dateFrom || dateTo || priceFrom || priceTo

    const totalInvested = filteredPresets.reduce((sum, preset) => sum + preset.price, 0)

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Listado de compras" />
            <div className="min-h-screen bg-background text-foreground">
                <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                    {/* Header con información del resumen */}
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold">Compras</h1>
                            <p className="text-muted-foreground">Visuliza y descarga todos tus presets comprados</p>
                        </div>
                        <div className="flex gap-8 text-sm">
                            <div className="text-center">
                                <div className="text-xl font-semibold text-foreground">{filteredPresets.length}</div>
                                <div className="text-muted-foreground">Presets</div>
                            </div>
                            <div className="text-center">
                                <div className="text-xl font-semibold text-foreground">{formatPrice(totalInvested)}</div>
                                <div className="text-muted-foreground">Total invertido</div>
                            </div>
                        </div>
                    </div>

                    {/* Barra de herramientas */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Buscar presets..."
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
                                            <Label htmlFor="date-from">Fecha de compra</Label>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <Label htmlFor="date-from" className="text-xs text-muted-foreground">
                                                        Desde
                                                    </Label>
                                                    <Input
                                                        id="date-from"
                                                        type="date"
                                                        value={dateFrom}
                                                        onChange={(e) => setDateFrom(e.target.value)}
                                                        className="text-xs"
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="date-to" className="text-xs text-muted-foreground">
                                                        Hasta
                                                    </Label>
                                                    <Input
                                                        id="date-to"
                                                        type="date"
                                                        value={dateTo}
                                                        onChange={(e) => setDateTo(e.target.value)}
                                                        className="text-xs"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2 mt-3">
                                            <Label htmlFor="price-from">Precio</Label>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <Label htmlFor="price-from" className="text-xs text-muted-foreground">
                                                        Desde (€)
                                                    </Label>
                                                    <Input
                                                        id="price-from"
                                                        type="number"
                                                        placeholder="0.00"
                                                        value={priceFrom}
                                                        onChange={(e) => setPriceFrom(e.target.value)}
                                                        className="text-xs"
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="price-to" className="text-xs text-muted-foreground">
                                                        Hasta (€)
                                                    </Label>
                                                    <Input
                                                        id="price-to"
                                                        type="number"
                                                        placeholder="100.00"
                                                        value={priceTo}
                                                        onChange={(e) => setPriceTo(e.target.value)}
                                                        className="text-xs"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="mt-3 w-full"
                                            onClick={clearFilters}
                                            disabled={!hasActiveFilters && !searchTerm}
                                        >
                                            <X className="h-4 w-4 mr-2" />
                                            Limpiar filtros
                                        </Button>
                                    </div>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    {/* Filtros activos */}
                    {hasActiveFilters && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {dateFrom && (
                                <Badge variant="secondary" className="flex items-center gap-1">
                                    Desde: {formatDate(dateFrom)}
                                    <Button variant="ghost" size="icon" className="h-4 w-4 p-0 ml-1" onClick={() => setDateFrom("")}>
                                        <X className="h-3 w-3" />
                                    </Button>
                                </Badge>
                            )}
                            {dateTo && (
                                <Badge variant="secondary" className="flex items-center gap-1">
                                    Hasta: {formatDate(dateTo)}
                                    <Button variant="ghost" size="icon" className="h-4 w-4 p-0 ml-1" onClick={() => setDateTo("")}>
                                        <X className="h-3 w-3" />
                                    </Button>
                                </Badge>
                            )}
                            {priceFrom && (
                                <Badge variant="secondary" className="flex items-center gap-1">
                                    Precio desde: {formatPrice(Number.parseFloat(priceFrom))}
                                    <Button variant="ghost" size="icon" className="h-4 w-4 p-0 ml-1" onClick={() => setPriceFrom("")}>
                                        <X className="h-3 w-3" />
                                    </Button>
                                </Badge>
                            )}
                            {priceTo && (
                                <Badge variant="secondary" className="flex items-center gap-1">
                                    Precio hasta: {formatPrice(Number.parseFloat(priceTo))}
                                    <Button variant="ghost" size="icon" className="h-4 w-4 p-0 ml-1" onClick={() => setPriceTo("")}>
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
                                            <TableRow className="hover:bg-transparent">
                                                <TableHead>Preset</TableHead>
                                                <TableHead>Fecha de compra</TableHead>
                                                <TableHead>Precio</TableHead>
                                                <TableHead className="text-right">Acciones</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {currentPresets.length > 0 ? (
                                                currentPresets.map((preset) => (
                                                    <TableRow key={preset.id}>
                                                        <TableCell>
                                                            <div>
                                                                <div className="font-medium">{preset.name}</div>
                                                                <div className="text-sm text-muted-foreground">De: {preset.user_id}</div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                                <Calendar className="h-4 w-4" />
                                                                {formatDate(preset.date)}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="font-semibold">{formatPrice(preset.price)}</div>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex justify-end gap-2">
                                                                <TooltipProvider>
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <Button variant="secondary" size="icon" onClick={() => handlePreview(preset.name)}>
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
                                                                            <Button variant="default" size="icon" onClick={() => handleDownload(preset.name)}>
                                                                                <Download className="h-4 w-4" />
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
                                                    <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                                                        No se encontraron presets con los filtros aplicados
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </CardContent>

                                {/* Paginación */}
                                {filteredPresets.length > 0 && (
                                    <CardFooter className="flex items-center justify-between p-4 border-t">
                                        <div className="text-sm text-muted-foreground">
                                            Mostrando {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredPresets.length)} de{" "}
                                            {filteredPresets.length} presets
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
                                {currentPresets.length > 0 ? (
                                    currentPresets.map((preset) => (
                                        <Card key={preset.id} className="overflow-hidden flex flex-col h-full">
                                            <CardHeader className="p-4">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <div className="font-medium">{preset.name}</div>
                                                        <div className="text-sm text-muted-foreground">ID: {preset.id}</div>
                                                    </div>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon">
                                                                <MoreHorizontal className="h-5 w-5" />
                                                                <span className="sr-only">Más opciones</span>
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => handlePreview(preset.name)}>
                                                                <Eye className="h-4 w-4 mr-2" />
                                                                Ver preset
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem onClick={() => handleDownload(preset.name)}>
                                                                <Download className="h-4 w-4 mr-2" />
                                                                Descargar preset
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="p-4 pt-0 flex-grow">
                                                <div className="space-y-3">
                                                    <div>
                                                        <div className="text-sm text-muted-foreground">Fecha de compra</div>
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                                            {formatDate(preset.date)}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm text-muted-foreground">Precio</div>
                                                        <div className="text-xl font-bold">{formatPrice(preset.price)}</div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                            <CardFooter className="p-4 border-t flex justify-end gap-2">
                                                <Button variant="outline" size="sm" onClick={() => handlePreview(preset.name)}>
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    Ver
                                                </Button>
                                                <Button size="sm" onClick={() => handleDownload(preset.name)}>
                                                    <Download className="h-4 w-4 mr-2" />
                                                    Descargar
                                                </Button>
                                            </CardFooter>
                                        </Card>
                                    ))
                                ) : (
                                    <div className="col-span-full text-center py-10 text-muted-foreground">
                                        No se encontraron presets con los filtros aplicados
                                    </div>
                                )}
                            </div>

                            {/* Paginación para vista de tarjetas */}
                            {filteredPresets.length > 0 && (
                                <div className="flex items-center justify-between mt-4 p-4 bg-card border rounded-lg">
                                    <div className="text-sm text-muted-foreground">
                                        Mostrando {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredPresets.length)} de{" "}
                                        {filteredPresets.length} presets
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
                </div>
            </div>
        </AppLayout>
    )
}
