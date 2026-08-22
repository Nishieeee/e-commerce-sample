<?php 

namespace App\Services;

use App\Models\User;
use App\DTOs\RegisterUserDTO;

class AuthService
{
    public function register(RegisterUserDTO $dto)
    {
        // Create users
        $user = User::create([
            'name' => $dto->name,
            'email' => $dto->email,
            'password' => $dto->password,
            'phone' => $dto->phone,
        ]);
    
        // Generate Sanctum token
        $token = $user->createToken('auth_token')->plainTextToken;

        // return user and token
        return [
            'user'=>$user,
            'token'=>$token,
        ];
    }
}