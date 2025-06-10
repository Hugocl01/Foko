<?php

namespace Database\Seeders;


use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;
use Carbon\Carbon;
use Illuminate\Support\Testing\Fakes\Fake;

class NotificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();

        // Obtener los IDs de las tablas relacionadas
        $userIds = DB::table('users')->pluck('id')->toArray();
        $publicationIds = DB::table('publications')->pluck('id')->toArray();
        $commentIds = DB::table('comments')->pluck('id')->toArray();
        $presetIds = DB::table('presets')->pluck('id')->toArray();

        $types = ['like', 'comment', 'follow', 'message', 'purchase', 'report'];

        // Construir dinámicamente una lista de entity_types válidos
        $entityTypes = [];
        if (!empty($publicationIds)) {
            $entityTypes[] = 'publication';
        }
        if (!empty($commentIds)) {
            $entityTypes[] = 'comment';
        }
        if (!empty($presetIds)) {
            $entityTypes[] = 'preset';
        }
        if (!empty($userIds)) {
            $entityTypes[] = 'user';
        }

        if (empty($entityTypes)) {
            $this->command->error("No hay ninguna entidad disponible para entity_type. Asegúrate de tener al menos un usuario en la tabla 'users'.");
            return;
        }

        // Crear 50 notificaciones de prueba
        for ($i = 0; $i < 50; $i++) {
            // Elegir actor y destinatario distintos
            $actorId = $faker->randomElement($userIds);
            do {
                $recipientId = $faker->randomElement($userIds);
            } while ($recipientId === $actorId);

            $type = $faker->randomElement($types);
            $entityType = $faker->randomElement($entityTypes);

            // Determinar entity_id según el entity_type
            switch ($entityType) {
                case 'publication':
                    // Aquí nunca ocurre si publicationIds está vacío
                    $entityId = $faker->randomElement($publicationIds);
                    break;

                case 'comment':
                    $entityId = $faker->randomElement($commentIds);
                    break;

                case 'preset':
                    $entityId = $faker->randomElement($presetIds);
                    break;

                case 'user':
                    // Asignar otro user distinto de actor y recipient
                    do {
                        $entityId = $faker->randomElement($userIds);
                    } while ($entityId === $actorId || $entityId === $recipientId);
                    break;

                default:
                    // Nunca debería llegar aquí porque entityType sale de $entityTypes
                    $entityId = null;
            }

            DB::table('notifications')->insert([
                'recipient_id' => $recipientId,
                'actor_id' => $actorId,
                'message' => $faker->sentence(),
                'type' => $type,
                'entity_type' => $entityType,
                'entity_id' => $entityId,
                'created_at' => Carbon::now()->subDays(rand(0, 30)),
                'updated_at' => Carbon::now(),
            ]);
        }
    }
}
