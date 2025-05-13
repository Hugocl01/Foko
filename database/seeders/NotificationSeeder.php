<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Support\Str;
use Carbon\Carbon;

class NotificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Asegúrate de tener al menos un usuario
        $user = User::first();

        if (!$user) {
            $this->command->warn('⚠️ No se encontraron usuarios.');
            return;
        }

        for ($i = 1; $i <= 10; $i++) {
            Notification::create([
                'user_id' => $user->id,
                'message' => 'Esta es una notificación de prueba #' . $i,
                'is_read' => false,
                'created_at' => Carbon::now()->subHours(2 * $i),
                'updated_at' => Carbon::now()->subHours(2 * $i),
            ]);
        }

        $this->command->info('✅ Se insertaron 10 notificaciones para el usuario ID ' . $user->id);
    }
}
