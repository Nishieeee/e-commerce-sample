<?php

declare(strict_type=1);

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Events\PaymentReceived;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WebHookController extends Controller
{
    public function handleStripeWebHook(Request $request):JsonResponse {
         
    }
}
