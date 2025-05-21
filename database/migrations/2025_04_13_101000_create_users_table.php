<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name', 100);
            $table->string('username', 191)->unique();
            $table->string('email', 191)->unique();
            $table->string('password', 255);
            $table->string('profile_image_url')->nullable();
            $table->tinyInteger('status')->default(1);
            $table->unsignedBigInteger('plan_id')->nullable();

            // Reemplaza el ENUM role por role_id
            $table->unsignedBigInteger('role_id')->default(1);

            $table->timestamps();

            // Foreign keys
            $table->foreign('plan_id')
                ->references('id')->on('plans')
                ->onDelete('set null')
                ->onUpdate('cascade');

            $table->foreign('role_id')
                ->references('id')->on('roles')
                ->onDelete('restrict')
                ->onUpdate('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
}
