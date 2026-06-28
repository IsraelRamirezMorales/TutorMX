<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureTutorIsApproved
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // Verificamos si el usuario está autenticado, es tutor, pero no está aprobado
        if ($user && $user->role === 'USER' && $user->is_tutor && $user->verification_status !== 'APPROVED') {
            abort(403, 'Acción denegada. Tu perfil de tutor aún no ha sido aprobado o ha sido declinado.');
        }

        return $next($request);
    }
}
