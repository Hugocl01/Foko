<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Preset;
use App\Models\Tag;

class PresetTagSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $presetIds = Preset::pluck('id', 'name');
        $tagIds = Tag::pluck('id', 'name');

        $relations = [
            [$presetIds['Golden Mood'], $tagIds['Paisaje']],
            [$presetIds['Street Vibes'], $tagIds['Callejera']],
        ];

        foreach ($relations as [$presetId, $tagId]) {
            DB::table('presets_tags')->insert([
                'preset_id' => $presetId,
                'tag_id' => $tagId,
            ]);
        }
    }
}
