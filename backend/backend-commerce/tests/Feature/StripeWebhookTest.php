<?php

use App\Events\PaymentReceived;
use App\Models\Order;
use App\Models\Payment;
use Illuminate\Support\Facades\Event;

test('rejects webhook with missing signature', function () {
    $response = $this->postJson('/api/webhooks/stripe', [
        'type' => 'payment_intent.succeeded',
    ]);

    $response->assertStatus(400)
        ->assertJson(['error' => 'Missing signature or webhook secret configuration']);
});

test('rejects webhook with invalid signature', function () {
    config(['services.stripe.webhook_secret' => 'whsec_test_secret']);

    $timestamp = time();
    $payload = json_encode(['type' => 'payment_intent.succeeded']);

    $response = $this->call(
        'POST',
        '/api/webhooks/stripe',
        [],
        [],
        [],
        [
            'HTTP_STRIPE_SIGNATURE' => "t={$timestamp},v1=forged_signature_string",
            'CONTENT_TYPE' => 'application/json',
        ],
        $payload
    );

    $response->assertStatus(400)
        ->assertJson(['error' => 'Signature verification failed']);
});

test('accepts valid stripe signature and dispatches PaymentReceived event', function () {
    Event::fake([PaymentReceived::class]);
    config(['services.stripe.webhook_secret' => 'whsec_test_secret']);

    $timestamp = time();
    $payload = json_encode([
        'type' => 'payment_intent.succeeded',
        'data' => [
            'object' => [
                'id' => 'pi_test_987654321',
                'amount' => 18500, // $185.00
                'currency' => 'usd',
                'metadata' => [
                    'order_number' => 'ORD-2026-TEST',
                ],
            ],
        ],
    ]);

    $signature = hash_hmac('sha256', $timestamp . '.' . $payload, 'whsec_test_secret');

    $response = $this->call(
        'POST',
        '/api/webhooks/stripe',
        [],
        [],
        [],
        [
            'HTTP_STRIPE_SIGNATURE' => "t={$timestamp},v1={$signature}",
            'CONTENT_TYPE' => 'application/json',
        ],
        $payload
    );

    $response->assertStatus(200)
        ->assertJson(['status' => 'success']);

    Event::assertDispatched(PaymentReceived::class, function (PaymentReceived $event) {
        return $event->orderNumber === 'ORD-2026-TEST'
            && $event->transactionId === 'pi_test_987654321'
            && $event->amount === 185.0
            && $event->currency === 'USD';
    });
});
