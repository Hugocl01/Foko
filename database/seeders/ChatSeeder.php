<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Chat;
use Illuminate\Support\Facades\DB;

class ChatSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $chats = [
            ['name' => 'Chat entre Hugo y Admin'],
        ];

        foreach ($chats as $chat) {
            $chatModel = Chat::create($chat);

            // Relaciona usuarios con el chat
            DB::table('users_chats')->insert([
                ['chat_id' => $chatModel->id, 'user_id' => 1],
                ['chat_id' => $chatModel->id, 'user_id' => 2],
            ]);

            // Mensaje de ejemplo
            DB::table('messages')->insert([
                'sender_id' => 1,
                'content' => '¡Hola! ¿Cómo va el proyecto?',
                'chat_id' => $chatModel->id,
            ]);
        }
    }
}
