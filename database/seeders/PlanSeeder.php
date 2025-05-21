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
            ['name' => 'Básico', 'price' => 0.00],
            ['name' => 'Premium', 'price' => 9.99],
        ];

        foreach ($plans as $planData) {
            Plan::updateOrCreate(['name' => $planData['name']], $planData);
        }
    }
}
