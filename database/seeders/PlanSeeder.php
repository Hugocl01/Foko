<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Plan;

class PlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $plans = [
            ['name' => 'Premium', 'price' => 9.99],
            ['name' => 'Básico', 'price' => 0.00],
        ];

        foreach ($plans as $planData) {
            Plan::updateOrCreate(['name' => $planData['name']], $planData);
        }
    }
}
