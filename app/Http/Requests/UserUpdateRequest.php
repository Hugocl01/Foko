<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Ajusta según tu lógica de permisos
        return true;
    }

    public function rules(): array
    {
        // En store $this->user() es null, en update es la instancia existente
        $userId = $this->route('user')?->id;

        return [
            'name' => ['required', 'string', 'max:255'],
            'username' => [
                'required',
                'string',
                'max:255',
                'regex:/^\S+$/',
                Rule::unique('users', 'username')->ignore($userId),
            ],
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($userId),
            ],
            'plan_id' => ['required', 'integer', 'exists:plans,id'],
            'role_id' => ['required', 'integer', 'exists:roles,id'],
            'status' => ['required', 'integer', Rule::in([0, 1])],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'El nombre es obligatorio.',
            'name.max' => 'El nombre no debe exceder :max caracteres.',

            'username.required' => 'El nombre de usuario es obligatorio.',
            'username.unique' => 'Este nombre de usuario ya está en uso.',
            'username.regex' => 'El nombre de usuario no puede contener espacios.',
            'username.max' => 'El nombre de usuario no debe exceder :max caracteres.',

            'email.required' => 'El email es obligatorio.',
            'email.email' => 'El formato del email no es válido.',
            'email.unique' => 'Este email ya está registrado.',

            'plan_id.required' => 'Debes seleccionar un plan.',
            'plan_id.exists' => 'El plan seleccionado no existe.',

            'role_id.required' => 'Debes seleccionar un rol.',
            'role_id.exists' => 'El rol seleccionado no existe.',

            'status.required' => 'El estado es obligatorio.',
            'status.in' => 'El estado debe ser activo o inactivo.',
        ];
    }
}
