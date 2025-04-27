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
                'email' => 'hugocayon@gmail.com',
                'password' => '1234',
                'role' => 'user',
                'description' => 'Hola soy Hugo, el creador de esta web, espero que os guste.',
            ],
            [
                'name' => 'Admin',
                'email' => 'admin@gmail.com',
                'password' => 'admin1234',
                'role' => 'admin',
                'description' => 'Administrador de la plataforma.',
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
