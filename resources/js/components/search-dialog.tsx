'use client'

import * as React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useIsMobile } from '@/hooks/use-mobile'

interface SearchResult {
    id: string
    title: string
    type: 'publication' | 'preset' | 'chat'
    url: string
}

interface SearchDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
    const [searchQuery, setSearchQuery] = React.useState('')
    const [results, setResults] = React.useState<SearchResult[]>([])
    const [isLoading, setIsLoading] = React.useState(false)
    const inputRef = React.useRef<HTMLInputElement>(null)
    const isMobile = useIsMobile()

    // Focus input when dialog opens
    React.useEffect(() => {
        if (open) {
            setTimeout(() => {
                inputRef.current?.focus()
            }, 100)
        }
    }, [open])

    // Mock search function - replace with actual API call
    const handleSearch = React.useCallback(
        async (query: string) => {
            if (!query.trim()) {
                setResults([])
                return
            }

            setIsLoading(true)

            // Simulate API call with timeout
            setTimeout(() => {
                // Mock results - replace with actual API response
                const mockResults: SearchResult[] = [
                    {
                        id: '1',
                        title: 'Landscape Photography',
                        type: 'publication',
                        url: '/publications/1',
                    },
                    {
                        id: '2',
                        title: 'Summer Vibes',
                        type: 'preset',
                        url: '/presets/2',
                    },
                    {
                        id: '3',
                        title: 'Photography Discussion',
                        type: 'chat',
                        url: '/chats/3',
                    },
                ].filter(item =>
                    item.title.toLowerCase().includes(query.toLowerCase())
                )

                setResults(mockResults)
                setIsLoading(false)
            }, 500)
        },
        []
    )

    React.useEffect(() => {
        const handler = setTimeout(() => {
            handleSearch(searchQuery)
        }, 300)

        return () => {
            clearTimeout(handler)
        }
    }, [searchQuery, handleSearch])

    const handleKeyDown = (e: React.KeyboardEvent) => {
        // Close on escape
        if (e.key === 'Escape') {
            onOpenChange(false)
        }
    }

    const getResultIcon = (type: string) => {
        switch (type) {
            case 'publication':
                return <div className="flex h-6 w-6 items-center justify-center rounded bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">P</div>
            case 'preset':
                return <div className="flex h-6 w-6 items-center justify-center rounded bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">Pr</div>
            case 'chat':
                return <div className="flex h-6 w-6 items-center justify-center rounded bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">C</div>
            default:
                return null
        }
    }

    const searchContent = (
        <div className="flex flex-col space-y-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    ref={inputRef}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Buscar publicaciones, presets, chats..."
                    className="pl-10 pr-10"
                />
                {searchQuery && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 rounded-full p-0"
                        onClick={() => setSearchQuery('')}
                    >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Limpiar búsqueda</span>
                    </Button>
                )}
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
                {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent"></div>
                    </div>
                ) : results.length > 0 ? (
                    <div className="space-y-1">
                        {results.map((result) => (
                            <a
                                key={result.id}
                                href={result.url}
                                className="flex items-center space-x-3 rounded-md p-2 hover:bg-accent"
                                onClick={() => onOpenChange(false)}
                            >
                                {getResultIcon(result.type)}
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium">{result.title}</span>
                                    <span className="text-xs text-muted-foreground capitalize">{result.type}</span>
                                </div>
                            </a>
                        ))}
                    </div>
                ) : searchQuery ? (
                    <div className="py-6 text-center text-sm text-muted-foreground">
                        No se encontraron resultados para "{searchQuery}"
                    </div>
                ) : null}
            </div>
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
