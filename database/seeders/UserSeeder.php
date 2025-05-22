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
                'role' => 2,
                'description' => 'Hola soy Hugo, el creador de esta web, espero que os guste.',
            ],
            [
                'name' => 'Admin',
                'username' => 'admin',
                'email' => 'admin@gmail.com',
                'password' => 'admin1234',
                'role' => 1,
                'description' => 'Administrador de la plataforma.',
            ]
        ];

        foreach ($users as $userData) {
            User::create([
                'name' => $userData['name'],
                'username' => $userData['username'],
                'email' => $userData['email'],
                'password' => Hash::make($userData['password']),
                'role_id' => $userData['role'],
                'plan_id' => null,
                'profile_image_url' => null,
                'description' => $userData['description'],
            ]);
        }

        // Usuarios de prueba adiccionales
        User::factory(50)->create();
    }
}
