<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Publication;
use App\Models\Preset;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class FeedController extends Controller
{
    /**
     * Display the feed with top publications and premium presets from followed users.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $user = Auth::user();
        $followed = $user->following()->pluck('id')->toArray();

        if (empty($followed)) {
            return Inertia::render('home', [
                'topPublications' => collect(),
                'premiumPresets' => collect(),
            ]);
        }

        // 1) Obtener IDs de publicaciones que el usuario ya ha marcado como "like"
        $likedIds = DB::table('likes')
            ->where('user_id', $user->id)
            ->pluck('publication_id')
            ->toArray();

        // 2) Obtener IDs de publicaciones que el usuario ya ha "guardado"
        $savedIds = DB::table('saveds')
            ->where('user_id', $user->id)
            ->pluck('publication_id')
            ->toArray();

        //
        // 3) TOP 5 PUBLICACIONES PREMIUM (plan_id != 2), por likes y fecha
        //
        $premiumPubsQ = Publication::with(['user', 'images', 'hashtags'])
            ->withCount('likes')
            ->whereIn('user_id', $followed)
            ->whereHas('user', fn($q) => $q->where('plan_id', '!=', 2))
            ->orderBy('likes_count', 'desc')
            ->orderBy('created_at', 'desc');

        $topPubs = $premiumPubsQ->take(5)->get();

        // Rellenar si hay menos de 5
        if ($topPubs->count() < 5) {
            $fillCount = 5 - $topPubs->count();
            $fill = Publication::with(['user', 'images', 'hashtags'])
                ->whereIn('user_id', $followed)
                ->whereNotIn('id', $topPubs->pluck('id'))
                ->orderBy('created_at', 'desc')
                ->take($fillCount)
                ->get();
            $topPubs = $topPubs->concat($fill);
        }

        // 4) Transformación para Inertia, incluyendo liked y saved
        $topPublications = $topPubs->map(function ($pub) use ($likedIds, $savedIds) {
            // Generar URL de cada imagen
            $pub->images->transform(fn($img) => tap($img, fn($i) => $i->url = $i->getImageUrlAttribute()));

            return [
                'id' => $pub->id,
                'user' => [
                    'id' => $pub->user->id,
                    'name' => $pub->user->name,
                    'username' => $pub->user->username,
                    'profile_image' => $pub->user->getProfileImageUrlAttribute(),
                    'plan_id' => $pub->user->plan_id,
                ],
                'images' => $pub->images->map(fn($img) => [
                    'id' => $img->id,
                    'url' => $img->url,
                ])->all(),
                'hashtags' => $pub->hashtags->map(fn($tag) => [
                    'id' => $tag->id,
                    'name' => $tag->name,
                    'slug' => $tag->slug,
                ])->all(),
                'likes_count' => $pub->likes_count,
                'comments_count' => $pub->comments_count,
                'liked' => in_array($pub->id, $likedIds),
                'saved' => in_array($pub->id, $savedIds),
                'title' => $pub->title,
                'description' => $pub->description,
                'created_at' => $pub->created_at->toDateTimeString(),
            ];
        });

        //
        // 5) TOP 5 PRESETS PREMIUM (plan_id != 2) por fecha
        //
        $premiumPresetsQ = Preset::with(['user', 'hashtags'])
            ->whereIn('user_id', $followed)
            ->whereHas('user', fn($q) => $q->where('plan_id', '!=', 2))
            ->orderBy('created_at', 'desc');

        $presets = $premiumPresetsQ->take(5)->get();

        // Rellenar si hay menos de 5
        if ($presets->count() < 5) {
            $fillCount = 5 - $presets->count();
            $fillPresets = Preset::with(['user', 'hashtags'])
                ->whereIn('user_id', $followed)
                ->whereNotIn('id', $presets->pluck('id'))
                ->orderBy('created_at', 'desc')
                ->take($fillCount)
                ->get();
            $presets = $presets->concat($fillPresets);
        }

        // Transformación para Inertia
        $premiumPresets = $presets->map(fn($preset) => [
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
            'hashtags' => $preset->hashtags->map(fn($tag) => [
                'id' => $tag->id,
                'name' => $tag->name,
                'slug' => $tag->slug,
            ])->all(),
            'created_at' => $preset->created_at->toDateTimeString(),
        ]);

        // 6) Renderizar con las props para React
        return Inertia::render('home', [
            'topPublications' => $topPublications,
            'premiumPresets' => $premiumPresets,
        ]);
    }
}
