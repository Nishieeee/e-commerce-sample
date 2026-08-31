<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use App\Services\InventoryService;

class ReleaseAbandonedCarts implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $abandonedCarts = \App\Models\Cart::where('updated_at', '<', now()->subMinutes(15))->get();

        foreach($abandonedCarts as $cart) {
            $cartItems = \App\Models\CartItem::where('cart_id', $cart->id)->get();

            foreach($cartItems as $item) {
                // Give the stock back to other customers!
                $inventoryService->releaseReservedQuantity($item->product_id, $item->quantity);
                $item->delete(); 
            }
        }

        $cart->delete();
    }
}
