export interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  sku: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Order {
  id: string;
  order_number: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  subtotal: number;
  tax_amount: number;
  shipping_amount: number;
  total_amount: number;
  items: OrderItem[];
  created_at: string;
}

export interface CheckoutPayload {
  shipping_address_id: string;
  billing_address_id: string;
  payment_method: 'stripe' | 'paypal' | 'cod';
}
