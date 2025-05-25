<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth')->group(function () {
    Route::redirect('profile', 'profile/publications');

    // Publicaciones
    Route::get('profile/publications', [UserController::class, 'index'])->name('publications.index');

});
