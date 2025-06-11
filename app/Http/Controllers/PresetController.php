<?php

namespace App\Http\Controllers;

use App\Models\Preset;
use App\Models\Hashtag;
use App\Models\Publication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Laravel\Facades\Image;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PresetController extends Controller
{
    /**
     * Muestra todos los presets.
     */
    public function index()
    {
        // 1) Obtenemos los 12 presets más recientes, con relaciones
        $paginator = Preset::with([
            'user:id,name,username,profile_image,plan_id',
            'hashtags:id,name'
        ])
            ->latest()
            ->paginate(12);

        // 2) Reordenamos SOLO los 12 items de esta página:
        //    plan_id != 2 → premium → prioridad 0
        //    plan_id == 2 → normal  → prioridad 1
        $reordered = $paginator->getCollection()
            ->sortBy(fn($preset) => $preset->user->plan_id == 2 ? 1 : 0)
            ->values();

        // 3) Transformamos a la forma que usa Inertia y volvemos a inyectar la colección
        $mapped = $reordered->map(fn($preset) => [
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
                'plan_id' => $preset->user->plan_id,
            ],
            'hashtags' => $preset->hashtags->pluck('name'),
            'created_at' => $preset->created_at->format('Y-m-d'),
        ]);

        $paginator->setCollection($mapped);

        // 4) Enviamos el paginator ya con items reordenados
        return Inertia::render('presets', [
            'presets' => $paginator,
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
        return Inertia::render('Presets/Create');
    }

    /**
     * Guarda el nuevo preset en la base de datos.
     */
    public function store(Request $request)
    {
        // 1) Validar todos los campos, incluyendo hashtags
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:255',
            'price' => 'required|numeric|min:0',
            'before_image' => 'required|image',
            'after_image' => 'required|image',
            'file' => 'required|file|max:10240', // 10 MB
            'hashtags' => 'nullable',            // acepta array o JSON
            'hashtags.*' => 'string|max:255',
        ]);

        // Para limpiar en caso de rollback
        $createdImages = [];
        $createdPresetFile = null;

        DB::beginTransaction();
        try {
            // 2) Instanciar Preset
            $preset = new Preset();
            $preset->name = $validated['name'];
            $preset->description = $validated['description'] ?? '';
            $preset->price = $validated['price'];
            $preset->user_id = Auth::id();

            // 3) Procesar “before_image”
            if ($request->hasFile('before_image')) {
                $beforeUploaded = $request->file('before_image');
                $imgBefore = Image::read($beforeUploaded->getRealPath())
                    ->encodeByExtension('webp', 80);
                $beforeName = Str::uuid() . '.webp';
                Storage::disk('preset_images')->put($beforeName, (string) $imgBefore);
                $preset->before_image = $beforeName;
                $createdImages[] = $beforeName;
            }

            // 4) Procesar “after_image”
            if ($request->hasFile('after_image')) {
                $afterUploaded = $request->file('after_image');
                $imgAfter = Image::read($afterUploaded->getRealPath())
                    ->encodeByExtension('webp', 80);
                $afterName = Str::uuid() . '.webp';
                Storage::disk('preset_images')->put($afterName, (string) $imgAfter);
                $preset->after_image = $afterName;
                $createdImages[] = $afterName;
            }

            // 5) Guardar el archivo del preset
            if ($request->hasFile('file')) {
                $presetFile = $request->file('file');
                $originalExt = $presetFile->getClientOriginalExtension();
                $presetName = Str::uuid() . ".{$originalExt}";
                $content = file_get_contents($presetFile->getRealPath());
                Storage::disk('presets')->put($presetName, $content);
                $preset->file = $presetName;
                $createdPresetFile = $presetName;
            }

            // 6) Guardar el preset en la BD
            $preset->save();

            // 7) Sincronizar hashtags
            if ($request->filled('hashtags')) {
                $nombres = is_array($validated['hashtags'])
                    ? $validated['hashtags']
                    : json_decode($validated['hashtags'], true);

                if (is_array($nombres)) {
                    $hashtagIds = [];
                    foreach ($nombres as $nombre) {
                        $clean = ltrim(trim($nombre), '#');
                        if (empty($clean)) {
                            continue;
                        }
                        $tag = Hashtag::firstOrCreate(
                            ['slug' => Str::slug($clean)],
                            ['name' => $clean]
                        );
                        $hashtagIds[] = $tag->id;
                    }
                    $preset->hashtags()->sync($hashtagIds);
                }
            } else {
                $preset->hashtags()->detach();
            }

            DB::commit();

        } catch (\Exception $e) {
            DB::rollBack();
            // Limpiar archivos grabados en disco
            foreach ($createdImages as $img) {
                Storage::disk('preset_images')->delete($img);
            }
            if ($createdPresetFile) {
                Storage::disk('presets')->delete($createdPresetFile);
            }
            return back()
                ->withInput()
                ->withErrors(['error' => 'Error al crear el preset: ' . $e->getMessage()]);
        }

        // 8) Redirigir con mensaje de éxito
        return redirect()
            ->route('presets.index')
            ->with('success', 'Preset creado correctamente.');
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
                    'plan_id' => $preset->user->plan_id,
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
        // 1) Validar todos los campos (archivos son nullable aquí)
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:255',
            'price' => 'required|numeric|min:0',
            'before_image' => 'nullable|image',
            'after_image' => 'nullable|image',
            'file' => 'nullable|file|max:10240', // 10 MB
            'hashtags' => 'nullable',            // acepta array o JSON
            'hashtags.*' => 'string|max:255',
        ]);

        // Para limpiar en caso de rollback
        $createdImages = [];
        $createdPresetFile = null;

        DB::beginTransaction();
        try {
            // 2) Actualizar campos básicos
            $preset->name = $validated['name'];
            $preset->description = $validated['description'] ?? '';
            $preset->price = $validated['price'];
            // user_id no cambia

            // 3) Procesar “before_image” si se envía uno nuevo
            if ($request->hasFile('before_image')) {
                // Guardar nuevo
                $beforeUploaded = $request->file('before_image');
                $imgBefore = Image::read($beforeUploaded->getRealPath())
                    ->encodeByExtension('webp', 80);
                $beforeName = Str::uuid()->toString() . '.webp';
                Storage::disk('preset_images')->put($beforeName, (string) $imgBefore);
                $createdImages[] = $beforeName;

                // Borrar el anterior
                if (
                    $preset->before_image &&
                    Storage::disk('preset_images')->exists($preset->before_image)
                ) {
                    Storage::disk('preset_images')->delete($preset->before_image);
                }

                $preset->before_image = $beforeName;
            }

            // 4) Procesar “after_image” si se envía uno nuevo
            if ($request->hasFile('after_image')) {
                // Guardar nuevo
                $afterUploaded = $request->file('after_image');
                $imgAfter = Image::read($afterUploaded->getRealPath())
                    ->encodeByExtension('webp', 80);
                $afterName = Str::uuid()->toString() . '.webp';
                Storage::disk('preset_images')->put($afterName, (string) $imgAfter);
                $createdImages[] = $afterName;

                // Borrar el anterior
                if (
                    $preset->after_image &&
                    Storage::disk('preset_images')->exists($preset->after_image)
                ) {
                    Storage::disk('preset_images')->delete($preset->after_image);
                }

                $preset->after_image = $afterName;
            }

            // 5) Procesar “file” (archivo del preset) si se envía uno nuevo
            if ($request->hasFile('file')) {
                // Guardar nuevo
                $presetFile = $request->file('file');
                $originalExt = $presetFile->getClientOriginalExtension();
                $presetName = Str::uuid()->toString() . ".{$originalExt}";
                $content = file_get_contents($presetFile->getRealPath());
                Storage::disk('presets')->put($presetName, $content);
                $createdPresetFile = $presetName;

                // Borrar el anterior
                if (
                    $preset->file &&
                    Storage::disk('presets')->exists($preset->file)
                ) {
                    Storage::disk('presets')->delete($preset->file);
                }

                $preset->file = $presetName;
            }

            // 6) Guardar cambios en la tabla presets
            $preset->save();

            // 7) Sincronizar hashtags
            if (!empty($validated['hashtags'])) {
                $nombres = is_array($validated['hashtags'])
                    ? $validated['hashtags']
                    : json_decode($validated['hashtags'], true);

                if (is_array($nombres)) {
                    $hashtagIds = [];
                    foreach ($nombres as $nombre) {
                        $clean = ltrim(trim($nombre), '#');
                        if (empty($clean)) {
                            continue;
                        }
                        $tag = Hashtag::firstOrCreate(
                            ['slug' => Str::slug($clean)],
                            ['name' => $clean]
                        );
                        $hashtagIds[] = $tag->id;
                    }
                    $preset->hashtags()->sync($hashtagIds);
                }
            } else {
                $preset->hashtags()->detach();
            }

            DB::commit();

        } catch (\Exception $e) {
            DB::rollBack();

            // Limpiar los archivos nuevos en disco
            foreach ($createdImages as $img) {
                Storage::disk('preset_images')->delete($img);
            }
            if ($createdPresetFile) {
                Storage::disk('presets')->delete($createdPresetFile);
            }

            return back()
                ->withInput()
                ->withErrors(['error' => 'Error al actualizar el preset: ' . $e->getMessage()]);
        }

        // 8) Responder según corresponda o redirigir con éxito
        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'Preset actualizado correctamente',
                'preset' => $preset->load('hashtags'),
            ]);
        }

        return redirect()
            ->route('presets.show', ['preset' => $preset->id])
            ->with('success', 'Preset actualizado con éxito.');
    }

    /**
     * Elimina un preset.
     * Solo el creador puede borrarlo.
     */
    public function destroy(Request $request, Preset $preset)
    {
        // 1) Comprobar que el usuario autenticado es el creador
        if (Auth::id() !== $preset->user_id) {
            abort(403, 'No tienes permiso para eliminar este preset.');
        }

        // 2) Rorrar también las imágenes y el archivo asociado:
        Storage::disk('preset_images')->delete([$preset->before_image, $preset->after_image]);
        Storage::disk('presets')->delete($preset->file);

        // 3) Eliminar el preset de la base de datos
        $preset->delete();

        // 4) Redirigir con mensaje de éxito
        return redirect()
            ->route('presets.index')
            ->with('success', 'Preset eliminado correctamente.');
    }
}
