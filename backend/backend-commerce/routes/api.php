<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CartController;
// Controllers
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\ProductController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// public routes
// AuthController
Route::post('/register', [AuthController::class, 'register']);
Route::middleware('throttle:login')->post('/login', [AuthController::class, 'login']);

// Product endpoints
Route::get('/products', [ProductController::class, 'index']);

// protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user(); // returns authenticated user
    });

    Route::middleware(['auth:sanctum', 'admin'])->get('/admin', function () {
        return response()->json(['message' => 'Admin dashboard']);
    });

    // cart endpoints
    Route::post('/cart/items', [CartController::class, 'store']);
    Route::put('/cart/items', [CartController::class, 'update']);
    Route::delete('/cart/items/{cart_item}', [CartController::class, 'destroy']);

    // Checkout endpoints
    Route::post('/checkout', [CheckoutController::class, 'store']);

});
