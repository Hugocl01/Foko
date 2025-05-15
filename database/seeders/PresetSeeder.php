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
                'name' => 'Golden Mood',
                'description' => 'Ideal para fotos al atardecer con tonos cálidos.',
                'price' => 4.99,
                'user_id' => 1,
                'before_image_id' => null,
                'after_image_id' => null,
            ],
            [
                'name' => 'Street Vibes',
                'description' => 'Preset urbano para resaltar sombras y contrastes.',
                'price' => 3.99,
                'user_id' => 2,
                'before_image_id' => null,
                'after_image_id' => null,
            ],
        ];

        foreach ($presets as $preset) {
            Preset::create($preset);
        }
    }
}
