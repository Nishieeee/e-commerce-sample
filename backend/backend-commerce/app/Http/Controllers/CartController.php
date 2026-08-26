<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

// Requests
use App\Http\Requests\AddToCartRequest;
use App\Http\Requests\UpdateCartRequest;

// Models
use App\Models\Cart;

// Services
use App\Services\CartService;

// dto
use App\DTOs\CartDTO;

// Resource 
use App\Resources\CartResource;

class CartController extends Controller
{
    public function store(AddToCartRequest $request, CartService $cartService): JsonResponse {
        $validated = $request->validated();

        $dto = new CartDTO(
            user_id: $request->user()->id,
            product_id: $validated['product_id'],
        );

        $result = $cartService->addToCart($dto);
        $newTotal = $cartservice->calculateTotal($result);
        
        return response()->json([
            'message' => 'Item Added to Cart successfully',
            'cart_items' => CartResource::collection($result), 
            'cart_total' =>  $newTotal,
        ], 200); 
    }

    public function update(UpdateCartRequest $request) {

        $validated = $request->validated();

        $dto = new CartDTO(
            user_id: $request->user()->id,
            product_id: $validated['product_id']   
        );

        // reused addToCart logic to update product quantity in cart items
        // Will rename the service function later
        $result = cartService->addToCart($dto);
        $newTotal = $cartservice->calculateTotal($result);
        
        return response()->json([
            'cart_items' => CartResource::collection($result),
            'cart_total' => $newTotal,
        ], 200);
    }
}
