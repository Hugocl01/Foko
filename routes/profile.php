<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth')->group(function () {
    // 1) Redirige "/profile" a "/profile/publications/{id}"
    Route::get('profile', function () {
        return redirect()->route('profile.publications.index', auth()->id());
    });

    // Publicaciones
    Route::get('profile/{user}/publications', [UserController::class, 'userPublications'])->name('profile.publications.index');
    // Route::get('profile/presets', [UserController::class, 'index'])->name('profile.publications.index');
    // Route::get('profile/saved', [UserController::class, 'index'])->name('profile.publications.index');
});
