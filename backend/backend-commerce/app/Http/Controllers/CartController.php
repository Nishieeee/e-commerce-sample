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

// dto
use App\DTOs\CartDTO;

class CartController extends Controller
{
    public function store(AddToCartRequest $request, CartService $cartService): JsonResponse {
        $validated = $request->validate();

        $dto = new CartDTO(
            user_id: $request->user()->id,
            product_id: $validated['product_id'],
            price_at_add: $validated['price_at_add']
        );

        $result = $cartService->addToCart($dto);
        // $newTotal = $cartservice->calculateTotal();
        return response()->json([
            'message' => 'Item Added to Cart successfully',
        ], 200);
        
    }
}
