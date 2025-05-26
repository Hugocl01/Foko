<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Purchase;
use App\Models\User;
use App\Models\Preset;
use Faker\Factory as Faker;

class PurchaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();
        $users = User::all();
        $presetIds = Preset::pluck('id')->toArray();
        $max = count($presetIds);

        foreach ($users as $user) {
            // Número aleatorio de compras entre 0 y cuantos presets haya
            $n = rand(0, $max);

            // Si n es 0, no generamos compras para este usuario
            if ($n === 0) {
                continue;
            }

            // Elegimos n presets distintos al azar
            $chosen = $faker->randomElements($presetIds, $n);

            foreach ($chosen as $presetId) {
                Purchase::create([
                    'user_id' => $user->id,
                    'preset_id' => $presetId,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
