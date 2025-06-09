<?php

use App\Http\Controllers\PublicationController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PresetController;
use App\Http\Controllers\PurchaseController;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

// Ruta raíz: protegida con 'guest' para que sólo la vean usuarios NO autenticados
Route::middleware('guest')->get('/', function () {
    return Inertia::render('welcome');
})->name('welcome');

// Si el usuario está autenticado, lo mandamos a 'home'
Route::middleware(['auth', 'verified'])->get('/home', function () {
    return Inertia::render('home');
})->name('home');

// Rutas protegidas por autenticación
Route::middleware(['auth', 'verified'])->group(function () {
    // Publicaciones
    Route::get('/publications', [PublicationController::class, 'index'])
        ->name('publications.index');

    Route::get('/publications/{publication}', [PublicationController::class, 'show'])
        ->name('publications.show');

    Route::post('publications/{publication}/like', [PublicationController::class, 'toggleLike'])
        ->name('publications.toggleLike');

    Route::post('publications/{publication}/save', [PublicationController::class, 'toggleSave'])
        ->name('publications.toggleSave');

    // Presets
    Route::get('/presets', [PresetController::class, 'index'])
        ->name('presets.index');

    Route::post('/presets', [PresetController::class, 'store'])
        ->name('presets.store');

    Route::get('/presets/{preset}', [PresetController::class, 'show'])
        ->name('presets.show');

    Route::patch('/presets/{preset}', [PresetController::class, 'update'])
        ->name('presets.update');

    Route::delete('/presets/{preset}', [PresetController::class, 'destroy'])
        ->name('presets.destroy');

    // Compras
    Route::get('/purchases', [PurchaseController::class, 'index'])
        ->name('purchases.index');

    Route::post('/presets/{preset}/purchase', [PurchaseController::class, 'store'])
        ->name('purchases.store');

    Route::get('/presets/{preset}/download', [PurchaseController::class, 'download'])
        ->name('purchases.download');

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
});

// Para mostrar la pagina de error 404
Route::fallback(function (Request $request) {
    return Inertia::render('errors/error404')
        ->toResponse($request)
        ->setStatusCode(Response::HTTP_NOT_FOUND);
});

// Archivos adicionales
require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/admin.php';
require __DIR__ . '/profile.php';
