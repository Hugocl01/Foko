<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Feature;

class FeatureSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $features = [
            // Plan Básico
            'Subir publicaciones con hasta 3 imágenes' => 'Permite subir hasta 3 imágenes por publicación.',
            'Interacción social básica' => 'Me gusta, comentarios y guardado de publicaciones.',
            'Publicaciones mensuales limitadas' => 'Máximo 10 publicaciones por mensuales.',

            // Plan Premium
            'Subidas y publicaciones ilimitadas' => 'Sin restricciones para publicar.',
            'Venta de presets' => 'Puede poner presets a la venta.',
            'Estadísticas avanzadas' => 'Acceso a métricas de interacciones y compras.',
            'Cuenta verificada' => 'Opción de obtener verificación como profesional.',
            'Soporte prioritario' => 'Atención más rápida a problemas y dudas.',
        ];

        foreach ($features as $name => $description) {
            Feature::create([
                'name' => $name,
                'description' => $description,
            ]);
        }
    }
}
