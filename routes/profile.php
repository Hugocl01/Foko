<?php

use App\Http\Controllers\FollowController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth')->group(function () {
    // Redirige "/profile" a "/profile/{user}/publications"
    Route::get('profile', function () {
        return redirect()->route('profile.publications.index', auth()->user());
    });

    // Redirige "/profile/{user}" a "/profile/{user}/publications"
    Route::get('profile/{user}', function () {
        return redirect()->route('profile.publications.index', auth()->user());
    });

    // Publicaciones
    Route::get('profile/{user}/publications', [UserController::class, 'userPublications'])->name('profile.publications.index');

    // Presets
    Route::get('profile/{user}/presets', [UserController::class, 'userPresets'])->name('profile.presets.index');

    // Guardados
    Route::get('profile/{user}/saveds', [UserController::class, 'userSaved'])->name('profile.saved.index');

    // POST  /users/{id}/follow
    Route::post('/users/{id}/follow', [FollowController::class, 'follow'])
        ->whereNumber('id')
        ->name('users.follow');

    // DELETE /users/{id}/unfollow
    Route::delete('/users/{id}/unfollow', [FollowController::class, 'unfollow'])
        ->whereNumber('id')
        ->name('users.unfollow');
});
