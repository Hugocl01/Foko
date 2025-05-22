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
            ['name' => 'Subir publicaciones con 1 imágen', 'description' => 'Límite de 1 imágen por publicación.'],
            ['name' => 'Interacción social básica', 'description' => 'Likes, comentarios y seguir usuarios.'],
            ['name' => 'Subir publicaciones con hasta 3 imágenes', 'description' => 'Límite de 3 imágenes por publicación.'],
            ['name' => 'Publicaciones semanales limitadas', 'description' => 'Restricción de publicaciones por semana.'],
            ['name' => 'Subidas y publicaciones ilimitadas', 'description' => 'Sin límite en cantidad de publicaciones.'],
            ['name' => 'Venta de presets', 'description' => 'Permite crear y vender presets personalizados.'],
            ['name' => 'Cuenta verificada', 'description' => 'Verificación oficial del perfil.'],
            ['name' => 'Soporte prioritario', 'description' => 'Atención preferente al cliente.'],
        ];

        foreach ($features as $featureData) {
            Feature::updateOrCreate(['name' => $featureData['name']], $featureData);
        }
    }
}
