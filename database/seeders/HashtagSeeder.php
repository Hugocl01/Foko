<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use App\Models\Hashtag;
use App\Models\Publication;
use App\Models\Preset;

class HashtagSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1) Define las listas de hashtags por tipo
        $photographyTags = [
            'Photography',
            'Landscape',
            'Portrait',
            'Macro',
            'Street Photography',
            'Night Photography',
            'Black and White',
            'HDR',
            'Natural Light',
            'Film'
        ];

        $presetTags = [
            'Vintage',
            'Moody',
            'Bright',
            'Warm',
            'Cool',
            'High Contrast',
            'Matte',
            'Cinematic',
            'Dark',
            'Vibrant'
        ];

        // 2) Crea o actualiza todos los hashtags
        $allNames = array_merge($photographyTags, $presetTags);
        foreach ($allNames as $name) {
            Hashtag::updateOrCreate(
                ['slug' => Str::slug($name)],
                ['name' => $name]
            );
        }

        // 3) Recupera los IDs según cada grupo
        $photoIds = Hashtag::whereIn('slug', array_map(fn($t) => Str::slug($t), $photographyTags))
            ->pluck('id');
        $presetIds = Hashtag::whereIn('slug', array_map(fn($t) => Str::slug($t), $presetTags))
            ->pluck('id');

        // 4) Asigna a cada publicación sólo hashtags de fotografía (1–3 aleatorios)
        Publication::all()->each(function (Publication $pub) use ($photoIds) {
            $pub->hashtags()->sync(
                $photoIds->random(rand(1, 3))->toArray()
            );
        });

        // 5) Asigna a cada preset sólo hashtags de preset (1–2 aleatorios)
        Preset::all()->each(function (Preset $preset) use ($presetIds) {
            $preset->hashtags()->sync(
                $presetIds->random(rand(1, 2))->toArray()
            );
        });
    }
}
