<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Preset;

class PresetSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
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

        foreach ($presets as $preset) {
            Preset::create([
                'name' => $preset['name'],
                'description' => $preset['description'],
                'price' => $preset['price'],
                'user_id' => 1,
                'before_image' => null,
                'after_image' => null,
                'file' => $preset['file'],
            ]);
        }
    }
}
