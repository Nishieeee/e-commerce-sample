<?php

namespace App\Http\Controllers;

use App\DTOs\CartDTO;
use App\Http\Requests\AddToCartRequest;
use App\Http\Requests\UpdateCartRequest;
// Requests
use App\Http\Resources\CartResource;
use App\Models\Cart;
// Models
use App\Models\CartItem;
use App\Services\CartService;
// Services
use App\Services\InventoryService;
use Illuminate\Http\JsonResponse;
// dto
use Illuminate\Http\Request;
// Resource
use Illuminate\Support\Facades\Gate;

class CartController extends Controller
{
    public function __construct(
        protected InventoryService $inventoryservice
    ) {}

    public function index(CartService $cartService, Request $request): JsonResponse
    {
        $user_id = $request->user()->id;

        $cart_items = $cartService->fetchCartItemsFromCart($user_id);
        $total = $cartService->calculateCartTotal($cart_items);

        return response()->json([
            'cart_items' => CartResource::collection($cart_items),
            'total' => $total,
        ], 201);
    }

    public function store(AddToCartRequest $request, CartService $cartService): JsonResponse
    {
        $validated = $request->validated();

        $dto = new CartDTO(
            user_id: $request->user()->id,
            product_id: $validated['product_id'],
            quantity: $validated['quantity'] ?? 1,
        );

        $result = $cartService->addToCart($dto);
        $newTotal = $cartService->calculateCartTotal($result);

        return response()->json([
            'message' => 'Item Added to Cart successfully',
            'cart_items' => CartResource::collection($result),
            'cart_total' => $newTotal,
        ], 200);
    }

    public function update(UpdateCartRequest $request, CartService $cartService)
    {

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

    public function destroy(CartItem $cart_item): JsonResponse
    {

        // verify if cart item belongs to user's cart
        Gate::authorize('delete', $cart_item);

        // release reserved quantity
        $this->inventoryservice->releaseReservedQuantity($cart_item->product_id, $cart_item->quantity);

        $cart_item->delete();

        return response()->json([
            'message' => 'Item successfully removed',
        ], 204);
    }
}
