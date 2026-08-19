<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
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
            'shipping_address'=>'array',
            'billing_address'=>'array',
            'total_amount'=>'decimal:2'
        ];
    }

    
}
