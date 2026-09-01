<?php

namespace App\Services;

use App\Models\InventoryItem;

class InventoryService
{
    public function incrementReservedQuantity(int $product_id, int $quantity)
    {
        $inventory_item = InventoryItem::where('product_id', $product_id)->lockForUpdate()->first();
        // validation checks
        if (! $inventory_item || $inventory_item->quantity < $quantity) {
            abort(400, 'Insufficient Stock');
        }

        // do the operations for increment & decrement
        $inventory_item->reserved_quantity += $quantity;
        $inventory_item->quantity -= $quantity;

        $inventory_item->save();
    }

    public function releaseReservedQuantity(int $product_id, int $quantity)
    {
        $inventory_item = InventoryItem::where('product_id', $product_id)->firstOrFail();

        // release reserved_quantity by quantity
        $inventory_item->reserved_quantity -= $quantity;
        // then increase the stock with quantity amount
        $inventory_item->quantity += $quantity;

        $inventory_item->save();
    }

    public function incrementStockQuantity(int $product_id, int $quantity)
    {
        InventoryItem::where('product_id', $product_id)->increment('quantity', $quantity);
    }

    public function deductStock(int $product_id, int $quantity)
    {
        $inventory = InventoryItem::where('product_id', $product_id)->lockForUpdate()->first();

        if (! $inventory || $inventory->reserved_quantity < $quantity) {
            abort(400, 'Insufficient reserved stock');
        }

        $inventory->decrement('reserved_quantity', $quantity);
    }
}
