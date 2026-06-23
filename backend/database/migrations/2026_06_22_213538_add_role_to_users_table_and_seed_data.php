<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Poblar la base de datos con los usuarios solicitados
        $users = [];
        $now = Carbon::now();

        // 10 alumnos (role: USER, is_tutor: false)
        for ($i = 1; $i <= 10; $i++) {
            $users[] = [
                'name' => "Alumno",
                'lastname' => "Test $i",
                'email' => "alumno$i@example.com",
                'role' => 'USER',
                'is_tutor' => false,
                'verification_status' => 'APPROVED',
                'password' => Hash::make('password123'),
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        // 5 alumnos/tutores (role: USER, is_tutor: true) - Nota: En el sistema role 'TUTOR' no existia en el diccionario, solo 'USER' o 'ADMIN', pero se marca 'is_tutor' = true
        for ($i = 1; $i <= 5; $i++) {
            $users[] = [
                'name' => "Tutor",
                'lastname' => "Test $i",
                'email' => "tutor$i@example.com",
                'role' => 'USER',
                'is_tutor' => true,
                'verification_status' => 'APPROVED',
                'password' => Hash::make('password123'),
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        // 10 profes (role: ADMIN)
        for ($i = 1; $i <= 10; $i++) {
            $users[] = [
                'name' => "Profesor",
                'lastname' => "Test $i",
                'email' => "profesor$i@example.com",
                'role' => 'ADMIN',
                'is_tutor' => false,
                'verification_status' => 'APPROVED',
                'password' => Hash::make('password123'),
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        DB::table('users')->insert($users);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Eliminar los usuarios de prueba
        DB::table('users')
            ->where('email', 'like', '%@example.com')
            ->delete();
    }
};
