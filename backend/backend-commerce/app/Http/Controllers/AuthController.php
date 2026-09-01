<?php

namespace App\Http\Controllers;

use App\DTOs\RegisterUserDTO;
// Models
use App\Http\Requests\LoginUserRequest;
use App\Http\Requests\RegisterUserRequest;
use App\Http\Resources\UserResource;
// Resources
use App\Models\User;
// Services
use App\Services\AuthService;
// DTOs
use Illuminate\Http\JsonResponse;
// requests
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(RegisterUserRequest $request, AuthService $authService): JsonResponse
    {

        $dto = new RegisterUserDTO(...$request->validated());

        $user = $authService->register($dto);

        // return Json
        return response()->json([
            'message' => 'User created successfully',
            'access_token' => $user['token'],
            'user' => new UserResource($user['user']),
        ], 201);
    }

    public function login(LoginUserRequest $request): JsonResponse
    {
        // validate the credentials
        $request->validated();

        // Check if the user exists and if the passowrd is correct
        $user = User::where('email', $request->email)->first();

        // return 401 for invalid email or password
        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Invalid credentials',
            ], 401);
        }

        // generate token
        $token = $user->createToken('auth_token')->plainTextToken;

        // return success response
        return response()->json([
            'access_token' => $token,
            'user' => new UserResource($user),
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully',
        ]);
    }
}
