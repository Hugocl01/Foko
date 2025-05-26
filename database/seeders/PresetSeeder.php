<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Preset;
use App\Models\User;
use Illuminate\Support\Arr;

class PresetSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Recogemos todos los IDs de usuario
        $userIds = User::pluck('id')->toArray();

        $presets = [
            [
                'name' => 'B&N Alto Contraste',
                'description' => 'Preset monocromático con alto contraste.',
                'price' => 0.00,
                'file' => 'B&N_Alto_Contraste.xmp',
            ],
            [
                'name' => 'Cine Suave',
                'description' => 'Preset con tonos suaves tipo cinematográfico.',
                'price' => 2.99,
                'file' => 'Cine_Suave.xmp',
            ],
            [
                'name' => 'HDR Natural',
                'description' => 'Simulación de HDR manteniendo un estilo natural.',
                'price' => 3.99,
                'file' => 'HDR_Natural.xmp',
            ],
            [
                'name' => 'Tonos Tierra',
                'description' => 'Preset cálido con énfasis en marrones y verdes.',
                'price' => 1.99,
                'file' => 'Tonos_Tierra.xmp',
            ],
            [
                'name' => 'Vintage Gold',
                'description' => 'Estética retro con luces doradas.',
                'price' => 4.99,
                'file' => 'Vintage_Gold.xmp',
            ],
        ];

        foreach ($presets as $presetData) {
            Preset::create([
                'name' => $presetData['name'],
                'description' => $presetData['description'],
                'price' => $presetData['price'],
                // Asigna un user_id aleatorio
                'user_id' => rand(1, 2), // Arr::random($userIds),
                'before_image' => null,
                'after_image' => null,
                'file' => $presetData['file'],
            ]);
        }
    }
}
