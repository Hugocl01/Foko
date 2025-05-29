<?php

namespace App\Http\Controllers;

use App\Models\Preset;
use App\Models\Hashtag;
use App\Models\Publication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PresetController extends Controller
{
    /**
     * Muestra todos los presets.
     */
    public function index()
    {
        $presets = Preset::with(['user:id,name,username,profile_image', 'hashtags:id,name'])
            ->latest()
            ->paginate(12)
            ->through(fn($preset) => [
                'id' => $preset->id,
                'name' => $preset->name,
                'description' => $preset->description,
                'price' => $preset->price,
                'before_image' => $preset->getBeforeImageUrlAttribute(),
                'after_image' => $preset->getAfterImageUrlAttribute(),
                'user' => [
                    'id' => $preset->user->id,
                    'name' => $preset->user->name,
                    'username' => $preset->user->username,
                    'profile_image' => $preset->user->getProfileImageUrlAttribute(),
                ],
                'hashtags' => $preset->hashtags->pluck('name'),
                'created_at' => $preset->created_at->format('Y-m-d'),
            ]);

        return Inertia::render('presets', [
            'presets' => $presets,
        ]);
    }

    public function presetsByUser($userId)
    {
        $presets = Preset::with(['hashtags', 'user'])
            ->where('user_id', $userId)
            ->latest()
            ->get();

        return Inertia::render('Presets/UserPresets', [
            'presets' => $presets,
        ]);
    }

    /**
     * Formulario para crear un nuevo preset.
     */
    public function create()
    {
        return Inertia::render('Presets/Create', [
            'hashtags' => Hashtag::all(),
        ]);
    }

    /**
     * Guarda el nuevo preset en la base de datos.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:255',
            'price' => 'required|numeric|min:0',
            'file_path' => 'required|string|max:255',
            'hashtag_ids' => 'nullable|array',
        ]);

        $preset = Preset::create([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'price' => $validated['price'],
            'file_path' => $validated['file_path'],
            'user_id' => Auth::id(),
        ]);

        if (!empty($validated['hashtag_ids'])) {
            $preset->hashtags()->sync($validated['hashtag_ids']);
        }

        return redirect()->route('presets.index')->with('success', 'Preset creado correctamente.');
    }

    /**
     * Muestra un preset específico.
     */
    public function show(Preset $preset)
    {
        // Cargamos relaciones necesarias
        $preset->load(['user', 'hashtags', 'purchases']);

        // Preparamos el array con las URLs y datos que necesitas en Vue/React
        return Inertia::render('preset', [
            'preset' => [
                'id' => $preset->id,
                'name' => $preset->name,
                'description' => $preset->description,
                'price' => $preset->price,
                // Aquí usamos tus accessors para obtener la URL completa
                'before_image' => $preset->getBeforeImageUrlAttribute(),
                'after_image' => $preset->getAfterImageUrlAttribute(),
                'file' => $preset->file,
                'user' => [
                    'id' => $preset->user->id,
                    'name' => $preset->user->name,
                    'username' => $preset->user->username,
                    'profile_image' => $preset->user->getProfileImageUrlAttribute(),
                ],
                'hashtags' => $preset->hashtags,
                'purchases' => $preset->purchases->map(fn($p) => [
                    'id' => $p->id,
                    'user' => $p->user->only('id', 'name', 'username'),
                    'created_at' => $p->created_at->toDateTimeString(),
                ]),
                'created_at' => $preset->created_at->toDateTimeString(),
            ],
        ]);
    }

    /**
     * Formulario para editar un preset.
     */
    public function edit(Preset $preset)
    {
        return Inertia::render('Presets/Edit', [
            'preset' => $preset->load('hashtags'),
            'hashtags' => Hashtag::all(),
        ]);
    }

    /**
     * Actualiza un preset.
     */
    public function update(Request $request, Preset $preset)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:255',
            'price' => 'required|numeric|min:0',
            'file_path' => 'required|string|max:255',
            'hashtag_ids' => 'nullable|array',
        ]);

        $preset->update($validated);
        $preset->hashtags()->sync($validated['hashtag_ids'] ?? []);

        return redirect()->route('presets.index')->with('success', 'Preset actualizado correctamente.');
    }

    /**
     * Elimina un preset.
     */
    public function destroy(Preset $preset)
    {
        $preset->delete();

        return redirect()->route('presets.index')->with('success', 'Preset eliminado.');
    }
}
