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
        dd($user);

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
        dd($user);
    }
}
