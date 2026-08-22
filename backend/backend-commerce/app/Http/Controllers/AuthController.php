<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

// Models
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\JsonResponse;

// Resources
use App\Http\Resources\UserResource;

// Services
use App\Services\AuthService;

// DTOs
use App\DTOs\RegisterUserDTO;

class AuthController extends Controller
{
    public function register(Request $request, AuthService $authService): JsonResponse {

        // validate incoming requests
        $request->validate([
           'name' => 'required|string|max:255',
           'email' => 'required|string|email|unique:users',
           'password' => 'required|string|min:8',
        ]);

        $dto = new RegisterUserDTO(
            name: $request['name'],
            email: $request['email'],
            password: $request['password'],
            phone: $request['phone'] ?? null,
        );

        $user = $authService->register($dto);
        
        // return Json 
        return response()->json([
        'message'=>'User created successfully',
        'access_token'=>$user['token'],
        'user'=> new UserResource($user['user']),
        ], 201);
    } 

    public function login(Request $request): JsonResponse {
        // validate the credentials
         
        // Check if the user exists and if the passowrd is correct
        $user = User::where('email', $request->email)->first();

        // return 401 for invalid email or password
        if(!$user || !Hash::check($request->password, $user->password)) {
           return response()->json([
               'message' => 'Invalid credentials'
           ], 401);
        }        

       // generate token
       $token = $user->createToken('auth_token')->plainTextToken;

       // return success response
       return response()->json([
         'access_token'=>$token,
         'user'=> new UserResource($user),
       ]);      
    }

    public function logout(Request $request) {
        $request->user()->currentAccessToken()->delete();
        return response()->json([
           'message'=>'Logged out successfully' 
        ]);
    }
}
