<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Publication;
use App\Models\Tag;

class PublicationTagSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Publication::insert([
            [
                'user_id' => 1,
                'title' => 'Atardecer en la playa',
                'description' => 'Captura cálida con tonos dorados.',
                'preset_id' => 1,
            ],
            [
                'user_id' => 2,
                'title' => 'Luces de ciudad',
                'description' => 'Fotografía nocturna urbana.',
                'preset_id' => 2,
            ],
        ]);
    }
}
