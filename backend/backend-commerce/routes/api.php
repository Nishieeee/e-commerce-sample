<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
// Controllers
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;

// public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// protected routes
Route::middleware('auth:sanctum')->group(function () { 
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user(); // returns authenticated user
    });

    Route::middleware(['auth:sanctum', 'admin'])->get('/', function () {
        return response()->json(['message' => 'Admin dashboard']);
    });

});
// Product endpoints
Route::get('/products', [ProductController::class, 'index']);  
