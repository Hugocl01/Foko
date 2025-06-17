import { Breadcrumbs } from '@/components/breadcrumbs';
import { Icon } from '@/components/icon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { UserMenuContent } from '@/components/user-menu-content';
import { useInitials } from '@/hooks/use-initials';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem, type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { HomeIcon as House, Camera, Aperture, Menu, Search, MessageSquare, Bell, BellDot, MessageSquareDot } from 'lucide-react';
import AppLogo from './app-logo';
import AppLogoIcon from './app-logo-icon';
import { SearchDialog } from './search-dialog';
import { useState } from 'react';

const mainNavItems: NavItem[] = [
    { title: 'Inicio', href: '/', icon: House },
    { title: 'Publicaciones', href: '/publications', icon: Camera },
    { title: 'Presets', href: '/presets', icon: Aperture },
];

const rightNavItems: NavItem[] = [
    { title: 'Chats', href: '/chats', icon: MessageSquare },
    { title: 'Notificaciones', href: '/notifications', icon: Bell },
];

const activeItemStyles = 'text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100';

interface AppHeaderProps {
    breadcrumbs?: BreadcrumbItem[];
}

export function AppHeader({ breadcrumbs = [] }: AppHeaderProps) {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const getInitials = useInitials();
    const [searchOpen, setSearchOpen] = useState(false);
    const isLogged = Boolean(auth.user);

    return (
        <>
            <div className="border-sidebar-border/80 border-b">
                <div className="mx-auto flex h-16 items-center justify-between px-4 md:max-w-7xl">
                    {/* Mobile Menu */}
                    {isLogged && (
                        <div className="lg:hidden">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" className="mr-2 h-[34px] w-[34px]">
                                        <Menu className="h-5 w-5" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="bg-sidebar flex h-full w-64 flex-col items-stretch justify-between">
                                    <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                                    <SheetHeader className="flex justify-start text-left">
                                        <AppLogoIcon className="h-6 w-6 fill-current text-black dark:text-white" />
                                    </SheetHeader>
                                    <div className="flex h-full flex-1 flex-col space-y-4 p-4 text-sm">
                                        <div className="flex flex-col space-y-4">
                                            {mainNavItems.map((item) => (
                                                <Link
                                                    key={item.title}
                                                    href={item.href}
                                                    className="flex items-center space-x-2 font-medium"
                                                >
                                                    {item.icon && <Icon iconNode={item.icon} className="h-5 w-5" />}
                                                    <span>{item.title}</span>
                                                </Link>
                                            ))}
                                        </div>
                                        <div className="flex flex-col space-y-4">
                                            {rightNavItems.map((item) => {
                                                const isNotif = item.title === 'Notificaciones';
                                                const IconNode = isNotif && auth.notifications.length > 0
                                                    ? BellDot
                                                    : item.icon;
                                                return (
                                                    <Link
                                                        key={item.title}
                                                        href={item.href}
                                                        className="flex items-center space-x-2 font-medium"
                                                    >
                                                        {IconNode && <Icon iconNode={IconNode} className="h-5 w-5" />}
                                                        <span>{item.title}</span>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    )}

                    {/* Logo */}
                    <Link href={'/'} className="flex items-center space-x-2" draggable={false}>
                        <AppLogo />
                    </Link>

                    {/* Desktop Navigation */}
                    {isLogged && (
                        <div className="ml-6 hidden h-full items-center space-x-6 lg:flex">
                            <NavigationMenu className="flex h-full items-stretch">
                                <NavigationMenuList className="flex h-full items-stretch space-x-2">
                                    {mainNavItems.map((item, index) => (
                                        <NavigationMenuItem key={index} className="relative flex h-full items-center">
                                            <Link
                                                href={item.href}
                                                className={cn(
                                                    navigationMenuTriggerStyle(),
                                                    page.url === item.href && activeItemStyles,
                                                    'h-9 cursor-pointer px-3'
                                                )}
                                            >
                                                {item.icon && <Icon iconNode={item.icon} className="mr-2 h-4 w-4" />}
                                                {item.title}
                                            </Link>
                                            {page.url === item.href && (
                                                <div className="absolute bottom-0 left-0 h-0.5 w-full translate-y-px bg-black dark:bg-white"></div>
                                            )}
                                        </NavigationMenuItem>
                                    ))}
                                </NavigationMenuList>
                            </NavigationMenu>
                        </div>
                    )}

                    <div className="ml-auto flex items-center space-x-2">
                        {isLogged ? (
                            <>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="group h-9 w-9 cursor-pointer"
                                    onClick={() => setSearchOpen(true)}
                                    aria-label="Buscar"
                                >
                                    <Search className="!size-5 opacity-80 group-hover:opacity-100" />
                                </Button>
                                <div className="hidden lg:flex items-center space-x-2">
                                    {rightNavItems.map((item) => {
                                        const isNotif = item.title === 'Notificaciones';
                                        const IconNode = isNotif && auth.notifications.length > 0
                                            ? BellDot
                                            : item.icon;
                                        return (
                                            <TooltipProvider key={item.title} delayDuration={0}>
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <a
                                                            href={item.href}
                                                            className="group text-accent-foreground ring-offset-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring ml-1 inline-flex h-9 w-9 items-center justify-center rounded-md bg-transparent p-0 text-sm font-medium transition-colors"
                                                        >
                                                            <span className="sr-only">{item.title}</span>
                                                            {IconNode && <Icon iconNode={IconNode} className="size-5 opacity-80 group-hover:opacity-100" />}
                                                        </a>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>{item.title}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        );
                                    })}
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="size-10 rounded-full p-1 cursor-pointer">
                                            <Avatar className="size-8 overflow-hidden rounded-full">
                                                {auth.user.profile_image_url ? (
                                                    <AvatarImage
                                                        src={auth.user.profile_image_url}
                                                        alt={auth.user.name}
                                                    />
                                                ) : (
                                                    <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                                        {getInitials(auth.user.name)}
                                                    </AvatarFallback>
                                                )}
                                            </Avatar>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56" align="end">
                                        <UserMenuContent user={auth.user} />
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </>
                        ) : (
                            <nav className="flex items-center gap-4">
                                <Link
                                    href={route('login')}
                                    className="px-5 py-1.5 text-sm hover:underline select-none"
                                    draggable={false}
                                >
                                    Iniciar sesión
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="rounded-md border border-border px-5 py-1.5 text-sm hover:border-ring select-none"
                                    draggable={false}
                                >
                                    Registrarse
                                </Link>
                            </nav>
                        )}
                    </div>
                </div>
            </div>
            {breadcrumbs.length > 1 && (
                <div className="border-sidebar-border/70 flex w-full border-b">
                    <div className="mx-auto flex h-12 w-full items-center justify-start px-4 text-neutral-500 md:max-w-7xl">
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                </div>
            )}

            <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
        </>
    );
}
