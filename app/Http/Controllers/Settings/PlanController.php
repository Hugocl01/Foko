<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Plan;

class PlanController extends Controller
{
    /**
     * Mostrar la página de bienvenida con todos los planes y sus features.
     */
    public function index()
    {
        $rawPlans = Plan::with('features')->get();

        // Añade aquí buttonText y buttonVariant según lógica de negocio
        $plans = $rawPlans->map(fn($plan) => [
            'id' => $plan->id,
            'name' => $plan->name,
            'price' => $plan->price === 0 ? 'Gratis' : "{$plan->price} €",
            'period' => $plan->price === 0 ? null : '/mes',
            'description' => $plan->description,
            'features' => $plan->features->map(fn($f) => ['id' => $f->id, 'name' => $f->name]),
            'popular' => $plan->popular ?? false,
            'buttonText' => $plan->price === 0 ? 'Comenzar gratis' : 'Obtener Premium',
            'buttonVariant' => $plan->price === 0 ? 'outline' : 'default',
        ]);

        return Inertia::render('welcome', [
            'plans' => $plans,
        ]);
    }

    /**
     * Mostrar formulario de selección de plan junto con sus features.
     */
    public function edit(Request $request)
    {
        // 1) Cargar el plan actual del usuario con sus features
        $currentPlan = $request->user()
            ->plan()
            ->with('features')
            ->first();

        // 2) Cargar todos los planes con sus features
        $plans = Plan::with('features')
            ->get();

        // 3) Renderizar la vista pasando currentPlan y la lista de planes con features
        return Inertia::render('settings/plan', [
            'currentPlan' => $currentPlan,
            'plans' => $plans,
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'plan_id' => 'required|exists:plans,id',
        ]);

        $user = $request->user();
        $user->plan_id = $request->plan_id;
        $user->save();

        return back()->with('success', 'Plan actualizado correctamente.');
    }
}
