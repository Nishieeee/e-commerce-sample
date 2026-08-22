<?php 

namespace App\Services;

use App\Models\User;

class AuthService
{
    public function register(Array $data)
    {
        // Create users
        $user = User::create($data);
    
        // Generate Sanctum token
        $token = $user->createToken('auth_token')->plainTextToken;

        return [
            'user'=>$user,
            'token'=>$token,
        ];
    }
}