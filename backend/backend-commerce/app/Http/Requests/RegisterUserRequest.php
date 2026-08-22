<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class RegisterUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
           'name' => 'required|string|max:255',
           'email' => 'required|string|email|unique:users',
           'password' => 'required|string|min:8',
        ];
    }

    /**
     * Customize the error messages for the validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'The name field is required.',
            'email.required' => 'The email field is required.',
            'password.required' => 'The password field is required.',
            'name.string' => 'The name field must be a string.',
            'email.string' => 'The email field must be a string.',
            'password.string' => 'The password field must be a string.',
            'name.max' => 'The name field must not exceed 255 characters.',
            'email.email' => 'The email field must be a valid email address.',
            'email.unique' => 'The email field must be unique.',
            'password.min' => 'The password field must be at least 8 characters.',
        ];
    }
}
