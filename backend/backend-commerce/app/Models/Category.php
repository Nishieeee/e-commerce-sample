<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    public function products() {
        return $this->hasMany(Product::class);
    }

    public function parent() {
        return $this->belongsTo(Category::class);
    }

    public function subcategories() {
        return $this->hasMany(Category::class);
    }

    protected $fillable = ['name', 'slug', 'description'];
}
