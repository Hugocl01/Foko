<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Compartir datos de usuario autenticado y flash con Inertia
        Inertia::share([
            'auth' => function () {
                $user = Auth::user();

                return $user
                    ? [
                        'user' => [
                            'id' => $user->id,
                            'name' => $user->name,
                            'email' => $user->email,
                            'description' => $user->description,
                            'profile_image_url' => $user->profile_image_url,
                        ],
                    ]
                    : ['user' => null];
            },
            'flash' => function () {
                return [
                    'success' => session('success'),
                    'error' => session('error'),
                ];
            },
        ]);
    }
}
