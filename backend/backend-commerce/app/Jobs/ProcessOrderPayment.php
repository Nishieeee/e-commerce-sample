<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

use App\Models\Order;
class ProcessOrderPayment implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(public Order $order)
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        Log::info("Starting payment processing for Order ID: {$this->order->id}");

        sleep(3);

        if(rand(1,100) <= 20) {
            throw new \Exception("Simulated Stripe API Timeout!");
        }

        $this->order->update(['status' => 'processing']);

        Log::info("Payment successful for Order ID: {$this->order->id}");
    }
}
