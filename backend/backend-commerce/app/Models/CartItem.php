<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Category;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CartItem extends Model
{
    protected $fillable = [
        'id',
        'cart_id',
        'product_id',
        'quantity',
        'price_at_add',
    ];
}
