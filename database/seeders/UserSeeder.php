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
                'profile_image' => '9f9ccbf3-ec69-47a7-9a6b-86f8bf4856d9.webp'
            ],
            [
                'name' => 'Admin',
                'username' => 'admin',
                'email' => 'admin@gmail.com',
                'password' => 'admin1234',
                'plan_id' => 1,
                'role_id' => 1,
                'description' => 'Administrador de la plataforma.',
                'profile_image' => '96e3abca-8ed6-446a-bff3-618acd8cf6a2.webp'
            ]
        ];

        foreach ($users as $userData) {
            User::create([
                'name' => $userData['name'],
                'username' => $userData['username'],
                'email' => $userData['email'],
                'password' => Hash::make($userData['password']),
                'plan_id' => $userData['plan_id'],
                'role_id' => $userData['role_id'],
                'profile_image' => $userData['profile_image'],
                'description' => $userData['description'],
            ]);
        }

        // Usuarios de prueba adiccionales
        User::factory(100)->create();
    }
}
