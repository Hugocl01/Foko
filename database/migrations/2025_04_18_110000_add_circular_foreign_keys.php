<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Añade las FKs circulares que antes no existían
        Schema::table('presets', function (Blueprint $table) {
            $table->foreign('before_image_id')
                ->references('id')->on('images')
                ->nullOnDelete();
            $table->foreign('after_image_id')
                ->references('id')->on('images')
                ->nullOnDelete();
        });

        Schema::table('publications', function (Blueprint $table) {
            $table->foreign('preset_id')
                ->references('id')->on('presets')
                ->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('presets', function (Blueprint $table) {
            $table->dropForeign(['before_image_id']);
            $table->dropForeign(['after_image_id']);
        });

        Schema::table('publications', function (Blueprint $table) {
            $table->dropForeign(['preset_id']);
        });
    }
};
