<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Ruta Welcome (Landin Page)
Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Rutas protegidas por middleware
Route::middleware(['auth', 'verified'])->group(function () {
    // Ruta Inicio
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Ruta Publicaciones
    Route::get('publications', function () {
        return Inertia::render('publications');
    })->name('publications');

    // Ruta Presets
    Route::get('presets', function () {
        return Inertia::render('presets');
    })->name('presets');

    // Ruta Chats
    Route::get('chats', function () {
        return Inertia::render('chats');
    })->name('chats');

    // Ruta Notificaciones
    Route::get('notifications', function () {
        return Inertia::render('notifications');
    })->name('notifications');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
