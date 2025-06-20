<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Publication;
use App\Models\User;
use App\Models\Comment;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Faker\Factory as Faker;

class PublicationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $userIds = User::pluck('id')->toArray();
        $faker = Faker::create();
        $imageSourcePath = database_path('seeders/images/images');

        $publicationsData = [
            [
                'title' => 'Atardecer en la playa',
                'description' => 'Captura cálida con tonos dorados.'
            ],
            [
                'title' => 'Luces de ciudad',
                'description' => 'Fotografía nocturna urbana.'
            ],
            [
                'title' => 'Montañas nevadas',
                'description' => 'Vista panorámica de picos cubiertos de nieve.'
            ],
            [
                'title' => 'Bosque en otoño',
                'description' => 'Colores rojizos y anaranjados en las hojas.'
            ],
            [
                'title' => 'Café retro',
                'description' => 'Ambiente vintage con sillones de cuero.'
            ],
            [
                'title' => 'Calle empedrada',
                'description' => 'Textura de piedras iluminadas por faroles.'
            ],
            [
                'title' => 'Desierto al amanecer',
                'description' => 'Sombras largas y tonos rosados en la arena.'
            ],
            [
                'title' => 'Mar en calma',
                'description' => 'Reflejo del cielo azul en aguas tranquilas.'
            ],
            [
                'title' => 'Edificio histórico',
                'description' => 'Fachada con detalles arquitectónicos clásicos.'
            ],
            [
                'title' => 'Río serpenteante',
                'description' => 'Agua cristalina rodeada de vegetación.'
            ],
            [
                'title' => 'Jardín Zen',
                'description' => 'Rocas y arena rastrillada en patrones simétricos.'
            ],
            [
                'title' => 'Puente iluminado',
                'description' => 'Estructura metálica con luces de neón.'
            ],
            [
                'title' => 'Mercado local',
                'description' => 'Puestos coloridos de frutas y verduras.'
            ],
            [
                'title' => 'Cascada escondida',
                'description' => 'Agua cayendo entre rocas cubiertas de musgo.'
            ],
            [
                'title' => 'Arte callejero',
                'description' => 'Mural urbano con grafitis vibrantes.'
            ],
            [
                'title' => 'Camino rural',
                'description' => 'Sendero de tierra rodeado de campos verdes.'
            ],
            [
                'title' => 'Lago alpino',
                'description' => 'Espejo de agua reflejando montañas.'
            ],
            [
                'title' => 'Catedral gótica',
                'description' => 'Arcos apuntados y vitrales coloridos.'
            ],
            [
                'title' => 'Noche estrellada',
                'description' => 'Cielo despejado lleno de estrellas.'
            ],
            [
                'title' => 'Plantación de café',
                'description' => 'Filas de arbustos con granos maduros.'
            ],
            [
                'title' => 'Faro en la costa',
                'description' => 'Estructura blanca sobre acantilados rocosos.'
            ],
            [
                'title' => 'Plaza colonial',
                'description' => 'Fuente central rodeada de edificios antiguos.'
            ],
            [
                'title' => 'Viñedos de la Toscana',
                'description' => 'Hileras verdes de uvas y colinas onduladas.'
            ],
            [
                'title' => 'Puesta de sol en el desierto',
                'description' => 'Cielo rojizo sobre dunas doradas.'
            ],
            [
                'title' => 'Templo budista',
                'description' => 'Estructura con tejados curvos y decoración dorada.'
            ],
        ];

        foreach ($publicationsData as $data) {
            $randomUserId = Arr::random($userIds);
            $user = User::find($randomUserId);

            $userPresetIds = $user->presets()->pluck('id')->toArray();

            if (empty($userPresetIds)) {
                continue;
            }

            $presetId = Arr::random($userPresetIds);

            $publication = Publication::create([
                'user_id' => $randomUserId,
                'title' => $data['title'],
                'description' => $data['description'],
                'preset_id' => $presetId,
            ]);

            $plan = strtolower($user->plan->name);
            $numImages = ($plan === 'básico') ? 1 : rand(1, 3);

            for ($i = 0; $i < $numImages; $i++) {
                $originalFilename = "image" . rand(1, 27) . ".webp";
                $fullSourcePath = $imageSourcePath . '/' . $originalFilename;

                if (file_exists($fullSourcePath)) {
                    $newFilename = Str::uuid() . '.webp';
                    Storage::disk('images')->put($newFilename, file_get_contents($fullSourcePath));
                    $publication->images()->create(['url' => $newFilename]);
                }
            }

            $likesCount = rand(0, count($userIds));
            $likeUserIds = Arr::random($userIds, $likesCount);
            $likeUserIds = is_array($likeUserIds) ? $likeUserIds : [$likeUserIds];
            $now = now();

            $likes = collect($likeUserIds)
                ->filter(fn($id) => $id !== $randomUserId)
                ->map(fn($id) => [
                    'user_id' => $id,
                    'publication_id' => $publication->id,
                    'created_at' => $now,
                    'updated_at' => $now,
                ])->toArray();

            if (!empty($likes)) {
                DB::table('likes')->insert($likes);
            }

            $savedCount = rand(0, count($userIds));
            $savedUserIds = Arr::random($userIds, $savedCount);
            $savedUserIds = is_array($savedUserIds) ? $savedUserIds : [$savedUserIds];

            $saveds = collect($savedUserIds)
                ->filter(fn($id) => $id !== $randomUserId)
                ->map(fn($id) => [
                    'user_id' => $id,
                    'publication_id' => $publication->id,
                    'created_at' => $now,
                    'updated_at' => $now,
                ])->toArray();

            if (!empty($saveds)) {
                DB::table('saveds')->insert($saveds);
            }

            $commentsCount = rand(0, 5);
            for ($j = 0; $j < $commentsCount; $j++) {
                $commentUserId = Arr::random(array_diff($userIds, [$randomUserId]));
                Comment::create([
                    'user_id' => $commentUserId,
                    'publication_id' => $publication->id,
                    'content' => $faker->sentence(8, true),
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            }
        }
    }
}
