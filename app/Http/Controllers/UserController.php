<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Plan;
use App\Models\Role;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\UserStoreRequest;
use App\Http\Requests\UserUpdateRequest;

class UserController extends Controller
{
    public function index()
    {
        // Trae todos los usuarios, con plan y rol
        $users = User::with(['plan', 'role'])->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'username' => $user->username,
                    'email' => $user->email,
                    'plan' => $user->plan,
                    'role' => $user->role,
                    'status' => $user->status,
                    'profile_image' => $user->getProfileImageUrlAttribute(),
                ];
            });

        return Inertia::render('admin/users', [
            'users' => $users,           // ahora es un array plano
            'plans' => Plan::all(),
            'roles' => Role::all(),
        ]);
    }

    public function create()
    {
        $plans = Plan::all();

        return Inertia::render('Users/Create', [
            'plans' => $plans,
        ]);
    }

    public function store(UserStoreRequest $request)
    {
        // 1) Obtenemos los datos validados
        $data = $request->validated();

        // 2) Hasheamos la contraseña
        $data['password'] = Hash::make($data['password']);

        // 3) Creamos el usuario
        User::create($data);

        return redirect()->route('users.index')
            ->with('success', 'Usuario creado correctamente.');
    }

    public function show(User $user)
    {
        $user->load(['plan', 'followers', 'following', 'publications', 'presets', 'purchases']);

        return Inertia::render('Users/Show', [
            'user' => $user,
        ]);
    }

    public function edit(User $user)
    {
        $plans = Plan::all();

        return Inertia::render('Users/Edit', [
            'user' => $user,
            'plans' => $plans,
        ]);
    }

    /**
     * Update the specified user in storage.
     */
    public function update(UserUpdateRequest $request, User $user)
    {
        $user->update($request->validated());

        return redirect()->route('users.index')
            ->with('success', 'Usuario actualizado correctamente.');
    }

    public function destroy(User $user)
    {
        if (Auth::id() === $user->id) {
            return redirect()->route('users.index')->with('error', 'No puedes eliminar tu propio usuario.');
        }

        $user->delete();

        return redirect()->route('users.index')->with('success', 'Usuario eliminado correctamente.');
    }

    /**
     * Construye y devuelve el array con los datos comunes de un perfil:
     * - atributos del usuario
     * - profile_image, plan, followers, following, purchases
     * - el número total de publicaciones y presets
     * - isOwnProfile, isFollowing
     */
    protected function getCommonUserData(User $user): array
    {
        // 1) Carga todas las relaciones necesarias para los contadores y banderas
        $user->load([
            'plan',
            'followers',
            'following',
            'publications', // para contar
            'presets',      // para contar
            'purchases',
            'saveds',        // para contar
        ]);

        // 2) Base con los atributos del modelo User
        $data = $user->attributesToArray();

        // 3) Campos “append” generales
        $data['profile_image'] = $user->getProfileImageUrlAttribute();
        $data['plan'] = $user->plan;

        // 4) Followers y following (solo id, name y avatar_url)
        $data['followers'] = $user->followers
            ->map(fn($f) => [
                'id' => $f->id,
                'name' => $f->name,
                'avatar_url' => $f->avatar_url,
            ])->toArray();

        $data['following'] = $user->following
            ->map(fn($f) => [
                'id' => $f->id,
                'name' => $f->name,
                'avatar_url' => $f->avatar_url,
            ])->toArray();

        // 5) Compras (solo id, preset_id y amount)
        $data['purchases'] = $user->purchases
            ->map(fn($purchase) => [
                'id' => $purchase->id,
                'preset_id' => $purchase->preset_id,
                'amount' => $purchase->amount,
            ])->toArray();

        // 6) Contadores (publications_count, presets_count y saveds_count)
        $data['publications_count'] = $user->publications->count();
        $data['presets_count'] = $user->presets->count();
        $data['saveds_count'] = $user->saveds->count();

        // 7) Banderas de perfil
        $data['isOwnProfile'] = $user->id === Auth::id();
        $data['isFollowing'] = Auth::user()
            ? Auth::user()->following->contains($user->id)
            : false;

        return $data;
    }

    public function userPublications(User $user)
    {
        // 1) Obtener el array base con datos comunes (sin publicaciones/presets, etc.)
        $data = $this->getCommonUserData($user);

        // 2) Cargar cada publicación con sus relaciones necesarias:
        $publications = $user->publications()
            ->with(['images'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($pub) {
                // Mapear imágenes para incluir el campo "url" usando el accessor:
                $images = $pub->images->map(function ($img) {
                    return [
                        'id' => $img->id,
                        'publication_id' => $img->publication_id,
                        'url' => $img->getImageUrlAttribute(),
                        'created_at' => $img->created_at->toDateTimeString(),
                        'updated_at' => $img->updated_at->toDateTimeString(),
                    ];
                })->toArray();

                // Mapear hashtags:
                $hashtags = $pub->hashtags->map(function ($h) {
                    return [
                        'id' => $h->id,
                        'name' => $h->name,
                        'slug' => $h->slug,
                        'created_at' => $h->created_at->toDateTimeString(),
                        'updated_at' => $h->updated_at->toDateTimeString(),
                    ];
                })->toArray();

                // Devolver toda la publicación en formato array:
                return [
                    'id' => $pub->id,
                    'user_id' => $pub->user_id,
                    'title' => $pub->title,
                    'description' => $pub->description,
                    'preset_id' => $pub->preset_id,
                    'created_at' => $pub->created_at->toDateTimeString(),
                    'updated_at' => $pub->updated_at->toDateTimeString(),
                    // Todas las imágenes mapeadas:
                    'images' => $images,
                ];
            })
            ->toArray();

        // 3) Asignar el array completo de publicaciones al data:
        $data['publications'] = $publications;

        // 4) Devolver a Inertia:
        return Inertia::render('profile/publications', [
            'user' => $data,
        ]);
    }

    public function userSaved(User $user)
    {
        // 1) Datos comunes
        $data = $this->getCommonUserData($user);

        // 2) Cargar publicaciones guardadas (relación ‘saveds’) con imágenes
        $savedPubs = $user->saveds()
            ->with('images')            // para poder usar getImageUrlAttribute() en cada imagen
            ->orderBy('pivot_created_at', 'desc') // opcional: orden por cuando se guardó
            ->get()
            ->map(function ($pub) {
                // Obtener la primera imagen de la publicación
                $firstImage = $pub->images->first();
                return [
                    'id' => $pub->id,
                    'url' => $firstImage
                        ? $firstImage->getImageUrlAttribute()
                        : null,
                    // Puedes añadir más campos aquí: título, descripción, etc.
                ];
            })
            ->filter(fn($item) => $item['url'] !== null) // opcional: filtrar publicaciones sin imagen
            ->toArray();

        // 3) Asignar al array de datos
        $data['saveds'] = $savedPubs;
        $data['saveds_count'] = count($savedPubs);

        // 4) Renderizar Inertia con la vista 'profile/saveds'
        return Inertia::render('profile/saveds', [
            'user' => $data,
        ]);
    }
}
