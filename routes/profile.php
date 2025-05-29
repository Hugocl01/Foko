<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth')->group(function () {
    Route::redirect('profile', 'profile/publications');

    // Publicaciones
    Route::get('profile/publications', [UserController::class, 'userPublications'])->name('profile.publications.index');
    // Route::get('profile/presets', [UserController::class, 'index'])->name('profile.publications.index');
    // Route::get('profile/saved', [UserController::class, 'index'])->name('profile.publications.index');
});
