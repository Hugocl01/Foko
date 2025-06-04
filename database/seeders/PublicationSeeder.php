<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Publication;
use App\Models\User;
use App\Models\Comment;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class PublicationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Obtenemos todos los IDs de usuario
        $userIds = User::pluck('id')->toArray();

        // Inicializamos Faker para generar comentarios
        $faker = Faker::create();

        $publicationsData = [
            [
                'title' => 'Atardecer en la playa',
                'description' => 'Captura cálida con tonos dorados.',
                'preset_id' => 1,
            ],
            [
                'title' => 'Luces de ciudad',
                'description' => 'Fotografía nocturna urbana.',
                'preset_id' => 2,
            ],
            [
                'title' => 'Montañas nevadas',
                'description' => 'Vista panorámica de picos cubiertos de nieve.',
                'preset_id' => 3,
            ],
            [
                'title' => 'Bosque en otoño',
                'description' => 'Colores rojizos y anaranjados en las hojas.',
                'preset_id' => 4,
            ],
            [
                'title' => 'Café retro',
                'description' => 'Ambiente vintage con sillones de cuero.',
                'preset_id' => 5,
            ],
            [
                'title' => 'Calle empedrada',
                'description' => 'Textura de piedras iluminadas por faroles.',
                'preset_id' => 2,
            ],
            [
                'title' => 'Desierto al amanecer',
                'description' => 'Sombras largas y tonos rosados en la arena.',
                'preset_id' => 3,
            ],
            [
                'title' => 'Mar en calma',
                'description' => 'Reflejo del cielo azul en aguas tranquilas.',
                'preset_id' => 1,
            ],
            [
                'title' => 'Edificio histórico',
                'description' => 'Fachada con detalles arquitectónicos clásicos.',
                'preset_id' => 4,
            ],
            [
                'title' => 'Río serpenteante',
                'description' => 'Agua cristalina rodeada de vegetación.',
                'preset_id' => 5,
            ],
            [
                'title' => 'Jardín Zen',
                'description' => 'Rocas y arena rastrillada en patrones simétricos.',
                'preset_id' => 3,
            ],
            [
                'title' => 'Puente iluminado',
                'description' => 'Estructura metálica con luces de neón.',
                'preset_id' => 2,
            ],
            [
                'title' => 'Mercado local',
                'description' => 'Puestos coloridos de frutas y verduras.',
                'preset_id' => 1,
            ],
            [
                'title' => 'Cascada escondida',
                'description' => 'Agua cayendo entre rocas cubiertas de musgo.',
                'preset_id' => 4,
            ],
            [
                'title' => 'Arte callejero',
                'description' => 'Mural urbano con grafitis vibrantes.',
                'preset_id' => 5,
            ],
            [
                'title' => 'Camino rural',
                'description' => 'Sendero de tierra rodeado de campos verdes.',
                'preset_id' => 2,
            ],
            [
                'title' => 'Lago alpino',
                'description' => 'Espejo de agua reflejando montañas.',
                'preset_id' => 3,
            ],
            [
                'title' => 'Catedral gótica',
                'description' => 'Arcos apuntados y vitrales coloridos.',
                'preset_id' => 4,
            ],
            [
                'title' => 'Noche estrellada',
                'description' => 'Cielo despejado lleno de estrellas.',
                'preset_id' => 1,
            ],
            [
                'title' => 'Plantación de café',
                'description' => 'Filas de arbustos con granos maduros.',
                'preset_id' => 5,
            ],
            [
                'title' => 'Faro en la costa',
                'description' => 'Estructura blanca sobre acantilados rocosos.',
                'preset_id' => 2,
            ],
            [
                'title' => 'Plaza colonial',
                'description' => 'Fuente central rodeada de edificios antiguos.',
                'preset_id' => 3,
            ],
            [
                'title' => 'Viñedos de la Toscana',
                'description' => 'Hileras verdes de uvas y colinas onduladas.',
                'preset_id' => 4,
            ],
            [
                'title' => 'Puesta de sol en el desierto',
                'description' => 'Cielo rojizo sobre dunas doradas.',
                'preset_id' => 1,
            ],
            [
                'title' => 'Templo budista',
                'description' => 'Estructura con tejados curvos y decoración dorada.',
                'preset_id' => 5,
            ],
        ];

        foreach ($publicationsData as $data) {
            // Elegimos un usuario aleatorio como autor de la publicación
            $randomUserId = Arr::random($userIds);
            $user = User::find($randomUserId);

            // Creamos la publicación
            $publication = Publication::create([
                'user_id' => $randomUserId,
                'title' => $data['title'],
                'description' => $data['description'],
                'preset_id' => $data['preset_id'],
            ]);

            // Determinamos cuántas imágenes agregar según el plan del usuario
            $plan = strtolower($user->plan->name);
            if ($plan === 'básico') {
                $numImages = 1;
            } elseif (in_array($plan, ['premium', 'ilimitado'])) {
                $numImages = rand(1, 3);
            } else {
                $numImages = 1;
            }

            // Creamos imágenes con nombres aleatorios (prueba1.jpg … prueba10.jpg)
            for ($i = 0; $i < $numImages; $i++) {
                $randomNumber = rand(1, 10);
                $filename = "prueba{$randomNumber}.jpg";

                $publication->images()->create([
                    'url' => $filename,
                ]);
            }

            // ---------------------------------------------------
            // Generar registros aleatorios en la tabla `likes`
            // ---------------------------------------------------
            $likesCount = rand(0, count($userIds));
            if ($likesCount > 0) {
                $likeUserIds = Arr::random($userIds, $likesCount);
                if (!is_array($likeUserIds)) {
                    $likeUserIds = [$likeUserIds];
                }

                $likesInserts = [];
                $now = now();
                foreach ($likeUserIds as $likeUserId) {
                    // Evitar que el autor de la publicación se marque a sí mismo (opcional)
                    if ($likeUserId === $randomUserId) {
                        continue;
                    }
                    $likesInserts[] = [
                        'user_id' => $likeUserId,
                        'publication_id' => $publication->id,
                        'created_at' => $now,
                        'updated_at' => $now,
                    ];
                }

                if (!empty($likesInserts)) {
                    DB::table('likes')->insert($likesInserts);
                }
            }

            // ------------------------------------------------------
            // Generar registros aleatorios en la tabla `saved`
            // ------------------------------------------------------
            $savedCount = rand(0, count($userIds));
            if ($savedCount > 0) {
                $savedUserIds = Arr::random($userIds, $savedCount);
                if (!is_array($savedUserIds)) {
                    $savedUserIds = [$savedUserIds];
                }

                $savedInserts = [];
                $now = now();
                foreach ($savedUserIds as $savedUserId) {
                    // Evitar que el autor se guarde a sí mismo (opcional)
                    if ($savedUserId === $randomUserId) {
                        continue;
                    }
                    $savedInserts[] = [
                        'user_id' => $savedUserId,
                        'publication_id' => $publication->id,
                        'created_at' => $now,
                        'updated_at' => $now,
                    ];
                }

                if (!empty($savedInserts)) {
                    DB::table('saved')->insert($savedInserts);
                }
            }

            // ------------------------------------------------------
            // Generar comentarios aleatorios para esta publicación
            // ------------------------------------------------------
            // Decidimos cuántos comentarios tendrá (0 a 5)
            $commentsCount = rand(0, 5);
            for ($j = 0; $j < $commentsCount; $j++) {
                // Elegimos un usuario aleatorio para el comentario,
                // evitando (opcionalmente) que sea el mismo autor de la publicación:
                $commentUserId = Arr::random($userIds);
                if ($commentUserId === $randomUserId) {
                    // Si coincide, lo ignoramos y tomamos otro distinto
                    $possible = array_diff($userIds, [$randomUserId]);
                    if (!empty($possible)) {
                        $commentUserId = Arr::random($possible);
                    }
                }

                Comment::create([
                    'user_id' => $commentUserId,
                    'publication_id' => $publication->id,
                    'content' => $faker->sentence(8, true), // frase de 8 palabras aprox.
                ]);
            }
        }
    }
}
