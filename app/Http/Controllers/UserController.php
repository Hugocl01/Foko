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

    public function userPublications(User $user)
    {
        // 1) Carga relaciones
        $user->load([
            'plan',
            'followers',
            'following',
            'publications',
            'presets',
            'purchases',
        ]);

        // 2) Convertimos atributos a array
        $data = $user->attributesToArray();

        // 3) Añadimos campos “append” y relaciones
        $data['profile_image_url'] = $user->profile_image_url;
        $data['plan'] = $user->plan;
        $data['followers'] = $user->followers->map(fn($f) => [
            'id' => $f->id,
            'name' => $f->name,
            'avatar_url' => $f->avatar_url,
        ])->toArray();
        $data['following'] = $user->following->map(fn($f) => [
            'id' => $f->id,
            'name' => $f->name,
            'avatar_url' => $f->avatar_url,
        ])->toArray();
        $data['publications'] = $user->publications->map(fn($pub) => [
            'id' => $pub->id,
            'url' => $pub->url,
        ])->toArray();
        $data['presets'] = $user->presets;
        $data['purchases'] = $user->purchases;

        // 4) Bandera para saber si es el perfil propio
        $data['isOwnProfile'] = $user->id === Auth::id();

        // 5) (Opcional) Si ya estás guardando isFollowing en alguna tabla,
        //    aquí podrías calcularlo. Para simplificar, lo dejamos false.
        $data['isFollowing'] = Auth::user()
            ? Auth::user()->following->contains($user->id)
            : false;

        // 6) Retornamos todo a Inertia
        return Inertia::render('profile/publications', [
            'user' => $data,
        ]);
    }

    public function userPresets(User $user)
    {
        // 1) Carga relaciones (similares a userPublications)
        $user->load([
            'plan',
            'followers',
            'following',
            'publications',
            'presets',
            'purchases',
        ]);

        // 2) Convertimos atributos a array
        $data = $user->attributesToArray();

        // 3) Añadimos campos “append” y relaciones
        $data['profile_image_url'] = $user->profile_image_url;
        $data['plan'] = $user->plan;
        $data['followers'] = $user->followers->map(fn($f) => [
            'id' => $f->id,
            'name' => $f->name,
            'avatar_url' => $f->avatar_url,
        ])->toArray();
        $data['following'] = $user->following->map(fn($f) => [
            'id' => $f->id,
            'name' => $f->name,
            'avatar_url' => $f->avatar_url,
        ])->toArray();
        $data['publications'] = $user->publications->map(fn($pub) => [
            'id' => $pub->id,
            'url' => $pub->url,
        ])->toArray();
        $data['presets'] = $user->presets->map(fn($preset) => [
            'id' => $preset->id,
            'url' => $preset->url,
        ])->toArray();
        $data['purchases'] = $user->purchases->map(fn($purchase) => [
            'id' => $purchase->id,
            'preset_id' => $purchase->preset_id,
            'amount' => $purchase->amount,
        ])->toArray();

        // 4) Bandera para saber si es el perfil propio
        $data['isOwnProfile'] = $user->id === Auth::id();

        // 5) Calculamos si el usuario autenticado ya sigue a este perfil
        $data['isFollowing'] = Auth::user()
            ? Auth::user()->following->contains($user->id)
            : false;

        // 6) Retornamos todo a Inertia (vista: presets)
        return Inertia::render('profile/presets', [
            'user' => $data,
        ]);
    }

    public function userSaved(User $user)
    {
        // 1) Carga relaciones. Asumimos que existe una relación 'saveds'
        //    en el modelo User que trae las publicaciones guardadas por el usuario.
        $user->load([
            'plan',
            'followers',
            'following',
            'publications',
            'presets',
            'purchases',
            'saveds', // Asegúrate de definir esta relación en el modelo User
        ]);

        // 2) Convertimos atributos a array
        $data = $user->attributesToArray();

        // 3) Añadimos campos “append” y relaciones
        $data['profile_image_url'] = $user->profile_image_url;
        $data['plan'] = $user->plan;
        $data['followers'] = $user->followers->map(fn($f) => [
            'id' => $f->id,
            'name' => $f->name,
            'avatar_url' => $f->avatar_url,
        ])->toArray();
        $data['following'] = $user->following->map(fn($f) => [
            'id' => $f->id,
            'name' => $f->name,
            'avatar_url' => $f->avatar_url,
        ])->toArray();
        $data['publications'] = $user->publications->map(fn($pub) => [
            'id' => $pub->id,
            'url' => $pub->url,
        ])->toArray();
        $data['presets'] = $user->presets->map(fn($preset) => [
            'id' => $preset->id,
            'url' => $preset->url,
        ])->toArray();
        $data['purchases'] = $user->purchases->map(fn($purchase) => [
            'id' => $purchase->id,
            'preset_id' => $purchase->preset_id,
            'amount' => $purchase->amount,
        ])->toArray();

        // 3.1) Mapeamos las publicaciones guardadas en un array sencillo:
        $data['saveds'] = $user->saveds->map(fn($saved) => [
            'id' => $saved->id,
            'url' => $saved->url,
        ])->toArray();

        // 4) Bandera para saber si es el perfil propio
        $data['isOwnProfile'] = $user->id === Auth::id();

        // 5) Calculamos si el usuario autenticado ya sigue a este perfil
        $data['isFollowing'] = Auth::user()
            ? Auth::user()->following->contains($user->id)
            : false;

        // 6) Retornamos todo a Inertia (vista: saved)
        return Inertia::render('profile/saveds', [
            'user' => $data,
        ]);
    }
}
