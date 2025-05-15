<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Purchase;

class PurchaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Purchase::insert([
            ['user_id' => 1, 'preset_id' => 2],
            ['user_id' => 2, 'preset_id' => 1],
        ]);
    }
}
