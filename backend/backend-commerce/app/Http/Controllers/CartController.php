<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

// Requests
use App\Http\Requests\AddToCartRequest;
use App\Http\Requests\UpdateCartRequest;

// Models
use App\Models\Cart;

// Services
use App\Services\CartService;

class CartController extends Controller
{
    public function store(AddToCartRequest $request): JsonResponse {
        $validated = $request->validate();
        
        
    }
}
