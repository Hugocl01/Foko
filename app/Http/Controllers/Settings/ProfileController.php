<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Facades\Image;

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Update the user's profile settings.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {

        $user = $request->user();

        // Llenar campos excepto la imagen
        $user->fill($request->safe()->except('profile_image_url'));

        // Si se cargó una imagen
        if ($request->hasFile('profile_image_url')) {
            $image = $request->file('profile_image_url');

            // Eliminar imagen anterior si existe
            if ($user->profile_image_url && Storage::disk('images')->exists(basename($user->profile_image_url))) {
                Storage::disk('images')->delete(basename($user->profile_image_url));
            }

            // Crear nombre único con .webp
            $filename = 'avatar_' . $user->id . '_' . time() . '.webp';

            // Procesar imagen: redimensionar a ancho 600px, mantener proporción, codificar a WebP
            $resizedImage = Image::make($image)
                ->resize(600, null, function ($constraint) {
                    $constraint->aspectRatio();
                    $constraint->upsize();
                })
                ->encode('webp', 80); // <-- convierte a WebP con calidad 80

            // Guardar en disco 'images'
            Storage::disk('images')->put($filename, $resizedImage);

            // Guardar ruta relativa
            $user->profile_image_url = "images/{$filename}";
        }

        // Si cambió el email, se invalida la verificación
        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        return to_route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
