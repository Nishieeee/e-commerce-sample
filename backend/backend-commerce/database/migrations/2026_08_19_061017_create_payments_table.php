<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->onDelete('cascade');
            $table->string('payment_method', 50); // 'stripe', 'paypal', 'cod', 'bank_transfer'
            $table->string('payment_status', 50)->default('pending'); // 'pending', 'authorized', 'captured', 'paid', 'failed', 'refunded'
            $table->string('transaction_id')->nullable()->unique();
            $table->decimal('amount', 10, 2);
            $table->string('currency', 10)->default('USD');
            $table->jsonb('payment_gateway_response')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
