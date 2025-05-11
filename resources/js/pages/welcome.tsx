import { Head, Link } from "@inertiajs/react"
import { Camera, ImageIcon, Share2, ArrowRight, Check } from "lucide-react"

const testimonials = [
    {
        name: "Sara Ortega",
        role: "Editora visual freelance",
        avatar: "/placeholder.svg",
        quote:
            "Foko me permite mantener mi estilo en todas mis publicaciones. La facilidad para aplicar presets ha cambiado mi flujo de trabajo.",
    },
    {
        name: "Daniel Álvarez",
        role: "Estudiante de fotografía",
        avatar: "/placeholder.svg",
        quote:
            "Descubrí Foko por recomendación y me ha sorprendido. Ideal para portafolios y compartir resultados sin complicaciones.",
    },
    {
        name: "Lucía Torres",
        role: "Creadora de contenido visual",
        avatar: "/placeholder.svg",
        quote:
            "La interfaz es tan intuitiva que no necesitas experiencia previa. Me encanta la comunidad que se está formando.",
    },
]

// Planes de precios
const pricingPlans = [
    {
        name: "Básico",
        price: "Gratis",
        description: "Perfecto para comenzar tu viaje creativo",
        features: [
            "Acceso a 5 presets básicos",
            "Edición de hasta 20 fotos por mes",
            "Portafolio básico",
            "Compartir en redes sociales",
            "Soporte por email",
        ],
        buttonText: "Comenzar gratis",
        buttonVariant: "outline",
        popular: false,
    },
    {
        name: "Premium",
        price: "9,99€",
        period: "/mes",
        description: "Para creadores que buscan llevar su estilo al siguiente nivel",
        features: [
            "Acceso a todos los presets (50+)",
            "Edición ilimitada de fotos",
            "Portafolio profesional personalizable",
            "Creación de presets propios",
            "Compartir y vender tus presets",
            "Soporte prioritario 24/7",
        ],
        buttonText: "Obtener Premium",
        buttonVariant: "default",
        popular: true,
    },
]

const route = (name: string) => {
    // Replace this with your actual route generation logic.
    const routes: Record<string, string> = {
        login: "/login",
        register: "/register",
        presets: "/presets",
        gallery: "/gallery",
        pricing: "/pricing",
        premium: "/premium",
    }
    return routes[name] || "#" // Default fallback route
}

export default function Welcome() {
    return (
        <>
            <Head title="Foko — Plataforma de edición fotográfica">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
                <style>{`
    html {
      scroll-behavior: smooth;
    }
  `}</style>
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-background text-foreground">
                <header className="w-full border-b border-border/40">
                    <div className="container mx-auto flex h-16 items-center justify-between px-4">
                        <Link
                            href={"/"}
                            draggable={false}
                        >
                            <span className="text-xl font-semibold">Foko</span>
                        </Link>
                        <nav className="flex items-center gap-4">
                            <Link
                                href={route("login")}
                                className="px-5 py-1.5 text-sm hover:underline select-none"
                                draggable={false}>
                                Iniciar sesión
                            </Link>
                            <Link
                                href={route("register")}
                                className="rounded-md border border-border px-5 py-1.5 text-sm hover:border-ring select-none"
                                draggable={false}
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
                                Foko es la plataforma de presets y edición pensada para fotógrafos y creadores visuales. Crea,
                                personaliza y comparte tu estilo con el mundo.
                            </p>
                            <div className="flex flex-col gap-4 sm:flex-row">
                                <Link
                                    href={route("presets")}
                                    className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 h-11 select-none"
                                    draggable={false}
                                >
                                    Ver presets <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                                <Link
                                    href={route("gallery")}
                                    className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground h-11 select-none"
                                    draggable={false}
                                >
                                    Galería de creadores
                                </Link>
                            </div>
                        </div>
                        <div className="relative hidden md:block h-[500px]">
                            <img
                                src="images/image1.jpg"
                                alt="Ejemplo 1"
                                className="absolute left-0 top-24 h-64 w-48 rounded-lg object-cover shadow-lg"
                            />
                            <img
                                src="images/image2.jpg"
                                alt="Ejemplo 2"
                                className="absolute left-[25%] top-1/2 h-72 w-56 -translate-y-1/2 rounded-lg object-cover shadow-lg"
                            />
                            <img
                                src="images/image3.jpg"
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
                                    {
                                        icon: ImageIcon,
                                        title: "Presets personalizados",
                                        text: "Crea, aplica y guarda tus propios estilos de edición.",
                                    },
                                    {
                                        icon: Camera,
                                        title: "Portafolio fotográfico",
                                        text: "Organiza y presenta tus mejores capturas de forma profesional.",
                                    },
                                    {
                                        icon: Share2,
                                        title: "Comunidad creativa",
                                        text: "Comparte y descubre nuevos estilos entre fotógrafos.",
                                    },
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

                    {/* Pricing Section */}
                    <section id="pricing" className="w-full py-16 md:py-24">
                        <div className="container mx-auto px-4">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-bold md:text-4xl mb-4">Planes que se adaptan a ti</h2>
                                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                    Elige el plan que mejor se adapte a tus necesidades creativas y lleva tu fotografía al siguiente
                                    nivel.
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                                {pricingPlans.map((plan, index) => (
                                    <div
                                        key={index}
                                        className={`rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md flex flex-col justify-between ${plan.popular ? "border-primary relative" : ""
                                            }`}
                                    >
                                        {plan.popular && (
                                            <div className="absolute -top-3 right-6 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                                                Recomendado
                                            </div>
                                        )}

                                        <div className="flex flex-col h-full">
                                            <div>
                                                <div className="mb-5">
                                                    <h3 className="text-xl font-bold">{plan.name}</h3>
                                                    <div className="mt-2 flex items-baseline">
                                                        <span className="text-3xl font-bold">{plan.price}</span>
                                                        {plan.period && <span className="text-muted-foreground ml-1">{plan.period}</span>}
                                                    </div>
                                                    <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
                                                </div>

                                                <ul className="mb-6 space-y-3">
                                                    {plan.features.map((feature, i) => (
                                                        <li key={i} className="flex items-start">
                                                            <Check className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                                                            <span className="text-sm">{feature}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <div className="mt-auto pt-4">
                                                <Link
                                                    href={route("register")}
                                                    className={`inline-flex items-center justify-center w-full rounded-md select-none ${plan.buttonVariant === "default"
                                                        ? "bg-primary text-primary-foreground shadow hover:bg-primary/90"
                                                        : "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                                                        } px-4 py-2 text-sm font-medium h-11`}
                                                    draggable={false}
                                                >
                                                    {plan.buttonText}
                                                </Link>
                                            </div>
                                        </div>
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
                                            <img
                                                src={t.avatar || "/placeholder.svg"}
                                                alt={t.name}
                                                className="h-12 w-12 rounded-full object-cover"
                                            />
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
                                Súmate a la comunidad Foko y empieza a crear, editar y compartir con estilo. ¡Prueba gratis y actualiza
                                cuando estés listo!
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    href={route("register")}
                                    className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-4 text-lg font-medium text-primary-foreground shadow hover:bg-primary/90 select-none"
                                    draggable={false}
                                >
                                    Regístrate gratis
                                </Link>
                                <Link
                                    href="#pricing"
                                    className="inline-flex items-center justify-center rounded-md border border-input bg-secondary-foreground/10 px-6 py-4 text-lg font-medium shadow-sm hover:bg-accent hover:text-accent-foreground select-none"
                                    draggable={false}
                                    onClick={(e) => {
                                        e.preventDefault()
                                        document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })
                                    }}
                                >
                                    Ver planes Premium
                                </Link>
                            </div>
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
    )
}
