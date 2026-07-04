export interface KPIMetrics {
  total_revenue: number;
  total_orders: number;
  active_customers: number;
  low_stock_count: number;
}

export interface InventoryLog {
  id: string;
  product_id: string;
  change_quantity: number;
  previous_quantity: number;
  new_quantity: number;
  reason: 'sale' | 'restock' | 'return' | 'manual';
  created_at: string;
}

export interface StockAdjustment {
  change_quantity: number;
  reason: 'restock' | 'return' | 'manual';
}
