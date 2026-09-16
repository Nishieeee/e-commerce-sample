<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Events\PaymentReceived;
use Illuminate\Http\JsonResponse;

class WebHookController extends Controller
{
    public function handleStripeWebHook(Request $request): JsonResponse
    {
        $signatureHeader = $request->header('Stripe-Signature');
        $rawPayload = $request->getContent();
        $webhookSecret = (string) config('services.stripe.webhook_secret');

        // validate inputs if empty
        if (!$signatureHeader || empty($webhookSecret)) {
            return response()->json([
                'error' => 'Missing signature or webhook secret configuration'
            ], 400);
        }
        // parse timestamp t and signature v1 from stripe-signature header
        $signatureHeader = $this->parseSignattureHeader($signatureHeader);
        
        // check if t and v1 are set(?) 
        if(!isset($signatureData['t'], $signatureData['v1'])) {
            return response()->json([
                'error' => 'Invalid signature header format'
            ], 400);
        }

        // Tolerance check
        // reject requests that are older than 5 mins
        if(abs(time() - (int) $signatureData['t']) > 300) { // converts timestamp to int then compare
            return response()->json([
                'error' => 'Webhook Timestamp expired'
            ], 400);
        }

        // compute expected HMAC-SHA256 signature
        // construct signed payload, concatenating t and rawPayload
        $signedPayload = $signatureData['t'] . '.' . $rawPayload;
        
        // generate actual security signature
        $expectedsignature = hash_hmac('sha256', $signedPayload, $webhookSecret);
        
        // Constant-time string comaprison to prevent timing attacks
        if(!hash_equals($expectedsignature, $signatureData['v1'])) {
            return response()->json([
                'error' => 'Signature verification failed'
            ], 400);
        }

        // decode the payload 
        $event = json_decode($rawPayload, true);
        if(($event['type'] ?? '') === 'payment_intent.succeeded') {
            // extract payment
            $paymentIntent = $event['data']['object'];

            // extract order_number
            $orderNumber = $paymentIntent['metadata'] ?? null;
            // extract transac id
            $transactionId = $paymentIntent['id'] ?? null;
            // extract amount from payload
            $amount = isset($paymentIntent['id']) ? ((float) $paymentIntent['amount']) / 100 : 0.0; // grabs the integer converts it from cents

            // converts usd currency to uppercase
            $currency = strtoupper((string) ($paymentIntent['currency'] ?? 'USD'));

            // process the event
            if($orderNumber && $transactionId) {
                PaymentReceived::dispatch(
                    $orderNumber,
                    $transactionId,
                    $amount,
                    $currency,
                    $event
                );
            }
        }

        return response()->json(['status' => 'success'], 200);
    }
}

