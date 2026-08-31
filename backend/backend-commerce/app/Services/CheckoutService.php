<?php 

namespace App\Services;

use App\Models\InventoryItem;
use Illuminate\Support\Facades\DB;
use App\Models\Order;
use App\DTOs\CheckoutDTO;
use Illuminate\Database\Eloquent\Collection;

use App\Jobs\SendOrderConfirmationEmail;
use App\Jobs\ProcessOrderPayment;

use App\Models\Product;
use Illuminate\Support\Str;

class CheckoutService
{
    public function processOrder(CheckoutDTO $dto)
    {
        DB::transaction(function () use ($dto) {
            // transaction logic that handles the checkout process

            $itemsCheckout = collect($dto->cart_items);
            
            foreach($itemsCheckout as $item) {
                 $this->deductStock($item['product_id'], $item['quantity']);
            }

            // calculate total amount
            $total_amount = $this->calculateTotal($itemsCheckout);

            $order = Order::create([
               'order_number' => Str::uuid()->toString(),
               'user_id' => $dto->user_id,
               'status' => 'pending',
               'total_amount' => $total_amount, // will be calculated later
               'shipping_address' => json_encode([
                   'street' => '123 Fake Street'
               ]),
               'billing_address' => json_encode([
                   'street' => '123 Fake Street'
               ]),
               'subtotal' => $total_amount, // Set subtotal to total_amount for now
            ]);

            // Clear the cart!
            $cart = \App\Models\Cart::where('user_id', $dto->user_id)->first();
            if ($cart) {
                \App\Models\CartItem::where('cart_id', $cart->id)->delete();
            }

            ProcessOrderPayment::withChain([
               new SendOrderConfirmationEmail($order)
            ])->dispatch($order);
        });
    }

    function calculateTotal(\Illuminate\Support\Collection $cart_items) {

        // Grab all product ids
        $productIds = $cart_items->pluck('product_id');
        $products = Product::whereIn('id', $productIds)->get()->keyBy('id');

        // calculate cart total
        $cart_total = $cart_items->sum(function ($item) use ($products){
            $officialPrice = $products[$item['product_id']]->price;
            return $item['quantity'] * $officialPrice;
        });

        return $cart_total;
    }

    function deductStock(int $product_id, int $quantity) {
        $inventory = InventoryItem::where('product_id', $product_id)->lockForUpdate()->first();
    
        if(!$inventory || $inventory->quantity < $quantity) {
            abort(400, 'Insufficient stock');
        }
        
        $inventory->decrement('quantity', $quantity);
    }
}
