<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Publication;
use App\Models\Image;

class ImageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $publications = Publication::pluck('id', 'title');

        $images = [
            ['publication_id' => $publications['Atardecer en la playa'], 'url' => 'images/atardecer1.jpg'],
            ['publication_id' => $publications['Atardecer en la playa'], 'url' => 'images/atardecer2.jpg'],
            ['publication_id' => $publications['Luces de ciudad'], 'url' => 'images/ciudad1.jpg'],
        ];

        foreach ($images as $img) {
            Image::create($img);
        }
    }
}
