<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProductResource;
use App\Models\Product;
// Resource
use Illuminate\Support\Facades\Cache;

class ProductController extends Controller
{
    public function index()
    {
        $products = Cache::remember('catalog.active', now()->addHours(24), function () {
            return Product::where('is_active', true)->with('category')->paginate(15);
        });

        return ProductResource::collection($products);
    }

    public function store(AddNewProductRequest $request): JsonResponse {

        // validate request
        $request->validated();

        // pass to dto

        // run services
        // create product then store to Cache

        
        // run bg jobs
        
        // return JsonResponse
        return response()->json([
           'message'=>'Product added successfully', 
        ], 201);
    }
}
