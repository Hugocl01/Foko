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
                'price' => 1.62,
                'file' => 'B&N_Alto_Contraste.xmp',
            ],
            [
                'name' => 'Cine Suave',
                'description' => 'Preset con tonos suaves tipo cinematográfico.',
                'price' => 2.73,
                'file' => 'Cine_Suave.xmp',
            ],
            [
                'name' => 'HDR Natural',
                'description' => 'Simulación de HDR manteniendo un estilo natural.',
                'price' => 0.10,
                'file' => 'HDR_Natural.xmp',
            ],
            [
                'name' => 'Tonos Tierra',
                'description' => 'Preset cálido con énfasis en marrones y verdes.',
                'price' => 1.62,
                'file' => 'Tonos_Tierra.xmp',
            ],
            [
                'name' => 'Vintage Gold',
                'description' => 'Estética retro con luces doradas.',
                'price' => 1.69,
                'file' => 'Vintage_Gold.xmp',
            ],
            [
                'name' => 'Sunrise Warmth',
                'description' => 'Preset Sunrise Warmth generado automáticamente.',
                'price' => 1.87,
                'file' => 'Sunrise_Warmth.xmp',
            ],
            [
                'name' => 'Golden Hour Glow',
                'description' => 'Preset Golden Hour Glow generado automáticamente.',
                'price' => 3.08,
                'file' => 'Golden_Hour_Glow.xmp',
            ],
            [
                'name' => 'Moody Contrast',
                'description' => 'Preset Moody Contrast generado automáticamente.',
                'price' => 1.07,
                'file' => 'Moody_Contrast.xmp',
            ],
            [
                'name' => 'Urban Cool',
                'description' => 'Preset Urban Cool generado automáticamente.',
                'price' => 1.94,
                'file' => 'Urban_Cool.xmp',
            ],
            [
                'name' => 'Matte Finish',
                'description' => 'Preset Matte Finish generado automáticamente.',
                'price' => 3.99,
                'file' => 'Matte_Finish.xmp',
            ],
            [
                'name' => 'Vintage Film',
                'description' => 'Preset Vintage Film generado automáticamente.',
                'price' => 3.79,
                'file' => 'Vintage_Film.xmp',
            ],
            [
                'name' => 'High Key Bright',
                'description' => 'Preset High Key Bright generado automáticamente.',
                'price' => 2.98,
                'file' => 'High_Key_Bright.xmp',
            ],
            [
                'name' => 'Low Key Drama',
                'description' => 'Preset Low Key Drama generado automáticamente.',
                'price' => 3.83,
                'file' => 'Low_Key_Drama.xmp',
            ],
            [
                'name' => 'Pastel Dream',
                'description' => 'Preset Pastel Dream generado automáticamente.',
                'price' => 2.61,
                'file' => 'Pastel_Dream.xmp',
            ],
            [
                'name' => 'Cinematic Teal',
                'description' => 'Preset Cinematic Teal generado automáticamente.',
                'price' => 1.29,
                'file' => 'Cinematic_Teal.xmp',
            ],
            [
                'name' => 'Cinematic Orange',
                'description' => 'Preset Cinematic Orange generado automáticamente.',
                'price' => 0.21,
                'file' => 'Cinematic_Orange.xmp',
            ],
            [
                'name' => 'HDR Pop',
                'description' => 'Preset HDR Pop generado automáticamente.',
                'price' => 2.79,
                'file' => 'HDR_Pop.xmp',
            ],
            [
                'name' => 'Subtle Fade',
                'description' => 'Preset Subtle Fade generado automáticamente.',
                'price' => 3.05,
                'file' => 'Subtle_Fade.xmp',
            ],
            [
                'name' => 'Retro Vibe',
                'description' => 'Preset Retro Vibe generado automáticamente.',
                'price' => 2.47,
                'file' => 'Retro_Vibe.xmp',
            ],
            [
                'name' => 'Lush Greens',
                'description' => 'Preset Lush Greens generado automáticamente.',
                'price' => 4.02,
                'file' => 'Lush_Greens.xmp',
            ],
            [
                'name' => 'Desert Haze',
                'description' => 'Preset Desert Haze generado automáticamente.',
                'price' => 3.43,
                'file' => 'Desert_Haze.xmp',
            ],
            [
                'name' => 'Rainy Day Mood',
                'description' => 'Preset Rainy Day Mood generado automáticamente.',
                'price' => 0.94,
                'file' => 'Rainy_Day_Mood.xmp',
            ],
            [
                'name' => 'Foggy Morning',
                'description' => 'Preset Foggy Morning generado automáticamente.',
                'price' => 1.58,
                'file' => 'Foggy_Morning.xmp',
            ],
            [
                'name' => 'Sunset Fiesta',
                'description' => 'Preset Sunset Fiesta generado automáticamente.',
                'price' => 4.12,
                'file' => 'Sunset_Fiesta.xmp',
            ],
            [
                'name' => 'Sunrise Bliss',
                'description' => 'Preset Sunrise Bliss generado automáticamente.',
                'price' => 1.26,
                'file' => 'Sunrise_Bliss.xmp',
            ],
            [
                'name' => 'Twilight Blues',
                'description' => 'Preset Twilight Blues generado automáticamente.',
                'price' => 2.93,
                'file' => 'Twilight_Blues.xmp',
            ],
            [
                'name' => 'Dusk Shadows',
                'description' => 'Preset Dusk Shadows generado automáticamente.',
                'price' => 3.79,
                'file' => 'Dusk_Shadows.xmp',
            ],
            [
                'name' => 'Dawn Softness',
                'description' => 'Preset Dawn Softness generado automáticamente.',
                'price' => 1.45,
                'file' => 'Dawn_Softness.xmp',
            ],
            [
                'name' => 'Earth Tone Rich',
                'description' => 'Preset Earth Tone Rich generado automáticamente.',
                'price' => 4.23,
                'file' => 'Earth_Tone_Rich.xmp',
            ],
            [
                'name' => 'Tropical Punch',
                'description' => 'Preset Tropical Punch generado automáticamente.',
                'price' => 2.38,
                'file' => 'Tropical_Punch.xmp',
            ],
            [
                'name' => 'Winter Chill',
                'description' => 'Preset Winter Chill generado automáticamente.',
                'price' => 3.11,
                'file' => 'Winter_Chill.xmp',
            ],
            [
                'name' => 'Summer Pop',
                'description' => 'Preset Summer Pop generado automáticamente.',
                'price' => 0.57,
                'file' => 'Summer_Pop.xmp',
            ],
            [
                'name' => 'Autumn Leaves',
                'description' => 'Preset Autumn Leaves generado automáticamente.',
                'price' => 4.48,
                'file' => 'Autumn_Leaves.xmp',
            ],
            [
                'name' => 'Spring Bloom',
                'description' => 'Preset Spring Bloom generado automáticamente.',
                'price' => 0.33,
                'file' => 'Spring_Bloom.xmp',
            ],
            [
                'name' => 'Night Noir',
                'description' => 'Preset Night Noir generado automáticamente.',
                'price' => 3.21,
                'file' => 'Night_Noir.xmp',
            ],
            [
                'name' => 'Street Grit',
                'description' => 'Preset Street Grit generado automáticamente.',
                'price' => 0.76,
                'file' => 'Street_Grit.xmp',
            ],
            [
                'name' => 'Portrait Soft',
                'description' => 'Preset Portrait Soft generado automáticamente.',
                'price' => 2.85,
                'file' => 'Portrait_Soft.xmp',
            ],
            [
                'name' => 'Landscape Sharp',
                'description' => 'Preset Landscape Sharp generado automáticamente.',
                'price' => 1.14,
                'file' => 'Landscape_Sharp.xmp',
            ],
            [
                'name' => 'Beach Breeze',
                'description' => 'Preset Beach Breeze generado automáticamente.',
                'price' => 0.89,
                'file' => 'Beach_Breeze.xmp',
            ],
            [
                'name' => 'Film Grain',
                'description' => 'Preset Film Grain generado automáticamente.',
                'price' => 3.60,
                'file' => 'Film_Grain.xmp',
            ],
            [
                'name' => 'Cross Process',
                'description' => 'Preset Cross Process generado automáticamente.',
                'price' => 2.14,
                'file' => 'Cross_Process.xmp',
            ],
            [
                'name' => 'Infrared Warm',
                'description' => 'Preset Infrared Warm generado automáticamente.',
                'price' => 1.98,
                'file' => 'Infrared_Warm.xmp',
            ],
            [
                'name' => 'Bokeh Lights',
                'description' => 'Preset Bokeh Lights generado automáticamente.',
                'price' => 4.45,
                'file' => 'Bokeh_Lights.xmp',
            ],
            [
                'name' => 'Monochrome Classic',
                'description' => 'Preset Monochrome Classic generado automáticamente.',
                'price' => 2.03,
                'file' => 'Monochrome_Classic.xmp',
            ],
            [
                'name' => 'Cyberpunk Neon',
                'description' => 'Preset Cyberpunk Neon generado automáticamente.',
                'price' => 3.65,
                'file' => 'Cyberpunk_Neon.xmp',
            ],
            [
                'name' => 'Pastel Haze',
                'description' => 'Preset Pastel Haze generado automáticamente.',
                'price' => 1.77,
                'file' => 'Pastel_Haze.xmp',
            ],
            [
                'name' => 'Orange Teal',
                'description' => 'Preset Orange Teal generado automáticamente.',
                'price' => 0.44,
                'file' => 'Orange_Teal.xmp',
            ],
            [
                'name' => 'Cinematic Wide',
                'description' => 'Preset Cinematic Wide generado automáticamente.',
                'price' => 2.96,
                'file' => 'Cinematic_Wide.xmp',
            ],
            [
                'name' => 'Soft Pastels',
                'description' => 'Preset Soft Pastels generado automáticamente.',
                'price' => 1.25,
                'file' => 'Soft_Pastels.xmp',
            ],
            [
                'name' => 'Crisp Clarity',
                'description' => 'Preset Crisp Clarity generado automáticamente.',
                'price' => 2.57,
                'file' => 'Crisp_Clarity.xmp',
            ],
        ];

        foreach ($presets as $presetData) {
            Preset::create([
                'name' => $presetData['name'],
                'description' => $presetData['description'],
                'price' => $presetData['price'],
                'user_id' => Arr::random($userIds),
                'before_image' => null,
                'after_image' => null,
                'file' => $presetData['file'],
            ]);
        }
    }
}
