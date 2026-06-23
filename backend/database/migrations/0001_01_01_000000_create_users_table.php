<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Crear ENUMs de Postgres requeridos para la tabla users
        DB::statement("DROP TYPE IF EXISTS system_role_t CASCADE");
        DB::statement("CREATE TYPE system_role_t AS ENUM ('USER', 'ADMIN')");
        DB::statement("DROP TYPE IF EXISTS verification_status_t CASCADE");
        DB::statement("CREATE TYPE verification_status_t AS ENUM ('PENDING', 'APPROVED', 'DECLINED')");

        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('lastname');
            $table->string('email')->unique();
            $table->string('password');
            $table->boolean('is_tutor')->default(false);
            $table->text('bio')->nullable();
            $table->text('profile_image_url')->nullable();
            $table->timestamps(); // creates created_at and updated_at
        });

        DB::statement("ALTER TABLE users ADD COLUMN role system_role_t NOT NULL DEFAULT 'USER'::system_role_t");
        DB::statement("ALTER TABLE users ADD COLUMN verification_status verification_status_t NOT NULL DEFAULT 'PENDING'::verification_status_t");

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');

        // Eliminar ENUMs
        DB::statement("DROP TYPE IF EXISTS system_role_t");
        DB::statement("DROP TYPE IF EXISTS verification_status_t");
    }
};
