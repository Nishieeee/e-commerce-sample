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

        // validate inputs
        if (!$signatureHeader || empty($webhookSecret)) {
            return response()->json([
                'error' => 'Missing signature or webhook secret configuration'
            ], 400);
        }

        return response()->json(['status' => 'success']);
    }
}

