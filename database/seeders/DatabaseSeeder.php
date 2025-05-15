<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Database\Seeders\UserSeeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Limpia todas las tablas antes de hacer el seeding
        DB::table('users')->delete();
        DB::table('plans')->delete();
        DB::table('features')->delete();
        DB::table('tags')->delete();
        DB::table('presets')->delete();
        DB::table('chats')->delete();
        DB::table('images')->delete();
        DB::table('purchases')->delete();
        DB::table('comments')->delete();
        DB::table('likes')->delete();
        DB::table('saved')->delete();
        DB::table('reports')->delete();
        DB::table('notifications')->delete();
        DB::table('users')->delete();
        DB::table('plan_features')->delete();
        DB::table('presets_tags')->delete();
        DB::table('publications_tags')->delete();
        DB::table('followers')->delete();
        DB::table('users_chats')->delete();
        DB::table('messages')->delete();

        // Llama a los seeders
        $this->call([
            UserSeeder::class,          // Crea los usuarios
            PlanSeeder::class,          // Crea los planes
            FeatureSeeder::class,       // Crea las características
            PlanFeatureSeeder::class,
            TagSeeder::class,           // Crea las etiquetas
            PresetSeeder::class,        // Crea los presets
            PublicationSeeder::class,   // Crea las publicaciones
            PublicationTagSeeder::class,
            ChatSeeder::class,          // Crea los chats
            ImageSeeder::class,         // Crea las imágenes
            PurchaseSeeder::class,      // Crea las compras
            CommentSeeder::class,       // Crea los comentarios
            LikeSeeder::class,          // Crea los "me gusta"
            SavedPostSeeder::class,     // Crea los posts guardados
            ReportSeeder::class,        // Crea los reportes
            NotificationSeeder::class,  // Crea las notificaciones
        ]);
    }
}
