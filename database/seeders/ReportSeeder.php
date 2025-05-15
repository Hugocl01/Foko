<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ReportSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('reports')->insert([
            [
                'reporter_id' => 1,
                'target_type' => 'user',
                'target_id' => 2,
                'reason' => 'Comportamiento inapropiado en comentarios.',
                'status' => 'pending',
            ],
            [
                'reporter_id' => 2,
                'target_type' => 'publication',
                'target_id' => 1,
                'reason' => 'Contenido no original.',
                'status' => 'reviewed',
            ],
        ]);
    }
}
