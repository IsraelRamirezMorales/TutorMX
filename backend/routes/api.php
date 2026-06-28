<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Ejemplos de rutas protegidas por rol (middleware CheckRole)

Route::middleware(['auth:sanctum', 'role:ADMIN'])->group(function () {
    // Solo ADMIN puede validar tutores.
    Route::post('/admin/validate-tutor', function () {
        return response()->json(['message' => 'Tutor validado exitosamente']);
    });
});

Route::middleware(['auth:sanctum', 'role:TUTOR'])->group(function () {
    
    // Rutas que requieren que el tutor esté aprobado (Sprint 2)
    Route::middleware(['tutor.approved'])->group(function () {
        // Solo TUTOR aprobado puede aceptar asesorías.
        Route::post('/tutor/accept-advisory', function () {
            return response()->json(['message' => 'Asesoría aceptada']);
        });
    });

    // Ejemplo: Rutas a las que un tutor podría acceder incluso estando PENDING
    Route::get('/tutor/status', function (Request $request) {
        return response()->json(['status' => $request->user()->verification_status]);
    });
});

// Ejemplo: Endpoint público de búsqueda de tutores (Sprint 2)
Route::get('/search/tutors', function () {
    // Lógica para devolver SOLO tutores aprobados
    $tutors = \App\Models\User::where('is_tutor', true)
        ->where('verification_status', 'APPROVED')
        ->get();
    
    return response()->json($tutors);
});

Route::middleware(['auth:sanctum', 'role:STUDENT'])->group(function () {
    // Solo STUDENT puede crear solicitudes de asesoría.
    Route::post('/student/request-advisory', function () {
        return response()->json(['message' => 'Solicitud de asesoría creada']);
    });
});

// Ejemplo: Ruta con múltiples roles permitidos
Route::middleware(['auth:sanctum', 'role:ADMIN,TUTOR'])->group(function () {
    Route::get('/shared-data', function () {
        return response()->json(['message' => 'Acceso permitido para ADMIN y TUTOR']);
    });
});
