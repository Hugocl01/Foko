<?php

namespace App\Http\Controllers;

use App\Models\Preset;
use App\Models\Hashtag;
use App\Models\Publication;
use Illuminate\Http\Request;
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
        return Inertia::render('Presets/Create');
    }

    /**
     * Guarda el nuevo preset en la base de datos.
     */
    public function store(Request $request)
    {
        // 1) Validar todos los campos
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:255',
            'price' => 'required|numeric|min:0',
            'before_image' => 'required|image',
            'after_image' => 'required|image',
            'file' => 'required|file|max:10240',  // máx. 10 MB
        ]);

        // 2) Crear instancia de Preset y llenar campos básicos
        $preset = new Preset();
        $preset->name = $validated['name'];
        $preset->description = $validated['description'] ?? '';
        $preset->price = $validated['price'];
        $preset->user_id = Auth::id();
        // (no guardamos aún)

        // 3) Procesar “before_image” (Intervention Image → WebP 800×800)
        if ($request->hasFile('before_image')) {
            $beforeUploaded = $request->file('before_image');

            $imgBefore = Image::read($beforeUploaded->getRealPath())
                ->cover(800, 800)
                ->encodeByExtension('webp', 80);

            $beforeName = Str::uuid() . '.webp';
            // Guardarlo en disco 'preset_images' (configurado en filesystems)
            Storage::disk('preset_images')->put($beforeName, (string) $imgBefore);
            $preset->before_image = $beforeName;
        }

        // 4) Procesar “after_image” (misma lógica)
        if ($request->hasFile('after_image')) {
            $afterUploaded = $request->file('after_image');

            $imgAfter = Image::read($afterUploaded->getRealPath())
                ->cover(800, 800)
                ->encodeByExtension('webp', 80);

            $afterName = Str::uuid() . '.webp';
            Storage::disk('preset_images')->put($afterName, (string) $imgAfter);
            $preset->after_image = $afterName;
        }

        // 5) Guardar el archivo del preset (solo el nombre en la BD)
        if ($request->hasFile('file')) {
            $presetFile = $request->file('file');
            $originalExt = $presetFile->getClientOriginalExtension();
            $presetName = Str::uuid() . ".{$originalExt}";

            // a) Obtener contenido binario
            $content = file_get_contents($presetFile->getRealPath());

            // b) Hacer put() directamente con ese contenido, usando $presetName
            //    Esto lo guardará en: storage/app/public/presets/{presetName}
            Storage::disk('presets')->put($presetName, $content);

            // c) En la BD solo guardamos el nombre (sin carpetas)
            $preset->file = $presetName;
        }

        // 6) Guardar el preset con before_image, after_image y file ya asignados
        $preset->save();

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
        // 1. Validar datos básicos (sin archivos por ahora)
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric',
            'file' => 'nullable|file|mimes:lrtemplate,xml,xmp,dng',
            'before_image' => 'nullable|image',
            'after_image' => 'nullable|image',
            'hashtags' => 'nullable|string', // JSON con arreglo de nombres
        ]);

        // 2. Actualizar campos de texto
        $preset->name = $validated['name'];
        $preset->description = $validated['description'];
        $preset->price = $validated['price'];

        // 3. Manejar archivo principal de preset
        if ($request->hasFile('file')) {
            // Borrar archivo antiguo si existía
            if ($preset->file && Storage::exists($preset->file)) {
                Storage::delete($preset->file);
            }
            // Guardar nuevo archivo
            $archivo = $request->file('file');
            $nombreArchivo = Str::uuid()->toString() . '.' . $archivo->getClientOriginalExtension();
            $rutaArchivo = $archivo->storeAs('presets/files', $nombreArchivo);
            $preset->file = $rutaArchivo;
        }
        // Si no viene nuevo 'file', dejamos el valor previo (no hacemos nada)

        // 4. Manejar imagen 'before_image'
        if ($request->hasFile('before_image')) {
            // Borrar imagen antigua si existía
            if ($preset->before_image && Storage::exists($preset->before_image)) {
                Storage::delete($preset->before_image);
            }
            // Guardar nueva imagen
            $imgAntes = $request->file('before_image');
            $nombreAntes = Str::uuid()->toString() . '.' . $imgAntes->getClientOriginalExtension();
            $rutaAntes = $imgAntes->storeAs('presets/images/before', $nombreAntes);
            $preset->before_image = $rutaAntes;
        }
        // Si no viene nuevo 'before_image', mantenemos el valor anterior

        // 5. Manejar imagen 'after_image'
        if ($request->hasFile('after_image')) {
            // Borrar imagen antigua si existía
            if ($preset->after_image && Storage::exists($preset->after_image)) {
                Storage::delete($preset->after_image);
            }
            // Guardar nueva imagen
            $imgDespues = $request->file('after_image');
            $nombreDespues = Str::uuid()->toString() . '.' . $imgDespues->getClientOriginalExtension();
            $rutaDespues = $imgDespues->storeAs('presets/images/after', $nombreDespues);
            $preset->after_image = $rutaDespues;
        }
        // Si no viene nuevo 'after_image', mantenemos el valor anterior

        // 6. Guardar cambios en la tabla 'presets'
        $preset->save();

        // 7. Sincronizar hashtags
        if (!empty($validated['hashtags'])) {
            // 'hashtags' llega como JSON-string; convertir a arreglo de nombres
            $nombres = json_decode($validated['hashtags'], true);
            if (is_array($nombres)) {
                $hashtagIds = [];
                foreach ($nombres as $nombre) {
                    // Normalizar: eliminar #
                    $cleanName = ltrim(trim($nombre), '#');
                    if (empty($cleanName)) {
                        continue;
                    }
                    // Buscar o crear el hashtag
                    $tag = Hashtag::firstOrCreate(
                        ['slug' => Str::slug($cleanName)],
                        ['name' => $cleanName]
                    );
                    $hashtagIds[] = $tag->id;
                }
                // Asociar únicamente los IDs resultantes
                $preset->hashtags()->sync($hashtagIds);
            }
        } else {
            // Si envían hashtags como cadena vacía o null, se remueven todas las asociaciones
            $preset->hashtags()->detach();
        }

        // 8. Redirigir o devolver respuesta JSON según convenga
        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'Preset actualizado correctamente',
                'preset' => $preset->load('hashtags'),
            ]);
        }

        return redirect()
            ->route('presets.show', ['preset' => $preset->id])
            ->with('success', 'Preset actualizado con éxito');
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
