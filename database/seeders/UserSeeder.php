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
                'role' => 'user',
                'description' => 'Hola soy Hugo, el creador de esta web, espero que os guste.',
            ],
            [
                'name' => 'Admin',
                'username' => 'admin',
                'email' => 'admin@gmail.com',
                'password' => 'admin1234',
                'role' => 'admin',
                'description' => 'Administrador de la plataforma.',
            ],
            [
                'name' => 'Ana López',
                'username' => 'ana_lp',
                'email' => 'ana@example.com',
                'password' => 'ana2025',
                'role' => 'user',
                'description' => 'Amante de la fotografía y los presets vintage.',
            ],
            [
                'name' => 'Carlos Ruiz',
                'username' => 'carlos_ruiz',
                'email' => 'carlos@example.com',
                'password' => 'carlos2025',
                'role' => 'user',
                'description' => 'Explorando la edición digital y compartiendo ideas.',
            ],
        ];

        foreach ($users as $userData) {
            User::create([
                'name' => $userData['name'],
                'email' => $userData['email'],
                'password' => Hash::make($userData['password']),
                'role' => $userData['role'],
                'plan_id' => null,
                'profile_picture_url' => null,
                'description' => $userData['description'],
            ]);
        }
    }
}
