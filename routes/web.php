<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\NotificationController;

// Página pública (Landing Page)
Route::get('/', function () {
    return Inertia::
        render('welcome');
})->name('home');

// Rutas protegidas por autenticación
Route::middleware(['auth', 'verified'])->group(function () {

    // Dashboard
    Route::get('/home', function () {
        return Inertia::render('home');
    })->name('home');

    // Publicaciones
    Route::get('/publications', function () {
        return Inertia::render('publications');
    })->name('publications.index');

    Route::get('/publications/{id}', function ($id) {
        return Inertia::render('publication', ['id' => $id]);
    })->name('publications.show');

    // Presets
    Route::get('/presets', function () {
        return Inertia::render('presets');
    })->name('presets.index');

    Route::get('/presets/{id}', function ($id) {
        return Inertia::render('preset', ['id' => $id]);
    })->name('presets.show');

    // Chats
    Route::get('/chats', function () {
        return Inertia::render('chats');
    })->name('chats.index');

    Route::get('/chats/{id}', function ($id) {
        return Inertia::render('chat', ['id' => $id]);
    })->name('chats.show');

    // Notificaciones
    Route::get('/notifications', [NotificationController::class, 'index'])
        ->name('notifications.index');

    Route::delete('/notifications/{notification}', [NotificationController::class, 'destroy'])
        ->name('notifications.destroy');

    // Compras
    Route::get('/purchases', function () {
        return Inertia::render('purchases');
    })->name('purchases.index');

    // Usuarios
    Route::get('/users', function () {
        return Inertia::render('users');
    })->name('users.index');

    // Reportes
    Route::get('/reports', [NotificationController::class, 'index'])
        ->name('reports.index');
});

// Archivos adicionales
require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
