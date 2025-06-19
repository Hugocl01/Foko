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

        // 1) Obtener likes y guardados del usuario
        $likedIds = DB::table('likes')->where('user_id', $user->id)->pluck('publication_id')->toArray();
        $savedIds = DB::table('saveds')->where('user_id', $user->id)->pluck('publication_id')->toArray();

        // 2) Definir query base para publicaciones
        $pubsQuery = Publication::with(['user', 'images', 'hashtags'])
            ->withCount(['likes', 'comments'])
            ->whereHas('user', fn($q) => $q->where('plan_id', '!=', 2)) // Solo usuarios premium
            ->orderBy('likes_count', 'desc')
            ->orderBy('created_at', 'desc');

        // Si sigue a alguien, filtramos por seguidos primero
        if (!empty($followed)) {
            $pubsQuery->whereIn('user_id', $followed);
        }

        $topPubs = $pubsQuery->take(5)->get();

        // Si no hay suficientes, rellenamos con otros premium
        if ($topPubs->count() < 5) {
            $fillCount = 5 - $topPubs->count();
            $excludedIds = $topPubs->pluck('id');
            $extra = Publication::with(['user', 'images', 'hashtags'])
                ->withCount(['likes', 'comments'])
                ->whereHas('user', fn($q) => $q->where('plan_id', '!=', 2))
                ->whereNotIn('id', $excludedIds)
                ->orderBy('likes_count', 'desc')
                ->orderBy('created_at', 'desc')
                ->take($fillCount)
                ->get();

            $topPubs = $topPubs->concat($extra);
        }

        $topPublications = $topPubs->map(function ($pub) use ($likedIds, $savedIds) {
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

        // 3) Presets Premium recientes
        $presetQuery = Preset::with(['user', 'hashtags'])
            ->whereHas('user', fn($q) => $q->where('plan_id', '!=', 2)) // Solo premium
            ->orderBy('created_at', 'desc');

        if (!empty($followed)) {
            $presetQuery->whereIn('user_id', $followed);
        }

        $presets = $presetQuery->take(5)->get();

        if ($presets->count() < 5) {
            $fillCount = 5 - $presets->count();
            $extraPresets = Preset::with(['user', 'hashtags'])
                ->whereHas('user', fn($q) => $q->where('plan_id', '!=', 2))
                ->whereNotIn('id', $presets->pluck('id'))
                ->orderBy('created_at', 'desc')
                ->take($fillCount)
                ->get();
            $presets = $presets->concat($extraPresets);
        }

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

        return Inertia::render('home', [
            'topPublications' => $topPublications,
            'premiumPresets' => $premiumPresets,
        ]);
    }
}
