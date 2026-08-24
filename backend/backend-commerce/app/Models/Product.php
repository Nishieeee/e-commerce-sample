<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Category;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use App\Observers\ProductObserver;

#[ObservedBy(ProductObserver::class)] 
class Product extends Model
{
    use HasFactory;
    protected $fillable = [
        'name', 
        'category_id', 
        'slug', 
        'sku', 
        'price', 
        'compare_at_price', 
        'description', 
        'is_active', 
        'rating', 
        'reviews',
        'badge_type',
        'specs',
    ];
    
    protected function name():Attribute {
        return Attribute::make( 
            set: fn (string $value) => [
                'name' => $value,
                'slug' => Str::slug($value)
            ],
        );
    }
    
    protected function casts(): array {
        return [ 
            'price'=>'decimal:2',
            'specs'=>'array'
        ];
    }
    
    public function category() {
        return $this->belongsTo(Category::class);
    }
    public function images() {
        return $this->hasMany(ProductImage::class);
    }
    public function orderItems() {
        return $this->hasMany(OrderItem::class);
    }
    public function inventory() {
        return $this->hasOne(InventoryItem::class);
    }
    public function cartItem() {
        return $this->belongsTo(CartItem::class);
    }
}
