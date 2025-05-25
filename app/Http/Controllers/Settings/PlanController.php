<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Plan;

class PlanController extends Controller
{
    public function edit(Request $request)
    {
        $currentPlan = $request->user()->plan;

        // Solo traemosque no son el Ilimitado
        $plans = Plan::where('id', '!=', 1)->get();

        return Inertia::render('settings/plan', [
            'currentPlan' => $currentPlan,
            'plans' => Plan::all(),
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
