<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified', 'is_admin' ])->group(function () {
    Route::redirect('admin', 'admin/users');

    // Usuarios
    Route::get('admin/users', [UserController::class, 'index'])->name('users.index');
    Route::post('admin/users', [UserController::class, 'store'])->name('users.store');
    Route::patch('admin/users/{user}', [UserController::class, 'update'])->name('users.update');
    Route::delete('admin/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');

    // Reportes
    Route::get('admin/reports', function () {
        return Inertia::render('admin/reports');
    })->name('reports.index');
});
