<?php

namespace Database\Seeders;

use App\Models\Preset;
use App\Models\Purchase;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Limpia todas las tablas antes de hacer el seeding
        DB::table('roles')->delete();
        DB::table('plans')->delete();
        DB::table('features')->delete();
        DB::table('plan_features')->delete();
        DB::table('users')->delete();
        DB::table('chats')->delete();
        DB::table('presets')->delete();
        DB::table('publications')->delete();
        DB::table('hashtags')->delete();
        DB::table('purchases')->delete();

        // Llama a los seeders
        $this->call([
            RoleSeeder::class,          // Crea los roles
            PlanSeeder::class,          // Crea los planes
            FeatureSeeder::class,       // Crea los Caracteristicas
            PlanFeatureSeeder::class,   // Crea los datos de la tabla intermedia
            UserSeeder::class,          // Crea los usuarios
            ChatSeeder::class,          // Crea los chats con los usuarios y mensajes
            PresetSeeder::class,        // Crea los presets
            PublicationSeeder::class,   // Crea las publicaciones con sus imagenes
            HashtagSeeder::class,       // Crea los Hashtags con las relaciones a Publicaciones y Presets
            PurchaseSeeder::class,      // Crea las compras de los presets
        ]);
    }
}
