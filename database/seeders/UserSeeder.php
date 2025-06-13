<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                'name' => 'Hugo',
                'username' => 'hugo_cl01',
                'email' => 'hugocayon@gmail.com',
                'password' => '1234',
                'plan_id' => 1,
                'role_id' => 1,
                'description' => 'Hola soy Hugo, el creador de esta web, espero que os guste.',
                'profile_image' => '9f9ccbf3-ec69-47a7-9a6b-86f8bf4856d9.webp',
            ],
            [
                'name' => 'Admin',
                'username' => 'admin',
                'email' => 'admin@gmail.com',
                'password' => 'admin1234',
                'plan_id' => 1,
                'role_id' => 1,
                'description' => 'Administrador de la plataforma.',
                'profile_image' => '96e3abca-8ed6-446a-bff3-618acd8cf6a2.webp',
            ],
            [
                'name' => 'Sara Ortega',
                'username' => 'sara_ortega',
                'email' => 'sara.ortega@example.com',
                'password' => 'password',
                'plan_id' => 1,
                'role_id' => 2,
                'description' => 'Foko me permite mantener mi estilo en todas mis publicaciones. La facilidad para aplicar presets ha cambiado mi flujo de trabajo.',
                'profile_image' => 'sara_ortega.webp',
            ],
            [
                'name' => 'Daniel Álvarez',
                'username' => 'daniel_alvarez',
                'email' => 'daniel.alvarez@example.com',
                'password' => 'password',
                'plan_id' => 1,
                'role_id' => 2,
                'description' => 'Descubrí Foko por recomendación y me ha sorprendido. Ideal para portafolios y compartir resultados sin complicaciones.',
                'profile_image' => 'daniel_alvarez.webp',
            ],
            [
                'name' => 'Lucía Torres',
                'username' => 'lucia_torres',
                'email' => 'lucia.torres@example.com',
                'password' => 'password',
                'plan_id' => 1,
                'role_id' => 2,
                'description' => 'La interfaz es tan intuitiva que no necesitas experiencia previa. Me encanta la comunidad que se está formando.',
                'profile_image' => 'lucia_torres.webp',
            ],
        ];

        foreach ($users as $userData) {
            User::create([
                'name' => $userData['name'],
                'username' => $userData['username'],
                'email' => $userData['email'],
                'password' => Hash::make($userData['password']),
                'plan_id' => $userData['plan_id'],
                'role_id' => $userData['role_id'],
                'description' => $userData['description'],
                'profile_image' => $userData['profile_image'],
            ]);
        }

        // Usuarios de prueba adicionales
        User::factory(95)->create();
    }
}
