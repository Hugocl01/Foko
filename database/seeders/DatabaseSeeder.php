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
        DB::table('roles')->delete();
        DB::table('plans')->delete();
        DB::table('features')->delete();
        DB::table('plan_features')->delete();

        // Llama a los seeders
        $this->call([
            RoleSeeder::class,          // Crea los roles
            PlanSeeder::class,          // Crea los planes
            FeatureSeeder::class,          // Crea los Caracteristicas
            PlanFeatureSeeder::class,          // Crea los datos de la tabla intermedia

        ]);
    }
}
