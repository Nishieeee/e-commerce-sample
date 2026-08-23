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
        $validated = $request->validated();
        $dto = new CheckoutDTO(
            user_id: $request->user()->id,
            product_id: $validated['product_id'],
            quantity: $validated['quantity']
        );

        $result = $checkoutService->processOrder($dto);

        return response()->json([
            'message' => 'Order placed successfully',
        ], 201);
    }
}
