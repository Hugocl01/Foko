<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Like;

class LikeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Like::insert([
            ['user_id' => 1, 'publication_id' => 2],
            ['user_id' => 2, 'publication_id' => 1],
        ]);
    }
}
