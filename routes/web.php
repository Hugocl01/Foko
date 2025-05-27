<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PresetController;
use App\Http\Controllers\PurchaseController;

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
    Route::get('/presets', [PresetController::class, 'index'])
        ->name('presets.index');

    Route::get('/presets/{preset}', [PresetController::class, 'show'])
        ->name('presets.show');

    Route::post('/presets/{preset}/purchase', [PurchaseController::class, 'store'])
        ->name('purchases.store');

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
    Route::get('/purchases', [PurchaseController::class, 'index'])->name('purchases.index');
});

// Archivos adicionales
require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/admin.php';
require __DIR__ . '/profile.php';
