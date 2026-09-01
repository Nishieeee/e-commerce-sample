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
        $dto = RegisterUserDTO::fromArray($request->validated());

        $user = $authService->register($dto);

        return response()->json([
            'message' => 'User created successfully',
            'access_token' => $user['token'],
            'user' => new UserResource($user['user']),
        ], 201);
    }

    public function login(LoginUserRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $user = User::where('email', $validated['email'])->first();

        if (! $user || ! Hash::check($validated['password'], $user->password)) {
            return response()->json([
                'message' => 'Invalid credentials',
            ], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'user' => new UserResource($user),
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        /** @var User|null $user */
        $user = $request->user();
        $user?->currentAccessToken()?->delete();

        return response()->json([
            'message' => 'Logged out successfully',
        ]);
    }
}
