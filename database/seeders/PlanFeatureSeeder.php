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
        $planFeatures = [
            'Básico' => [
                'Subir publicaciones con 1 imágen',
                'Interacción social básica',
                'Publicaciones semanales limitadas',
            ],
            'Premium' => [
                'Subir publicaciones con hasta 3 imágenes',
                'Subidas y publicaciones ilimitadas',
                'Venta de presets',
                'Soporte prioritario',
            ],
        ];

        foreach ($planFeatures as $planName => $featureNames) {
            $plan = Plan::where('name', $planName)->first();

            if (!$plan) {
                $this->command->warn("❌ Plan no encontrado: {$planName}");
                continue;
            }

            $this->command->info("✅ Plan encontrado: {$planName}");

            $featureIds = [];
            foreach ($featureNames as $featureName) {
                $feature = Feature::where('name', $featureName)->first();
                if ($feature) {
                    $featureIds[] = $feature->id;
                } else {
                    $this->command->warn("   ⚠️ Feature no encontrada: {$featureName}");
                }
            }

            if (count($featureIds)) {
                $plan->features()->syncWithoutDetaching($featureIds);
                $this->command->info("   ➕ Features asociadas: " . implode(', ', $featureIds));
            } else {
                $this->command->warn("   ⚠️ No se asociaron features al plan: {$planName}");
            }
        }
    }
}
