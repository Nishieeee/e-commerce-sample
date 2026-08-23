<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;


// Resource
use App\Http\Resources\ProductResource;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with('category')->paginate(15);
        return ProductResource::collection($products);
    }
}
