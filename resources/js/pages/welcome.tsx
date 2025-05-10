import { Head, Link } from '@inertiajs/react';
import { Camera, ImageIcon, Share2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const testimonials = [
    {
        name: 'Sara Ortega',
        role: 'Editora visual freelance',
        avatar: '/placeholder.svg',
        quote:
            'Foko me permite mantener mi estilo en todas mis publicaciones. La facilidad para aplicar presets ha cambiado mi flujo de trabajo.',
    },
    {
        name: 'Daniel Álvarez',
        role: 'Estudiante de fotografía',
        avatar: '/placeholder.svg',
        quote:
            'Descubrí Foko por recomendación y me ha sorprendido. Ideal para portafolios y compartir resultados sin complicaciones.',
    },
    {
        name: 'Lucía Torres',
        role: 'Creadora de contenido visual',
        avatar: '/placeholder.svg',
        quote:
            'La interfaz es tan intuitiva que no necesitas experiencia previa. Me encanta la comunidad que se está formando.',
    },
];

export default function Welcome() {
    return (
        <>
            <Head title="Foko — Plataforma de edición fotográfica">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-background text-foreground">
                <header className="w-full border-b border-border/40">
                    <div className="container mx-auto flex h-16 items-center justify-between px-4">
                        <span className="text-xl font-semibold">Foko</span>
                        <nav className="flex items-center gap-4">
                            <Link href={route('login')} className="px-5 py-1.5 text-sm hover:underline">
                                Iniciar sesión
                            </Link>
                            <Link
                                href={route('register')}
                                className="rounded-md border border-border px-5 py-1.5 text-sm hover:border-ring"
                            >
                                Registrarse
                            </Link>
                        </nav>
                    </div>
                </header>

                <main className="flex w-full flex-1 flex-col">
                    {/* Hero */}
                    <section className="container mx-auto grid gap-8 px-4 py-16 md:grid-cols-2 md:py-24 lg:py-32">
                        <div className="flex flex-col justify-center space-y-6">
                            <h1 className="text-4xl font-semibold leading-tight md:text-5xl lg:text-6xl">
                                Tu creatividad, tu estilo, tu Foko
                            </h1>
                            <p className="text-lg text-muted-foreground md:text-xl">
                                Foko es la plataforma de presets y edición pensada para fotógrafos y creadores visuales. Crea, personaliza y comparte tu estilo con el mundo.
                            </p>
                            <div className="flex flex-col gap-4 sm:flex-row">
                                <Button size="lg" className="text-lg">
                                    Ver presets <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                                <Button size="lg" variant="outline" className="text-lg">
                                    Galería de creadores
                                </Button>
                            </div>
                        </div>
                        <div className="relative hidden md:block h-[500px]">
                            <img
                                src="/placeholder.svg"
                                alt="Ejemplo 1"
                                className="absolute left-0 top-24 h-64 w-48 rounded-lg object-cover shadow-lg"
                            />
                            <img
                                src="/placeholder.svg"
                                alt="Ejemplo 2"
                                className="absolute left-[25%] top-1/2 h-72 w-56 -translate-y-1/2 rounded-lg object-cover shadow-lg"
                            />
                            <img
                                src="/placeholder.svg"
                                alt="Ejemplo 3"
                                className="absolute right-0 top-1/3 h-80 w-64 rounded-lg object-cover shadow-lg"
                            />
                        </div>
                    </section>

                    {/* Features */}
                    <section className="w-full bg-muted/30 py-16 md:py-24">
                        <div className="container mx-auto px-4">
                            <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">¿Por qué usar Foko?</h2>
                            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                                {[
                                    { icon: ImageIcon, title: 'Presets personalizados', text: 'Crea, aplica y guarda tus propios estilos de edición.' },
                                    { icon: Camera, title: 'Portafolio fotográfico', text: 'Organiza y presenta tus mejores capturas de forma profesional.' },
                                    { icon: Share2, title: 'Comunidad creativa', text: 'Comparte y descubre nuevos estilos entre fotógrafos.' },
                                ].map(({ icon: Icon, title, text }) => (
                                    <div
                                        key={title}
                                        className="flex flex-col items-center rounded-lg bg-card p-6 text-center shadow-sm hover:shadow-md"
                                    >
                                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                                            <Icon className="h-6 w-6" />
                                        </div>
                                        <h3 className="mb-2 text-xl font-semibold">{title}</h3>
                                        <p className="text-muted-foreground">{text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Testimonials */}
                    <section className="w-full bg-muted/20 py-16 md:py-24">
                        <div className="container mx-auto px-4">
                            <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">Historias de nuestra comunidad</h2>
                            <div className="grid gap-6 md:grid-cols-3">
                                {testimonials.map((t, i) => (
                                    <div key={i} className="rounded-lg bg-card p-6 shadow-sm">
                                        <div className="mb-4 flex items-center gap-4">
                                            <img src={t.avatar} alt={t.name} className="h-12 w-12 rounded-full object-cover" />
                                            <div>
                                                <h3 className="font-semibold">{t.name}</h3>
                                                <p className="text-sm text-muted-foreground">{t.role}</p>
                                            </div>
                                        </div>
                                        <p className="italic text-muted-foreground">{t.quote}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* CTA */}
                    <section className="w-full bg-secondary py-16 text-center text-secondary-foreground md:py-24">
                        <div className="container mx-auto px-4">
                            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Empieza tu viaje visual con Foko</h2>
                            <p className="mx-auto mb-8 max-w-2xl text-lg">
                                Súmate a la comunidad Foko y empieza a crear, editar y compartir con estilo. ¡Es gratis y fácil de usar!
                            </p>
                            <Button size="lg" className="text-lg px-6 py-4">
                                Regístrate gratis
                            </Button>
                        </div>
                    </section>
                </main>

                <footer className="w-full border-t border-border/40 py-8">
                    <div className="container mx-auto px-4 text-sm text-muted-foreground text-center">
                        © {new Date().getFullYear()} Foko. Proyecto desarrollado por Hugo Cayón Laso.
                    </div>
                </footer>
            </div>
        </>
    );
}
