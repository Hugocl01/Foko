<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Publication;
use App\Models\User;
use Illuminate\Support\Arr;

class PublicationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Recogemos todos los IDs de usuario
        $userIds = User::pluck('id')->toArray();

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
            // Elegimos un usuario aleatorio para esta publicación
            $randomUserId = Arr::random($userIds);
            $user = User::find($randomUserId);

            // Creamos la publicación con el user_id elegido
            $publication = Publication::create([
                'user_id' => $randomUserId,
                'title' => $data['title'],
                'description' => $data['description'],
                'preset_id' => $data['preset_id'],
            ]);

            // Determinamos cuántas imágenes debe tener esta publicación según el plan
            $plan = strtolower($user->plan->name);

            if ($plan === 'Básico') {
                $numImages = 1;
            } elseif (in_array($plan, ['Premium', 'Ilimitado'])) {
                $numImages = rand(1,3);
            } else {
                $numImages = 1;
            }

            // Creamos las imágenes con nombres aleatorios entre prueba1.jpg y prueba10.jpg
            for ($i = 0; $i < $numImages; $i++) {
                $randomNumber = rand(1, 10);
                $filename = "prueba{$randomNumber}.jpg";

                $publication->images()->create([
                    'url' => $filename,
                ]);
            }
        }
    }
}
