<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class IsAdmin
{
    /**
     * Maneja una solicitud entrante.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        // 1. Si no hay usuario autenticado, redirige al login.
        if (!$request->user()) {
            return redirect()->route('home');
        }

        // 2. Obtén el modelo Role desde la relación del usuario.
        //    NOTA: asume que en User.php existe:
        //    public function role() { return $this->belongsTo(Role::class); }
        $role_id = $request->user()->role_id;
        //dd($role->name);
        // 3. Si no hay rol asociado o su name no es "admin", aborta con 403.
        if (!$role_id || $role_id !== 1) {
            dd($role_id);
            abort(403, 'Acceso denegado. Se requiere rol de administrador.');
        }

        // 4. Si todo está bien, continúa con la petición.
        return $next($request);
    }
}
