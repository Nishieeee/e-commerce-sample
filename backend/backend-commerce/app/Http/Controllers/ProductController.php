<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;

use Illuminate\Support\Facades\Cache;

// Resource
use App\Http\Resources\ProductResource;

class ProductController extends Controller
{
    public function index()
    {
        $products = Cache::remember('catalog.active', now()->addHours(24), function () {
            return Product::where('is_active', true)->with('category')->paginate(15);
        });
        
        return ProductResource::collection($products);
    }
}
