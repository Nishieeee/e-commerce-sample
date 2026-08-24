<?php 

namespace App\Services;

use App\Models\InventoryItem;
use Illuminate\Support\Facades\DB;
use App\Models\Order;
use App\DTOs\CheckoutDTO;

use App\Jobs\SendOrderConfirmationEmail;
use App\Jobs\ProcessOrderPayment;

use Illuminate\Support\Str;

class CheckoutService
{
    public function processOrder(CheckoutDTO $dto)
    {
        DB::transaction(function () use ($dto) {
            // transaction logic that handles the checkout process
            
           $inventory = InventoryItem::where('product_id', $dto->product_id)->lockForUpdate()->first();

           if($inventory->quantity < $dto->quantity) {
               abort(400, 'Insufficient stock');
           }

           $inventory->decrement('quantity', $dto->quantity);

           $order = Order::create([
               'order_number' => Str::uuid()->toString(),
               'user_id' => $dto->user_id,
               'status' => 'pending',
               'total_amount' => 0, // willl be calculated later
               'shipping_address' => json_encode([
                   'street' => '123 Fake Street'
               ]),
               'billing_address' => json_encode([
                   'street' => '123 Fake Street'
               ]),
               'subtotal' => 0,
           ]);
           ProcessOrderPayment::withChain([
               new SendOrderConfirmationEmail($order)
           ])->dispatch($order);
        });
    }
}
