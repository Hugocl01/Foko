<?php

namespace App\Http\Controllers;

use App\Models\Publication;
use App\Models\Hashtag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Laravel\Facades\Image;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PublicationController extends Controller
{
    /**
     * Mostrar un listado paginado de publicaciones,
     * inyectando en cada imagen el campo “url” que llama a getImageUrlAttribute().
     */
    public function index()
    {
        $user = Auth::user();
        $userId = $user->id;

        // 1) Obtenemos todos los presets del usuario autenticado
        $allPresets = $user->presets()
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($preset) {
                return [
                    'id' => $preset->id,
                    'name' => $preset->name
                ];
            })->toArray();

        // 2) Obtenemos el paginador estándar (5 publicaciones más recientes)
        $paginator = Publication::with(['user', 'images', 'preset', 'hashtags'])
            ->withCount(['likes', 'comments'])
            ->withCount([
                'likes as liked_by_user_count' => function ($q) use ($userId) {
                    $q->where('user_id', $userId);
                },
                'saveds as saved_by_user_count' => function ($q) use ($userId) {
                    $q->where('user_id', $userId);
                },
            ])
            ->orderBy('created_at', 'desc')
            ->paginate(5);

        // 3) Reordenamos sólo esta página (5 items):
        //    asignamos prioridad 0 a los plan_id != 2 (premium)
        //    y 1 a los plan_id == 2 (no premium)
        $reordered = $paginator->getCollection()
            ->sortBy(fn($pub) => $pub->user->plan_id == 2 ? 1 : 0)
            ->values();

        // 4) Aplicamos la transformación original sobre la colección reordenada
        $mapped = $reordered->map(function ($pub) use ($userId) {
            // URLs de imágenes
            $pub->images->transform(function ($img) {
                $img->url = $img->getImageUrlAttribute();
                return $img;
            });

            return [
                'id' => $pub->id,
                'user' => [
                    'id' => $pub->user->id,
                    'name' => $pub->user->name,
                    'username' => $pub->user->username,
                    'profile_image' => $pub->user->getProfileImageUrlAttribute(),
                    'plan_id' => $pub->user->plan_id,
                ],
                'images' => $pub->images->map(fn($img) => [
                    'id' => $img->id,
                    'url' => $img->url,
                ])->all(),
                'preset' => $pub->preset
                    ? ['id' => $pub->preset->id, 'name' => $pub->preset->name]
                    : null,
                'hashtags' => $pub->hashtags->map(fn($tag) => [
                    'id' => $tag->id,
                    'name' => $tag->name,
                ])->all(),
                'likes_count' => $pub->likes_count,
                'comments_count' => $pub->comments_count,
                'liked' => $pub->liked_by_user_count > 0,
                'saved' => $pub->saved_by_user_count > 0,
                'title' => $pub->title,
                'description' => $pub->description,
                'created_at' => $pub->created_at->toDateTimeString(),
            ];
        });

        // 5) Sustituimos la colección del paginator por la reordenada + mapeada
        $paginator->setCollection($mapped);

        // 6) Enviamos a Inertia incluyendo también los presets
        return Inertia::render('publications', [
            'publications' => $paginator,
            'presets' => $allPresets,
        ]);
    }

    /**
     * Mostrar detalle de una sola publicación con conteos, estado de “like” y lista de presets del usuario.
     */
    public function show(Publication $publication)
    {
        $userId = Auth::id();

        // 1) Carga eager de relaciones y conteos (likes, comments, saves)
        $publication->load([
            'user:id,name,username,profile_image',
            'images',
            'preset:id,name,description,price',
            'hashtags:id,name',
        ])
            ->loadCount(['likes', 'comments'])
            ->loadCount([
                'likes as liked_by_user_count' => function ($q) use ($userId) {
                    $q->where('user_id', $userId);
                },
                'saveds as saved_by_user_count' => function ($q) use ($userId) {
                    $q->where('user_id', $userId);
                },
            ]);

        // 2) Agregar URL completa a cada imagen
        $publication->images->transform(function ($img) {
            $img->url = $img->getImageUrlAttribute();
            return $img;
        });

        // 3) Obtener todos los presets del usuario autenticado
        $userPresets = Auth::user()->presets()
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($p) {
                return [
                    'id' => $p->id,
                    'name' => $p->name,
                    'description' => $p->description,
                    'price' => $p->price,
                    'before_image_url' => $p->before_image_url,
                    'after_image_url' => $p->after_image_url,
                ];
            })->toArray();

        // 4) Preparar payload de la publicación
        $item = [
            'id' => $publication->id,
            'user' => [
                'id' => $publication->user->id,
                'name' => $publication->user->name,
                'username' => $publication->user->username,
                'avatar' => $publication->user->getProfileImageUrlAttribute(),
            ],
            'images' => $publication->images->map(fn($img) => [
                'id' => $img->id,
                'url' => $img->url,
            ])->all(),
            'preset' => $publication->preset
                ? [
                    'id' => $publication->preset->id,
                    'name' => $publication->preset->name,
                    'description' => $publication->preset->description,
                    'price' => $publication->preset->price,
                ]
                : null,
            'hashtags' => $publication->hashtags->map(fn($tag) => [
                'id' => $tag->id,
                'name' => $tag->name,
            ])->all(),
            'likes_count' => $publication->likes_count,
            'comments_count' => $publication->comments_count,
            'liked' => $publication->liked_by_user_count > 0,
            'saved' => $publication->saved_by_user_count > 0,
            'title' => $publication->title,
            'description' => $publication->description,
            'created_at' => $publication->created_at->toDateTimeString(),
        ];

        // 5) Enviar a Inertia incluyendo los presets
        return Inertia::render('publication', [
            'publication' => $item,
            'presets' => $userPresets,
        ]);
    }

    /**
     * Toggle "like" para la publicación: crea o elimina el registro en BD.
     */
    public function toggleLike(Request $request, Publication $publication)
    {
        $userId = Auth::id();
        $likeQuery = $publication->likes()->where('user_id', $userId);

        if ($likeQuery->exists()) {
            // Si ya había like, lo quitamos
            $likeQuery->delete();
            $message = 'Like eliminado';
        } else {
            // Si no, lo creamos
            $publication->likes()->create(['user_id' => $userId]);
            $message = 'Like agregado';
        }

        // Redirigir a la misma página sin perder parámetros
        return redirect()
            ->back()
            ->with('success', $message);
    }

    /**
     * /**
     * Ruta: POST publications/{publication}/save
     * Toggle "saved" para la publicación y redirigir de vuelta con flash.
     */
    public function toggleSave(Request $request, Publication $publication)
    {
        $userId = Auth::id();
        $saveQuery = $publication->saveds()->where('user_id', $userId);

        if ($saveQuery->exists()) {
            $saveQuery->delete();
            $message = 'Publicación eliminada de guardados';
        } else {
            $publication->saveds()->create(['user_id' => $userId]);
            $message = 'Publicación añadida a guardados';
        }

        return redirect()->back()->with('success', $message);
    }

    /**
     * Guarda una nueva publicación con sus imágenes y hashtags.
     */
    public function store(Request $request)
    {
        // 1) Validar todos los campos
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'preset_id' => 'nullable|exists:presets,id',
            'images' => 'required|array|min:1',
            'images.*' => 'image|max:5120',    // cada imagen hasta 5 MB
            'hashtags' => 'nullable',
            'hashtags.*' => 'string|max:255',
        ]);

        $createdFiles = [];

        DB::beginTransaction();
        try {
            // 2) Instanciar y guardar la publicación
            $pub = new Publication();
            $pub->title = $validated['title'];
            $pub->description = $validated['description'];
            $pub->preset_id = $validated['preset_id'] ?? null;
            $pub->user_id = Auth::id();
            $pub->save();

            // 3) Procesar “images[]”
            foreach ($request->file('images') as $upload) {
                // Usamos Image::read() igual que en presets
                $img = Image::read($upload->getRealPath())
                    ->encodeByExtension('webp', 80);
                $filename = Str::uuid() . '.webp';

                Storage::disk('images')->put($filename, (string) $img);
                $createdFiles[] = $filename;

                $pub->images()->create([
                    'url' => $filename,
                ]);
            }

            // 4) Sincronizar hashtags
            if ($request->filled('hashtags')) {
                $names = is_array($validated['hashtags'])
                    ? $validated['hashtags']
                    : json_decode($validated['hashtags'], true);

                $tagIds = [];
                foreach ($names as $raw) {
                    $clean = ltrim(trim($raw), '#');
                    if (empty($clean)) {
                        continue;
                    }
                    $tag = Hashtag::firstOrCreate(
                        ['slug' => Str::slug($clean)],
                        ['name' => $clean]
                    );
                    $tagIds[] = $tag->id;
                }
                $pub->hashtags()->sync($tagIds);
            }

            DB::commit();

        } catch (\Exception $e) {
            DB::rollBack();

            // 5) Limpiar archivos en disco si algo falla
            foreach ($createdFiles as $f) {
                Storage::disk('publication_images')->delete($f);
            }

            return back()
                ->withInput()
                ->withErrors(['error' => 'Error al crear publicación: ' . $e->getMessage()]);
        }

        // 6) Responder con JSON (para AJAX/Inertia)
        return response()->json([
            'message' => 'Publicación creada correctamente',
            'publication' => $pub->load(['images', 'hashtags', 'user']),
        ]);
    }
}
