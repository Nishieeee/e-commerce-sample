import type { User, Address } from '@/types/auth';
import type { Order } from '@/types/order';
import type { KPIMetrics, InventoryLog } from '@/types/admin';

export const SAMPLE_USER_CUSTOMER: User = {
  id: 'usr-1',
  name: 'Alex Vance',
  email: 'alex.vance@nexusmerch.com',
  role: 'customer',
  phone: '+351 912 345 678',
};

export const SAMPLE_USER_ADMIN: User = {
  id: 'usr-admin-1',
  name: 'Sarah Jenkins',
  email: 'admin@nexusmerch.com',
  role: 'admin',
  phone: '+351 987 654 321',
};

export const SAMPLE_ADDRESSES: Address[] = [
  {
    id: 'addr-1',
    label: 'Lisbon Studio (Default)',
    full_name: 'Alex Vance',
    address_line1: 'Av. da Liberdade 245, 4th Floor',
    city: 'Lisbon',
    state: 'Lisbon',
    postal_code: '1250-143',
    country: 'Portugal',
    is_default_shipping: true,
  },
  {
    id: 'addr-2',
    label: 'Berlin Residence',
    full_name: 'Alex Vance',
    address_line1: 'Torstraße 102',
    city: 'Berlin',
    state: 'Berlin',
    postal_code: '10119',
    country: 'Germany',
    is_default_shipping: false,
  },
];

export const SAMPLE_ORDERS: Order[] = [
  {
    id: 'ord-1',
    order_number: 'ORD-2026-8892',
    status: 'shipped',
    subtotal: 178.00,
    tax_amount: 14.24,
    shipping_amount: 0.00, // Free VIP air delivery
    total_amount: 192.24,
    created_at: '2026-06-28T14:30:00Z',
    items: [
      {
        id: 'item-1',
        product_id: 'm1',
        product_name: 'Core 400 GSM Heavyweight Hoodie',
        sku: 'MRCH-HD-001',
        quantity: 2,
        unit_price: 89.00,
        total_price: 178.00,
      },
    ],
  },
  {
    id: 'ord-2',
    order_number: 'ORD-2026-7410',
    status: 'delivered',
    subtotal: 110.00,
    tax_amount: 8.80,
    shipping_amount: 15.00,
    total_amount: 133.80,
    created_at: '2026-05-15T09:15:00Z',
    items: [
      {
        id: 'item-2',
        product_id: 'm2',
        product_name: 'Boxy Fit Heavy-Cotton Graphic Tee',
        sku: 'MRCH-TE-002',
        quantity: 1,
        unit_price: 45.00,
        total_price: 45.00,
      },
      {
        id: 'item-3',
        product_id: 'm3',
        product_name: 'Matte Onyx & Titanium Cuff Bracelet',
        sku: 'MRCH-BR-003',
        quantity: 1,
        unit_price: 65.00,
        total_price: 65.00,
      },
    ],
  },
];

export const SAMPLE_KPI_METRICS: KPIMetrics = {
  total_revenue: 142850.00,
  total_orders: 1240,
  active_customers: 890,
  low_stock_count: 3,
};

export const SAMPLE_INVENTORY_LOGS: InventoryLog[] = [
  {
    id: 'log-1',
    product_id: 'm2',
    change_quantity: -15,
    previous_quantity: 18,
    new_quantity: 3,
    reason: 'sale',
    created_at: '2026-06-30T11:20:00Z',
  },
  {
    id: 'log-2',
    product_id: 'm3',
    change_quantity: -8,
    previous_quantity: 10,
    new_quantity: 2,
    reason: 'sale',
    created_at: '2026-06-29T16:45:00Z',
  },
  {
    id: 'log-3',
    product_id: 'm1',
    change_quantity: 20,
    previous_quantity: 4,
    new_quantity: 24,
    reason: 'restock',
    created_at: '2026-06-25T08:00:00Z',
  },
];
