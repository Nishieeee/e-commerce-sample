<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

// Requests
use App\Http\Requests\AddToCartRequest;
use App\Http\Requests\UpdateCartRequest;

// Models
use App\Models\Cart;
use App\Models\CartItem;
// Services
use App\Services\CartService;

// dto
use App\DTOs\CartDTO;

// Resource 
use App\Http\Resources\CartResource;

class CartController extends Controller
{
    public function index(CartService $cartService, Request $request): JsonResponse {
        $user_id = $request->user()->id;

        $cart_items = $cartService->fetchCartItemsFromCart($user_id);
        $total = $cartService->calculateCartTotal($cart_items);

        return response()->json([
            'cart_items' => CartResource::collection($cart_items),
            'total' => $total,
        ], 201);
    }
    
    public function store(AddToCartRequest $request, CartService $cartService): JsonResponse {
        $validated = $request->validated();

        $dto = new CartDTO(
            user_id: $request->user()->id,
            product_id: $validated['product_id'],
            quantity: $validated['quantity'] ?? null,
        );

        $result = $cartService->addToCart($dto);
        $newTotal = $cartService->calculateCartTotal($result);
        
        return response()->json([
            'message' => 'Item Added to Cart successfully',
            'cart_items' => CartResource::collection($result), 
            'cart_total' =>  $newTotal,
        ], 200); 
    }

    public function update(UpdateCartRequest $request, CartService $cartService) {

        $validated = $request->validated();

        $dto = new CartDTO(
            user_id: $request->user()->id,
            product_id: $validated['product_id'],
            quantity: $validated['quantity'] 
        );

        // reused addToCart logic to update product quantity in cart items
        // Will rename the service function later
        $result = $cartService->updateCart($dto);
        $newTotal = $cartService->calculateCartTotal($result);
        
        return response()->json([
            'cart_items' => CartResource::collection($result),
            'cart_total' => $newTotal,
        ], 200);
    }

    public function destroy(CartItem $cart_item): JsonResponse {

        // verify if cart item belongs to user's cart
        Gate::authorize('delete', $cart_item);

        $cart_item->delete();
        
        return response()->json([
           'message' => 'Item successfully removed', 
        ], 204);
    }
}
