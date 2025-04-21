<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Usuario de pruebas
        $u = new User();
        $u->name = "Hugo";
        $u->email = "hugocayon@gmail.com";
        $u->password = "1234";
        $u->plan_id = null;
        $u->profile_picture_url = null;
        $u->description = "Hola soy Hugo el crear de esta web espero que os gusta";
        $u->save();
    }
}
