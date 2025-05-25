"use client"

import { router, usePage } from "@inertiajs/react"
import { Check, Star } from "lucide-react"

export default function PlanTabs() {
    const { currentPlan, plans } = usePage().props

    const handleChange = (planId) => {
        router.post("/settings/plan", {
            _method: "patch",
            forceFormData: true,
            preserveScroll: true,
            plan_id: planId,
        })
    }

    return (
        <div className="flex flex-col gap-6 max-w-4xl mx-auto">
            {plans.map((plan, index) => {
                const isActive = currentPlan?.id === plan.id
                const isPopular = index === 2

                return (
                    <div
                        key={plan.id}
                        className={`
              relative flex items-center p-8 rounded-2xl bg-card text-card-foreground
              shadow-lg hover:shadow-xl transition-all duration-300 ease-out
              transform hover:-translate-y-1 group
              ${isActive
                                ? "ring-2 ring-primary scale-105 shadow-2xl bg-gradient-to-br from-card to-accent/20"
                                : "border border-border hover:border-primary/30"
                            }
            `}
                    >
                        {/* Popular badge */}
                        {isPopular && !isActive && (
                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-1 shadow-lg">
                                    <Star className="w-4 h-4 fill-current" />
                                    Más Popular
                                </div>
                            </div>
                        )}

                        {/* Active badge */}
                        {isActive && (
                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-1 shadow-lg">
                                    <Check className="w-4 h-4" />
                                    Plan Actual
                                </div>
                            </div>
                        )}

                        {/* Plan header */}
                        <div className="flex-1 min-w-0">
                            <div className="mb-4">
                                <h3 className="text-xl font-bold mb-1 text-foreground group-hover:text-primary transition-colors">
                                    {plan.name}
                                </h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl font-bold text-primary">{plan.price}</span>
                                    <span className="text-sm font-medium text-muted-foreground">€/mes</span>
                                </div>
                            </div>
                            {plan.description && <p className="text-sm text-muted-foreground leading-relaxed">{plan.description}</p>}
                        </div>

                        <div className="flex-1 px-8">
                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center gap-2 text-sm">
                                    <div className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center">
                                        <Check className="w-2.5 h-2.5 text-primary" />
                                    </div>
                                    <span className="text-foreground">Todas las funciones</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <div className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center">
                                        <Check className="w-2.5 h-2.5 text-primary" />
                                    </div>
                                    <span className="text-foreground">Soporte prioritario</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <div className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center">
                                        <Check className="w-2.5 h-2.5 text-primary" />
                                    </div>
                                    <span className="text-foreground">Actualizaciones automáticas</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex-shrink-0">
                            <button
                                onClick={() => handleChange(plan.id)}
                                disabled={isActive}
                                className={`
                  py-3 px-8 rounded-xl font-semibold text-sm
                  transition-all duration-300 ease-out transform
                  focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2
                  disabled:cursor-not-allowed min-w-[180px]
                  ${isActive
                                        ? "bg-primary/10 border-2 border-primary text-primary cursor-default"
                                        : `bg-primary text-primary-foreground hover:bg-primary/90
                       hover:shadow-lg hover:scale-105 active:scale-95
                       shadow-md`
                                    }
                `}
                            >
                                {isActive ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <Check className="w-4 h-4" />
                                        Seleccionado
                                    </span>
                                ) : (
                                    "Seleccionar Plan"
                                )}
                            </button>
                        </div>

                        {/* Decorative gradient overlay */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                )
            })}
        </div>
    )
}
