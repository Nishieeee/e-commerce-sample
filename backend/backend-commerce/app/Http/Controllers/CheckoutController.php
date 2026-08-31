<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\CheckoutRequest;
use App\Services\CheckoutService;
use App\DTOs\CheckoutDTO;

class CheckoutController extends Controller
{
    public function store(CheckoutRequest $request, CheckoutService $checkoutService): JsonResponse
    {
        // 1. Get the user's cart from the database! Never trust the frontend!
        $cart = \App\Models\Cart::where('user_id', $request->user()->id)->firstOrFail();
        $cartItems = \App\Models\CartItem::where('cart_id', $cart->id)->get()->toArray();

        if (empty($cartItems)) {
            return response()->json(['message' => 'Cart is empty'], 400);
        }
        
        $dto = new CheckoutDTO(
            user_id: $request->user()->id,
            cart_items: $cartItems
        );

        $result = $checkoutService->processOrder($dto);

        return response()->json([
            'message' => 'Order placed successfully',
        ], 201);
    }
}
