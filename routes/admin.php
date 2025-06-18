<?php
use App\Http\Controllers\UserController;
use App\Http\Controllers\NotificationController;
use Illuminate\Support\Facades\Route;

// Grupo de rutas protegidas por auth, verified y al final is_admin
Route::middleware(['auth', 'verified', 'is_admin'])
    ->group(function () {
        Route::redirect('admin', 'admin/users');

        // Usuarios
        Route::get('admin/users', [UserController::class, 'index'])->name('users.index');
        Route::post('admin/users', [UserController::class, 'store'])->name('users.store');
        Route::patch('admin/users/{user}', [UserController::class, 'update'])->name('users.update');
        Route::delete('admin/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');

        // Reportes
        Route::get('admin/reports', [NotificationController::class, 'reports'])
            ->name('reports.index');

        Route::delete('admin/reports/{report}', [NotificationController::class, 'destroyReport'])
            ->name('reports.destroy');
    });
