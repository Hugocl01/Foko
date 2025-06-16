import * as React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useIsMobile } from '@/hooks/use-mobile'
import { router } from '@inertiajs/react'

interface SearchDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
    const [searchQuery, setSearchQuery] = React.useState('')
    const inputRef = React.useRef<HTMLInputElement>(null)
    const isMobile = useIsMobile()

    // Focus input when dialog/sheet opens
    React.useEffect(() => {
        if (open) setTimeout(() => inputRef.current?.focus(), 100)
    }, [open])

    // Close on Escape
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') onOpenChange(false)
    }

    // Clear the current search
    const clearSearch = () => {
        setSearchQuery('')
        inputRef.current?.focus()
    }

    // Perform search navigation using correct route param 'query'
    const performSearch = (type: 'publications' | 'presets') => {
        const q = searchQuery.trim()
        if (!q) return
        onOpenChange(false)
        // Use 'query' key to satisfy Ziggy
        const url = route(`${type}.search`, { query: q })
        router.get(url)
    }

    // Buttons for choosing search type
    const options = (
        <div className="mt-4 flex flex-col space-y-2">
            <Button onClick={() => performSearch('publications')} disabled={!searchQuery.trim()}>
                🔍 Buscar en Publicaciones
            </Button>
            <Button onClick={() => performSearch('presets')} disabled={!searchQuery.trim()}>
                🔍 Buscar en Presets
            </Button>
        </div>
    )

    const searchContent = (
        <div className="flex flex-col space-y-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    ref={inputRef}
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Escribe al menos 2 caracteres…"
                    className="pl-10 pr-10"
                    autoFocus
                />
                {searchQuery && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 rounded-full p-0"
                        onClick={clearSearch}
                    >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Limpiar búsqueda</span>
                    </Button>
                )}
            </div>

            {searchQuery.length >= 2 ? (
                options
            ) : searchQuery.length > 0 ? (
                <p className="text-sm text-muted-foreground">Necesitas al menos 2 caracteres.</p>
            ) : null}
        </div>
    )

    if (isMobile) {
        return (
            <Sheet open={open} onOpenChange={onOpenChange}>
                <SheetContent side="top" className="h-[80vh] sm:max-w-md">
                    <SheetHeader className="mb-4">
                        <SheetTitle>Buscar</SheetTitle>
                    </SheetHeader>
                    {searchContent}
                </SheetContent>
            </Sheet>
        )
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader className="mb-4">
                    <DialogTitle>Buscar</DialogTitle>
                </DialogHeader>
                {searchContent}
            </DialogContent>
        </Dialog>
    )
}
