'use client';

import React from 'react';
import { useCartStore } from '@/store/useCartStore';
import {
  CheckCircle2,
  Printer,
  Package,
  MapPin,
  CreditCard,
  Truck,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Calendar,
  FileText,
} from 'lucide-react';
import Link from 'next/link';

export default function CheckoutSuccessPage() {
  const { lastOrder } = useCartStore();

  const handlePrint = () => {
    window.print();
  };

  // Fallback if accessed directly without an order
  if (!lastOrder) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="bg-white border border-slate-200 rounded-sm p-12 sm:p-16 max-w-xl mx-auto space-y-6 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-slate-50 text-slate-400 mx-auto flex items-center justify-center border border-slate-200">
            <FileText className="w-8 h-8 stroke-1" />
          </div>
          <h1 className="text-2xl font-extrabold text-indigo-950 font-heading">
            NO RECENT ACQUISITION FOUND
          </h1>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            We couldn&apos;t find an active order receipt in your session storage. Please complete an acquisition from the catalog first.
          </p>
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 px-8 py-3 bg-indigo-950 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-widest rounded-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Merch Catalog</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 print:py-4 print:max-w-full">
      
      {/* Action Buttons (Hidden in Print) */}
      <div className="flex items-center justify-between mb-6 print:hidden">
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-indigo-950 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Continue Shopping Merch</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 bg-white border border-slate-200 hover:border-indigo-950 text-indigo-950 font-bold text-xs uppercase tracking-wider rounded-sm transition-all flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <Printer className="w-4 h-4 text-rose-500" />
            <span>Print Official Receipt</span>
          </button>
        </div>
      </div>

      {/* Official Receipt Card */}
      <div className="bg-white border-2 border-indigo-950 rounded-sm p-6 sm:p-10 space-y-8 shadow-md print:border-slate-300 print:shadow-none print:p-6">
        
        {/* Receipt Header */}
        <div className="text-center space-y-3 border-b border-slate-200 pb-8">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 flex items-center justify-center rounded-full mx-auto shadow-sm print:w-12 print:h-12">
            <CheckCircle2 className="w-8 h-8 print:w-6 print:h-6" />
          </div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-sm inline-block">
            Atomic Lock Secured &bull; Verified Transaction
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-indigo-950 font-heading tracking-tight">
            Acquisition Confirmed
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            Thank you, <strong className="text-indigo-950">{lastOrder.shippingAddress.firstName}</strong>. Your order has been registered in our OMS database and dispatched to the Lisbon logistics hub.
          </p>
        </div>

        {/* Order Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-sm text-xs font-mono">
          <div>
            <span className="text-[10px] uppercase text-slate-400 block font-bold">Order Number</span>
            <strong className="text-indigo-950 text-sm font-extrabold">{lastOrder.orderNumber}</strong>
          </div>
          <div>
            <span className="text-[10px] uppercase text-slate-400 block font-bold">Timestamp</span>
            <strong className="text-indigo-950">
              {new Date(lastOrder.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </strong>
          </div>
          <div>
            <span className="text-[10px] uppercase text-slate-400 block font-bold">Payment Method</span>
            <strong className="text-indigo-950 uppercase">
              {lastOrder.paymentMethod === 'stripe' ? 'Stripe Card' : lastOrder.paymentMethod === 'paypal' ? 'PayPal Wallet' : 'COD Receipt'}
            </strong>
          </div>
          <div>
            <span className="text-[10px] uppercase text-slate-400 block font-bold">Fulfillment Status</span>
            <span className="text-emerald-600 font-extrabold uppercase">Processing</span>
          </div>
        </div>

        {/* 2-Column Details: Shipping Destination vs Delivery Tier */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          {/* Destination Snapshot */}
          <div className="p-4 border border-slate-200 rounded-sm space-y-2 bg-white">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-950 border-b border-slate-100 pb-2">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
              <span>Delivery Coordinates</span>
            </div>
            <div className="text-xs text-slate-600 leading-relaxed font-medium">
              <p className="font-bold text-indigo-950">
                {lastOrder.shippingAddress.firstName} {lastOrder.shippingAddress.lastName}
              </p>
              <p>{lastOrder.shippingAddress.addressLine1}</p>
              {lastOrder.shippingAddress.addressLine2 && <p>{lastOrder.shippingAddress.addressLine2}</p>}
              <p>
                {lastOrder.shippingAddress.city}, {lastOrder.shippingAddress.state} {lastOrder.shippingAddress.postalCode}
              </p>
              <p className="font-mono text-[11px] text-slate-400 pt-1">
                {lastOrder.shippingAddress.email} &bull; {lastOrder.shippingAddress.phone}
              </p>
            </div>
          </div>

          {/* Shipping Method Tier */}
          <div className="p-4 border border-slate-200 rounded-sm space-y-2 bg-white flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-950 border-b border-slate-100 pb-2">
                <Truck className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Logistics Tier</span>
              </div>
              <div className="text-xs text-slate-600 pt-2 space-y-1">
                <p className="font-bold text-indigo-950 uppercase">
                  {lastOrder.shippingMethod === 'express' ? 'VIP Express Air Delivery' : 'Standard Ground Courier'}
                </p>
                <p className="text-slate-500">
                  {lastOrder.shippingMethod === 'express'
                    ? 'Estimated Arrival: 1-2 Business Days (Priority Hub)'
                    : 'Estimated Arrival: 3-5 Business Days (Standard Ground)'}
                </p>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Carrier Allocation:</span>
              <strong className="text-indigo-950">DHL Express / FedEx Air</strong>
            </div>
          </div>
        </div>

        {/* Itemized Merchandise Breakdown */}
        <div className="space-y-4 pt-2">
          <h3 className="font-extrabold text-sm uppercase tracking-wider text-indigo-950 font-heading border-b border-slate-200 pb-2">
            Itemized Acquisition Manifest ({lastOrder.items.reduce((s, i) => s + i.quantity, 0)} Items)
          </h3>
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-sm overflow-hidden">
            {lastOrder.items.map((item, idx) => (
              <div key={idx} className="p-4 flex items-center justify-between gap-4 bg-white hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-14 h-16 object-cover rounded-sm bg-slate-100 border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="font-bold text-sm text-indigo-950 truncate">{item.name}</h4>
                    <span className="text-[11px] font-mono text-slate-400 block">
                      SKU: {item.sku} &bull; Unit Price: ${item.price.toFixed(2)}
                    </span>
                    <span className="text-xs font-mono font-bold text-indigo-950 block pt-0.5">
                      Quantity: x{item.quantity}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-mono font-extrabold text-sm sm:text-base text-indigo-950">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Summary Breakdown */}
        <div className="bg-slate-50 border border-slate-200 p-6 rounded-sm space-y-3 max-w-md ml-auto text-xs font-medium text-slate-600">
          <div className="flex items-center justify-between">
            <span>Gross Subtotal</span>
            <span className="font-mono font-bold text-indigo-950">
              ${lastOrder.subtotal.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Shipping Fee</span>
            <span className="font-mono font-bold text-indigo-950">
              {lastOrder.shippingFee === 0 ? (
                <span className="text-emerald-600 font-bold uppercase">FREE</span>
              ) : (
                `$${lastOrder.shippingFee.toFixed(2)}`
              )}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Regional Sales Tax (8.5%)</span>
            <span className="font-mono font-bold text-indigo-950">
              ${lastOrder.tax.toFixed(2)}
            </span>
          </div>
          <div className="border-t border-slate-200 pt-3 flex items-baseline justify-between text-indigo-950">
            <span className="font-extrabold text-sm uppercase tracking-wider font-heading">
              Total Amount Paid
            </span>
            <span className="font-mono font-extrabold text-2xl tracking-tight text-rose-600">
              ${lastOrder.total.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Security Footer & Next Steps */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="text-xs text-slate-500 space-y-1">
            <p className="flex items-center justify-center sm:justify-start gap-1.5 font-bold text-indigo-950">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>NEXUS Studio Lifetime Hardware Warranty Included</span>
            </p>
            <p className="text-[11px] text-slate-400">
              A digital copy of this tax invoice has been dispatched to {lastOrder.shippingAddress.email}.
            </p>
          </div>

          {/* Track Shipment Button (Hidden in Print) */}
          <Link
            href="/orders"
            className="px-8 py-3.5 bg-indigo-950 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-widest rounded-sm transition-all flex items-center gap-2 shadow-md shrink-0 print:hidden"
          >
            <Package className="w-4 h-4" />
            <span>TRACK IN OMS PORTAL</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
