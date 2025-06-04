<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use Illuminate\Support\Arr;

class FollowerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Obtenemos todos los IDs de usuario
        $userIds = User::pluck('id')->toArray();
        $totalUsers = count($userIds);

        $followInserts = [];

        foreach ($userIds as $followerId) {
            // Cada usuario puede seguir entre 0 y (totalUsers - 1) usuarios
            $maxFollows = $totalUsers - 1;
            $followsCount = rand(0, $maxFollows);

            if ($followsCount === 0) {
                continue;
            }

            // Obtener posibles IDs a seguir (todos menos el mismo usuario)
            $possibleFollowed = array_diff($userIds, [$followerId]);

            // Si queremos menos seguidores que posibles, tomamos muestra aleatoria
            $followedIds = Arr::random($possibleFollowed, min($followsCount, count($possibleFollowed)));
            if (!is_array($followedIds)) {
                $followedIds = [$followedIds];
            }

            foreach ($followedIds as $followedId) {
                $followInserts[] = [
                    'follower_id' => $followerId,
                    'followed_id' => $followedId,
                ];
            }
        }

        // Insertar todos los registros en la tabla 'followers' de una sola vez
        if (!empty($followInserts)) {
            DB::table('followers')->insert($followInserts);
        }
    }
}
