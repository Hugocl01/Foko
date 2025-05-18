import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';
import { Users, Flag } from 'lucide-react';

const sidebarNavItems: NavItem[] = [
    {
        title: 'Usuarios',
        href: '/admin/users',
        icon: Users,
    },
    {
        title: 'Reportes',
        href: '/admin/reports',
        icon: Flag,
    },

];

export default function AdminLayout({ children }: PropsWithChildren) {
    // Cuando se renderiza en el servidor, solo mostramos el layout en el cliente...
    if (typeof window === 'undefined') {
        return null;
    }

    const currentPath = window.location.pathname;

    return (
        <div className="px-4 py-6">
            <Heading title="Administración" description="Gestiona los usuarios y reportes de la aplicación" />

            <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12">
                <aside className="w-full max-w-xl lg:w-48">
                    <nav className="flex flex-col space-y-1 space-x-0">
                        {sidebarNavItems.map((item, index) => (
                            <Button
                                key={`${item.href}-${index}`}
                                size="sm"
                                variant="ghost"
                                asChild
                                className={cn('w-full justify-start', {
                                    'bg-muted': currentPath === item.href,
                                })}
                            >
                                <Link href={item.href} prefetch>
                                    {<item.icon />}
                                    {item.title}
                                </Link>
                            </Button>
                        ))}
                    </nav>
                </aside>

                <Separator className="my-6 md:hidden" />

                <div className="flex-1 w-full">
                    <section className="w-full space-y-12">{children}</section>
                </div>
            </div>
        </div>
    );
}
