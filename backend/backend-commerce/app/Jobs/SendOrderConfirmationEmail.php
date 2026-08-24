<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Mail;
use App\Mail\OrderConfirmationMail;
use App\Models\Order;


class SendOrderConfirmationEmail implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(public Order $order)
    {
        
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        Mail::to($this->order->user)->send(new OrderConfirmationMail($this->order));
    }
}
