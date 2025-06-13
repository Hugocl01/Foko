<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Plan;

class PlanController extends Controller
{
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
