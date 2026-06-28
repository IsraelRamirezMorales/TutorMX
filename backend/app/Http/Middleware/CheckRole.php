<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $user = $request->user();

        if (!$user) {
            abort(401, 'No autenticado');
        }

        $hasRole = false;

        foreach ($roles as $role) {
            $role = strtoupper($role);
            if ($role === 'ADMIN' && $user->role === 'ADMIN') {
                $hasRole = true;
                break;
            }
            if ($role === 'TUTOR' && $user->role === 'USER' && $user->is_tutor) {
                $hasRole = true;
                break;
            }
            if ($role === 'STUDENT' && $user->role === 'USER' && !$user->is_tutor) {
                $hasRole = true;
                break;
            }
        }

        if (!$hasRole) {
            abort(403, 'Acceso denegado. No tienes los permisos necesarios.');
        }

        return $next($request);
    }
}
