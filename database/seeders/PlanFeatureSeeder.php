<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Plan;
use App\Models\Feature;
use App\Models\PlanFeature;


class PlanFeatureSeeder extends Seeder
{
    public function run(): void
    {
        // Obtener IDs de planes
        $basicPlanId = Plan::where('name', 'Básico')->value('id');
        $proPlanId = Plan::where('name', 'Premium')->value('id');

        // Obtener features por nombre
        $features = Feature::pluck('id', 'name');

        // Relaciones
        $planFeatures = [
            // Foko Básico
            [$basicPlanId, $features['Subir publicaciones con hasta 3 imágenes']],
            [$basicPlanId, $features['Interacción social básica']],
            [$basicPlanId, $features['Publicaciones mensuales limitadas']],

            // Foko Premium
            [$proPlanId, $features['Subidas y publicaciones ilimitadas']],
            [$proPlanId, $features['Venta de presets']],
            [$proPlanId, $features['Estadísticas avanzadas']],
            [$proPlanId, $features['Cuenta verificada']],
            [$proPlanId, $features['Soporte prioritario']],
        ];

        foreach ($planFeatures as [$planId, $featureId]) {
            PlanFeature::create([
                'plan_id' => $planId,
                'feature_id' => $featureId,
            ]);
        }

        $this->command->info('✅ Se insertaron los planes con sus caracteristicas');
    }
}
