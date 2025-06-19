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
use Intervention\Image\Laravel\Facades\Image;
use Illuminate\Support\Str;

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

        // 1) Rellenar datos excepto la imagen
        $data = $request->validated();
        unset($data['profile_image']);
        $user->fill($data);

        // 2) Revocar verificación si cambió el email
        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        // 3) Procesar la nueva imagen si se subió
        if ($request->hasFile('profile_image')) {
            // Guardamos el nombre antiguo para borrarlo luego
            $old = $user->getOriginal('profile_image');

            // Leer, recortar+redimensionar a 300×300 y convertir a WebP (90%)
            $img = Image::read($request->file('profile_image')->getRealPath())
                ->cover(300, 300)
                ->encodeByExtension('webp', 90);

            // Generar nombre único y guardar
            $filename = Str::uuid() . '.webp';
            Storage::disk('profile_images')->put($filename, (string) $img);

            // Asignamos el nuevo nombre al modelo
            $user->profile_image = $filename;

            // Ahora borramos el antiguo (si existía y estaba en disco)
            if ($old && Storage::disk('profile_images')->exists($old)) {
                Storage::disk('profile_images')->delete($old);
            }
        }

        // 4) Guardar usuario
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
