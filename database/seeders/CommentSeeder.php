<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Comment;

class CommentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Comment::insert([
            [
                'user_id' => 1,
                'publication_id' => 2,
                'content' => 'Me encanta el contraste de esta foto urbana.',
            ],
            [
                'user_id' => 2,
                'publication_id' => 1,
                'content' => '¡Qué tonos tan cálidos, me encanta!',
            ],
        ]);
    }
}
