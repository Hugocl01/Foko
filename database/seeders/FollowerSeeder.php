<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FollowerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('followers')->insert([
            ['follower_id' => 1, 'followed_id' => 2],
            ['follower_id' => 2, 'followed_id' => 1],
        ]);
    }
}
