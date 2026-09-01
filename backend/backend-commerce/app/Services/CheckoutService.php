<?php

namespace App\Services;

use App\DTOs\CheckoutDTO;
use App\Jobs\ProcessOrderPayment;
use App\Jobs\SendOrderConfirmationEmail;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CheckoutService
{
    public function __construct(
        protected InventoryService $inventoryservice
    ) {}

    public function processOrder(CheckoutDTO $dto)
    {
        DB::transaction(function () use ($dto) {
            // transaction logic that handles the checkout process

            $itemsCheckout = collect($dto->cart_items);

            foreach ($itemsCheckout as $item) {
                $this->inventoryservice->deductStock($item['product_id'], $item['quantity']);
            }

            // calculate total amount
            $total_amount = $this->calculateTotal($itemsCheckout);

            $order = Order::create([
                'order_number' => Str::uuid()->toString(),
                'user_id' => $dto->user_id,
                'status' => 'pending',
                'total_amount' => $total_amount, // will be calculated later
                'shipping_address' => json_encode([
                    'street' => '123 Fake Street',
                ]),
                'billing_address' => json_encode([
                    'street' => '123 Fake Street',
                ]),
                'subtotal' => $total_amount, // Set subtotal to total_amount for now
            ]);

            // Clear the cart!
            $cart = Cart::where('user_id', $dto->user_id)->first();
            if ($cart) {
                CartItem::where('cart_id', $cart->id)->delete();
            }

            ProcessOrderPayment::withChain([
                new SendOrderConfirmationEmail($order),
            ])->dispatch($order);
        });
    }

    public function calculateTotal(\Illuminate\Support\Collection $cart_items)
    {

        // Grab all product ids
        $productIds = $cart_items->pluck('product_id');
        $products = Product::whereIn('id', $productIds)->get()->keyBy('id');

        // calculate cart total
        $cart_total = $cart_items->sum(function ($item) use ($products) {
            $officialPrice = $products[$item['product_id']]->price;

            return $item['quantity'] * $officialPrice;
        });

        return $cart_total;
    }
}
