<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;
use Carbon\Carbon;

class NotificationSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        $users = DB::table('users')->select('id', 'name')->get()->keyBy('id');
        $userIds = $users->keys()->toArray();
        $publicationIds = DB::table('publications')->pluck('id')->toArray();
        $commentIds = DB::table('comments')->pluck('id')->toArray();
        $presetIds = DB::table('presets')->pluck('id')->toArray();

        if (count($userIds) < 3) {
            $this->command->error("Se necesitan al menos 3 usuarios para generar notificaciones válidas.");
            return;
        }

        $notificationsMap = [
            'like' => ['publication'],
            'comment' => ['publication'],
            'follow' => ['user'],
            'message' => ['user'],
            'purchase' => ['preset'],
            'report' => ['publication', 'preset'],
        ];

        for ($i = 0; $i < 50; $i++) {
            // Elegir actor y destinatario distintos
            $actorId = $faker->randomElement($userIds);
            do {
                $recipientId = $faker->randomElement($userIds);
            } while ($recipientId === $actorId);

            $actorUsername = $users[$actorId]->username;

            $type = $faker->randomElement(array_keys($notificationsMap));
            $possibleEntities = $notificationsMap[$type];
            $entityType = $faker->randomElement($possibleEntities);

            // Asignar un entity_id válido según entity_type
            switch ($entityType) {
                case 'publication':
                    if (empty($publicationIds))
                        continue 2;
                    $entityId = $faker->randomElement($publicationIds);
                    break;
                case 'comment':
                    if (empty($commentIds))
                        continue 2;
                    $entityId = $faker->randomElement($commentIds);
                    break;
                case 'preset':
                    if (empty($presetIds))
                        continue 2;
                    $entityId = $faker->randomElement($presetIds);
                    break;
                case 'user':
                    do {
                        $entityId = $faker->randomElement($userIds);
                    } while (in_array($entityId, [$actorId, $recipientId]));
                    break;
                default:
                    continue 2;
            }

            // Mensaje con nombre del actor
            $message = match ($type) {
                'like' => "{$actorUsername} le dio like a tu {$entityType}.",
                'comment' => "{$actorUsername} comentó en tu publicación.",
                'follow' => "{$actorUsername} comenzó a seguirte.",
                'message' => "Has recibido un mensaje de {$actorUsername}.",
                'purchase' => "{$actorUsername} compró tu preset.",
                'report' => "{$actorUsername} reportó tu {$entityType}.",
                default => "{$actorUsername} realizó una acción.",
            };

            DB::table('notifications')->insert([
                'recipient_id' => $recipientId,
                'actor_id' => $actorId,
                'message' => $message,
                'type' => $type,
                'entity_type' => $entityType,
                'entity_id' => $entityId,
                'created_at' => Carbon::now()->subDays(rand(0, 30)),
                'updated_at' => Carbon::now(),
            ]);
        }
    }
}
