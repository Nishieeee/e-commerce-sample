<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Events\PaymentRecevied;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\DB;

// models
use App\Models\Order;
use App\Models\Payment;

class UpdateOrderStatusToPaid
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(PaymentRecevied $event): void
    {
        DB::transaction(function () use ($event) {
            // lock to prevent race condistions
            $order = Order::where('order_number', $event->orderNumber)
                ->lockForUpdate()
                ->first();
            // return if order not found
            if(!$order) {
                return;
            }

            // update the order status
            $order::update([
               'status' => 'processing', 
            ]);

            // create/update payment records
            Payment::updateOrCreate([
                'order_id' => $order->id
            ], [
                'payment_method' => 'stripe',
                'payment_status' => 'paid',
                'transaction_id' => $event->transactionId,
                'amount' => $event->amount,
                'currency' => $event->currency,
                'payment_gateway_response' => $event->payload,
                'paid_at' => now(),                
            ]);
        });
    }
}
