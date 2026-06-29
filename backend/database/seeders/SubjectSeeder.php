<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class SubjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $subjects = [
            'Cálculo Diferencial',
            'Cálculo Integral',
            'Álgebra Lineal',
            'Programación',
            'Estructura de Datos',
            'Bases de Datos',
            'Ingeniería de Software',
            'Física',
            'Química',
            'Probabilidad y Estadística',
            'Matemáticas Discretas',
            'Redes de Computadoras',
        ];

        $now = Carbon::now();

        foreach ($subjects as $subject) {
            DB::table('subjects')->updateOrInsert(
                ['name' => $subject],
                ['created_at' => clone $now]
            );
        }
    }
}
