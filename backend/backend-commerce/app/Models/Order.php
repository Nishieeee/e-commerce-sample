<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = ['user_id', 'total_amount', 'status', 'order_number', 'shipping_address','billing_address', 'subtotal'];
    
    public function user() {
        return $this->belongsTo(User::class);
    }

    public function items() {
        return $this->hasMany(OrderItem::class);
    }

    public function payment() {
        return $this->hasOne(Payment::class);
    }

    protected function casts(): array {
        return [
            'order_number' => 'string',
            'shipping_address'=>'array',
            'billing_address'=>'array',
            'total_amount'=>'decimal:2',
            'subtotal'=>'decimal:2'
        ];
    }

    
}
