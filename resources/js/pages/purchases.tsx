"use client"

import { useState } from "react"
import { usePage, Head } from "@inertiajs/react"
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

// Breadcrumbs para la navegación
const breadcrumbs: BreadcrumbItem[] = [
    { title: "Compras", href: "/compras" }
]

export default function PurchasesPage() {
    const { purchases } = usePage().props as {
        purchases: Array<{
            id: number
            created_at: string
            preset: {
                id: number
                name: string
                user: { id: number; name: string }
                price: number
            }
        }>
    }

    console.log(purchases)
    const [searchTerm, setSearchTerm] = useState("")
    const [dateFrom, setDateFrom] = useState("")
    const [dateTo, setDateTo] = useState("")
    const [priceFrom, setPriceFrom] = useState("")
    const [priceTo, setPriceTo] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(5)

    // Filtrado
    const filtered = purchases.filter((p) => {
        const name = p.preset.name.toLowerCase()
        const matchesSearch = name.includes(searchTerm.toLowerCase())
        const date = new Date(p.created_at)
        const fromD = dateFrom ? new Date(dateFrom) : null
        const toD = dateTo ? new Date(dateTo) : null
        const matchesDate = (!fromD || date >= fromD) && (!toD || date <= toD)
        const price = p.preset.price
        const fromP = priceFrom ? parseFloat(priceFrom) : null
        const toP = priceTo ? parseFloat(priceTo) : null
        const matchesPrice = (!fromP || price >= fromP) && (!toP || price <= toP)
        return matchesSearch && matchesDate && matchesPrice
    })

    // Paginación
    const totalPages = Math.ceil(filtered.length / itemsPerPage)
    const start = (currentPage - 1) * itemsPerPage
    const end = start + itemsPerPage
    const pageItems = filtered.slice(start, end)

    const formatDate = (d: string) => new Date(d).toLocaleDateString("es-ES", { year: "numeric", month: "short", day: "numeric" })
    const formatPrice = (v: number) => new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(v)

    const totalInvertido = filtered.reduce(
        (sum, p) => sum + (Number(p.preset.price) || 0),
        0
    )

    // Determina si hay filtros activos
    const hasFilters = Boolean(
        searchTerm || dateFrom || dateTo || priceFrom || priceTo
    )

    const clearFilters = () => {
        setSearchTerm("")
        setDateFrom("")
        setDateTo("")
        setPriceFrom("")
        setPriceTo("")
        setCurrentPage(1)
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Compras" />
            <div className="p-4 space-y-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Compras</h1>
                    <div className="space-x-6 flex text-sm">
                        <div>
                            <div className="text-xl font-semibold">{filtered.length}</div>
                            <div className="text-muted-foreground">Presets</div>
                        </div>
                        <div>
                            < div className="text-xl font-semibold">
                                {new Intl.NumberFormat("es-ES", {
                                    style: "currency",
                                    currency: "EUR",
                                }).format(totalInvertido)}
                            </div>
                            <div className="text-muted-foreground">Total invertido</div>
                        </div>
                    </div>
                </div>

                {/* Filtros y búsqueda */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-2 top-2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar presets..."
                            className="pl-8"
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1) }}
                        />
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-9 flex items-center">
                                <Filter className="mr-2 h-4 w-4" /> Filtros
                                {(dateFrom || dateTo || priceFrom || priceTo) && <Badge className="ml-2 px-1">{[dateFrom, dateTo, priceFrom, priceTo].filter(Boolean).length}</Badge>}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-60 p-3 space-y-2">
                            <Label htmlFor="date-from" className="text-xs text-muted-foreground">Desde</Label>
                            <Input id="date-from" type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setCurrentPage(1) }} />
                            <Label htmlFor="date-to" className="text-xs text-muted-foreground">Hasta</Label>
                            <Input id="date-to" type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setCurrentPage(1) }} />
                            <Label htmlFor="price-from" className="text-xs text-muted-foreground">Precio desde</Label>
                            <Input id="price-from" type="number" placeholder="0" value={priceFrom} onChange={(e) => { setPriceFrom(e.target.value); setCurrentPage(1) }} />
                            <Label htmlFor="price-to" className="text-xs text-muted-foreground">Precio hasta</Label>
                            <Input id="price-to" type="number" placeholder="100" value={priceTo} onChange={(e) => { setPriceTo(e.target.value); setCurrentPage(1) }} />
                            <Button variant="outline" size="sm" className="mt-2 w-full" onClick={clearFilters} disabled={!hasFilters} >Limpiar filtros</Button>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Tabla de compras */}
                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Preset</TableHead>
                                    <TableHead>Autor</TableHead>
                                    <TableHead>Fecha</TableHead>
                                    <TableHead>Precio</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pageItems.length ? pageItems.map(p => (
                                    <TableRow key={p.id}>
                                        <TableCell>
                                            <div className="font-medium">{p.preset.name}</div>
                                        </TableCell>
                                        <TableCell>{p.preset.user.name}</TableCell>
                                        <TableCell className="flex items-center gap-1 text-sm">
                                            <Calendar className="h-4 w-4" /> {formatDate(p.created_at)}
                                        </TableCell>
                                        <TableCell className="font-semibold">{formatPrice(p.preset.price)}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex gap-2 justify-end">
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button variant="secondary" size="icon" onClick={() => handlePreview(p.preset.id)}>
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>Ver preset</TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button variant="default" size="icon" onClick={() => handleDownload(p.preset.id)}>
                                                                <Download className="h-4 w-4" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>Descargar preset</TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                                            No se encontraron compras.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                    <CardFooter className="flex items-center justify-between">
                        <Button variant="outline" size="icon" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-sm">Página {currentPage} de {totalPages}</span>
                        <Button variant="outline" size="icon" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Select value={itemsPerPage.toString()} onValueChange={(v) => { setItemsPerPage(parseInt(v)); setCurrentPage(1) }}>
                            <SelectTrigger className="w-24">
                                <SelectValue placeholder="{itemsPerPage} por página" />
                            </SelectTrigger>
                            <SelectContent>
                                {[5, 10, 20, 50].map(n => <SelectItem key={n} value={n.toString()}>{n} por página</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </CardFooter>
                </Card>
            </div>
        </AppLayout>
    )
}
