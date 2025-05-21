<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePublicationHashtagsTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('publication_hashtags', function (Blueprint $table) {
            $table->unsignedBigInteger('publication_id');
            $table->unsignedBigInteger('hashtag_id');
            $table->primary(['publication_id', 'hashtag_id']);
            $table->timestamps();

            $table->foreign('publication_id')
                ->references('id')->on('publications')
                ->onDelete('cascade')
                ->onUpdate('cascade');

            $table->foreign('hashtag_id')
                ->references('id')->on('hashtags')
                ->onDelete('cascade')
                ->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('publication_hashtags');
    }
}
