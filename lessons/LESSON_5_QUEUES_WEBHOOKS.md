# Phase 5: Asynchronous Processing (Scaling Time)

When a user clicks "Checkout", the backend might need to:
1. Charge their credit card (Stripe API) - 2 seconds
2. Generate a PDF receipt - 3 seconds
3. Send an email - 2 seconds

If you do this in the controller, the user stares at a loading screen for 7 seconds. If Stripe times out, the entire request crashes. This is a terrible user experience.

## 5.1 Queues and Background Jobs
Instead of doing the work synchronously, we package the instructions into a **Job** and throw it onto a Redis Queue. The controller returns a success response instantly (in 0.1 seconds). In the background, a Laravel Queue Worker picks up the job and processes it.

Create a job: `php artisan make:job SendOrderConfirmationEmail`

```php
namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;

class SendOrderConfirmationEmail implements ShouldQueue
{
    public function __construct(public Order $order) {}

    public function handle()
    {
        // This runs in the background. If it fails, Laravel will retry it automatically.
        Mail::to($this->order->user)->send(new OrderConfirmation($this->order));
    }
}
```

In your controller/service:
```php
SendOrderConfirmationEmail::dispatch($order);
return response()->json(['message' => 'Order placed successfully!']);
```

## 5.2 Image Processing
When an admin uploads a 5MB product image, we don't want the API to block while resizing it into thumbnails. We store the raw image, return `200 OK`, and dispatch a `ProcessProductImage` job to crop it and upload it to AWS S3 in the background.

## 5.3 Webhooks (Reverse APIs)
When we charge a credit card, we don't want our server hanging while we wait for Stripe to confirm the payment. We use asynchronous Webhooks.
1. We tell Stripe: "Charge this card. Here is the order ID."
2. We return a response to the user.
3. 5 seconds later, Stripe makes a POST request to *our* API (`/api/webhooks/stripe`) saying "Payment succeeded for Order #123".
4. We update the order status in our database.

---

## Your Assignment (For Later)
We will build a Job to simulate processing an order (like sending a mock email) and configure a queue worker (`php artisan queue:work`) to process it in the background.
