<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateNotificationsTable extends Migration
{
    public function up()
    {
        Schema::disableForeignKeyConstraints();
        Schema::create('notifications', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('recipient_id');
            $table->unsignedBigInteger('actor_id');
            $table->enum('type', ['like','comment','follow','message','purchase','report']);
            $table->enum('entity_type', ['publication','comment','user','preset']);
            $table->unsignedBigInteger('entity_id');
            $table->string('reason', 255)->nullable();
            $table->enum('status', ['pending','reviewed','resolved'])->default('pending');
            $table->timestamps();
            $table->timestamp('read_at')->nullable();

            $table->index('recipient_id');
            $table->foreign('recipient_id')
                  ->references('id')->on('users')
                  ->onDelete('cascade')
                  ->onUpdate('cascade');
            $table->foreign('actor_id')
                  ->references('id')->on('users')
                  ->onDelete('cascade')
                  ->onUpdate('cascade');
        });
        Schema::enableForeignKeyConstraints();
    }

    public function down()
    {
        Schema::dropIfExists('notifications');
    }
}
