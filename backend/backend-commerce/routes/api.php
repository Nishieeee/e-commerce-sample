<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
// Controllers
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\CartController;

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
    Route::post('/addtocart', [CartController::class, 'store']);
    Route::put('/updatequantity', [CartController::class, 'update']);
    Route::delete('/removeitem', [CartController::class, 'destroy']);
    
    // Checkout endpoints
    Route::post('/checkout', [CheckoutController::class, 'store']);

});

