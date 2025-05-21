<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePresetHashtagsTable extends Migration
{
    public function up(): void
    {
        Schema::create('preset_hashtags', function (Blueprint $table) {
            $table->unsignedBigInteger('preset_id');
            $table->unsignedBigInteger('hashtag_id');
            $table->primary(['preset_id', 'hashtag_id']);
            $table->timestamps();

            $table->foreign('preset_id')
                ->references('id')->on('presets')
                ->onDelete('cascade')
                ->onUpdate('cascade');

            $table->foreign('hashtag_id')
                ->references('id')->on('hashtags')
                ->onDelete('cascade')
                ->onUpdate('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('preset_hashtags');
    }
}
