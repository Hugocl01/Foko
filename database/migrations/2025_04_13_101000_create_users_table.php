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
            $table->unsignedBigInteger('role_id')->default(1);
            $table->string('description', 255)->nullable();
            $table->timestamp('email_verified_at')->nullable();
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

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index()->constrained('users');
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
}
