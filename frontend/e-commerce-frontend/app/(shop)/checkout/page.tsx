'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { checkoutFormSchema, type CheckoutFormValues } from '@/lib/validations';
import { useCartStore, type OrderReceipt } from '@/store/useCartStore';
import { useRouter } from 'next/navigation';
import {
  Lock,
  ShieldCheck,
  Check,
  Truck,
  CreditCard,
  AlertCircle,
  Clock,
  ArrowRight,
  ArrowLeft,
  Edit2,
  Package,
  User,
  MapPin,
  DollarSign,
  CheckCircle2,
  Wallet,
  Receipt,
} from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const { items, clearCart, setLastOrder } = useCartStore();
  const router = useRouter();

  const [activeStep, setActiveStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(900); // 15 minutes = 900 seconds

  // 15-Minute Urgency Stock Reservation Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    watch,
    trigger,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      shippingAddress: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'US',
        saveAddress: true,
      },
      billingSameAsShipping: true,
      shippingMethod: 'standard',
      paymentMethod: 'stripe',
      cardNumber: '4242 •••• •••• 4242',
      cardExpiry: '12/28',
      cardCvc: '888',
      orderNotes: '',
    },
  });

  const watchShippingMethod = watch('shippingMethod');
  const watchPaymentMethod = watch('paymentMethod');
  const watchShippingAddress = watch('shippingAddress');
  const watchBillingSame = watch('billingSameAsShipping');

  // Financial Calculations
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const isFreeShippingUnlocked = subtotal >= 150;
  
  const shippingFee =
    items.length === 0
      ? 0
      : watchShippingMethod === 'express'
      ? isFreeShippingUnlocked
        ? 0
        : 35.00
      : isFreeShippingUnlocked
      ? 0
      : 15.00;

  const taxRate = 0.085; // 8.5% regional tax
  const estimatedTax = subtotal * taxRate;
  const totalAmountDue = subtotal + shippingFee + estimatedTax;

  // Step 1 Validation Handler
  const handleProceedToShipping = async () => {
    const isStep1Valid = await trigger([
      'shippingAddress.firstName',
      'shippingAddress.lastName',
      'shippingAddress.email',
      'shippingAddress.phone',
      'shippingAddress.addressLine1',
      'shippingAddress.city',
      'shippingAddress.state',
      'shippingAddress.postalCode',
    ]);
    if (isStep1Valid) {
      setActiveStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Step 2 Validation Handler
  const handleProceedToPayment = () => {
    setActiveStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Final Form Submission
  const onSubmit = async (data: CheckoutFormValues) => {
    if (items.length === 0) return;

    setIsSubmitting(true);

    // Simulate atomic row-locking & payment processing delay
    await new Promise((resolve) => setTimeout(resolve, 1600));

    const orderNumber = `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const receipt: OrderReceipt = {
      orderNumber,
      createdAt: new Date().toISOString(),
      items: [...items],
      shippingAddress: {
        firstName: data.shippingAddress.firstName,
        lastName: data.shippingAddress.lastName,
        email: data.shippingAddress.email,
        phone: data.shippingAddress.phone,
        addressLine1: data.shippingAddress.addressLine1,
        addressLine2: data.shippingAddress.addressLine2,
        city: data.shippingAddress.city,
        state: data.shippingAddress.state,
        postalCode: data.shippingAddress.postalCode,
        country: data.shippingAddress.country,
      },
      shippingMethod: data.shippingMethod,
      paymentMethod: data.paymentMethod,
      subtotal,
      shippingFee,
      tax: estimatedTax,
      total: totalAmountDue,
    };

    setLastOrder(receipt);
    clearCart();
    setIsSubmitting(false);
    router.push('/checkout/success');
  };

  // Empty Bag Redirect UI
  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="bg-white border border-slate-200 rounded-sm p-12 sm:p-16 max-w-xl mx-auto space-y-6 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-slate-50 text-slate-400 mx-auto flex items-center justify-center border border-slate-200">
            <Package className="w-8 h-8 stroke-1" />
          </div>
          <h1 className="text-2xl font-extrabold text-indigo-950 font-heading">
            NO ITEMS IN CHECKOUT PIPELINE
          </h1>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            Your shopping bag is empty. Please select merchandise from the catalog before initiating atomic checkout.
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-5 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-rose-500 block mb-1">
            Secure Acquisition &bull; Step {activeStep} of 3
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-indigo-950 font-heading tracking-tight">
            Checkout Pipeline
          </h1>
        </div>

        {/* Security Badges */}
        <div className="flex items-center gap-4 text-xs text-slate-500 font-mono">
          <span className="flex items-center gap-1.5 text-emerald-600 font-bold">
            <Lock className="w-3.5 h-3.5" />
            <span>256-Bit SSL Encrypted</span>
          </span>
          <span>&bull;</span>
          <span>Atomic Stock Lock</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column (7 Cols): Multi-Step Accordion Flow */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* STEP 1: CUSTOMER IDENTIFICATION & SHIPPING COORDINATES */}
            <div className={`bg-white border-2 rounded-sm transition-all overflow-hidden ${
              activeStep === 1 ? 'border-indigo-950 shadow-md' : 'border-slate-200 opacity-90'
            }`}>
              {/* Accordion Header */}
              <div
                onClick={() => activeStep > 1 && setActiveStep(1)}
                className={`p-5 flex items-center justify-between cursor-pointer ${
                  activeStep === 1 ? 'bg-indigo-950 text-white' : 'bg-slate-50 text-indigo-950 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center font-mono font-bold text-xs ${
                    activeStep === 1 ? 'bg-rose-500 text-white' : activeStep > 1 ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'
                  }`}>
                    {activeStep > 1 ? '✓' : '1'}
                  </span>
                  <h2 className="font-extrabold text-sm sm:text-base uppercase tracking-wider font-heading">
                    Customer Identification &amp; Shipping Coordinates
                  </h2>
                </div>
                {activeStep > 1 && (
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 hover:text-rose-500 flex items-center gap-1">
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </span>
                )}
              </div>

              {/* Accordion Body: Step 1 Form */}
              {activeStep === 1 && (
                <div className="p-6 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* First Name */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                        First Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        {...register('shippingAddress.firstName')}
                        placeholder="John"
                        className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 focus:border-indigo-950 rounded-sm focus:outline-none text-indigo-950 font-medium"
                      />
                      {errors.shippingAddress?.firstName && (
                        <p className="text-[10px] text-rose-500 font-medium">
                          {errors.shippingAddress.firstName.message}
                        </p>
                      )}
                    </div>

                    {/* Last Name */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                        Last Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        {...register('shippingAddress.lastName')}
                        placeholder="Doe"
                        className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 focus:border-indigo-950 rounded-sm focus:outline-none text-indigo-950 font-medium"
                      />
                      {errors.shippingAddress?.lastName && (
                        <p className="text-[10px] text-rose-500 font-medium">
                          {errors.shippingAddress.lastName.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Email Address */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                        VIP Email Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        {...register('shippingAddress.email')}
                        placeholder="john.doe@nexusmerch.studio"
                        className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 focus:border-indigo-950 rounded-sm focus:outline-none text-indigo-950 font-medium font-mono"
                      />
                      {errors.shippingAddress?.email && (
                        <p className="text-[10px] text-rose-500 font-medium">
                          {errors.shippingAddress.email.message}
                        </p>
                      )}
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                        Phone (For SMS Allocation Alerts) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        {...register('shippingAddress.phone')}
                        placeholder="+1 (555) 019-2834"
                        className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 focus:border-indigo-950 rounded-sm focus:outline-none text-indigo-950 font-medium font-mono"
                      />
                      {errors.shippingAddress?.phone && (
                        <p className="text-[10px] text-rose-500 font-medium">
                          {errors.shippingAddress.phone.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Street Address Line 1 */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                      Street Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...register('shippingAddress.addressLine1')}
                      placeholder="742 Evergreen Terrace"
                      className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 focus:border-indigo-950 rounded-sm focus:outline-none text-indigo-950 font-medium"
                    />
                    {errors.shippingAddress?.addressLine1 && (
                      <p className="text-[10px] text-rose-500 font-medium">
                        {errors.shippingAddress.addressLine1.message}
                      </p>
                    )}
                  </div>

                  {/* Street Address Line 2 */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                      Apartment, Suite, Unit, etc. <span className="text-slate-400">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      {...register('shippingAddress.addressLine2')}
                      placeholder="Apt 4B / Floor 2"
                      className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 focus:border-indigo-950 rounded-sm focus:outline-none text-indigo-950 font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* City */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                        City <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        {...register('shippingAddress.city')}
                        placeholder="Springfield"
                        className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 focus:border-indigo-950 rounded-sm focus:outline-none text-indigo-950 font-medium"
                      />
                      {errors.shippingAddress?.city && (
                        <p className="text-[10px] text-rose-500 font-medium">
                          {errors.shippingAddress.city.message}
                        </p>
                      )}
                    </div>

                    {/* State */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                        State / Province <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        {...register('shippingAddress.state')}
                        placeholder="IL / Lisbon"
                        className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 focus:border-indigo-950 rounded-sm focus:outline-none text-indigo-950 font-medium"
                      />
                      {errors.shippingAddress?.state && (
                        <p className="text-[10px] text-rose-500 font-medium">
                          {errors.shippingAddress.state.message}
                        </p>
                      )}
                    </div>

                    {/* Postal Code */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                        Postal Code <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        {...register('shippingAddress.postalCode')}
                        placeholder="62704"
                        className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 focus:border-indigo-950 rounded-sm focus:outline-none text-indigo-950 font-medium font-mono"
                      />
                      {errors.shippingAddress?.postalCode && (
                        <p className="text-[10px] text-rose-500 font-medium">
                          {errors.shippingAddress.postalCode.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Country & Billing Same Checkbox */}
                  <div className="pt-2 border-t border-slate-100 space-y-3">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        id="billingSame"
                        {...register('billingSameAsShipping')}
                        className="w-4 h-4 rounded-sm text-indigo-950 focus:ring-indigo-950 border-slate-300 cursor-pointer"
                      />
                      <label htmlFor="billingSame" className="text-xs font-bold text-slate-700 cursor-pointer">
                        Billing coordinates are identical to shipping destination
                      </label>
                    </div>
                  </div>

                  {/* Proceed CTA */}
                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={handleProceedToShipping}
                      className="px-8 py-3.5 bg-indigo-950 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-widest rounded-sm transition-all flex items-center gap-2 shadow-md cursor-pointer"
                    >
                      <span>PROCEED TO SHIPPING METHOD</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Accordion Summary when Step > 1 */}
              {activeStep > 1 && (
                <div className="p-4 bg-slate-50/80 text-xs text-slate-600 flex items-center justify-between border-t border-slate-200">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>
                      <strong className="text-indigo-950">{watchShippingAddress.firstName} {watchShippingAddress.lastName}</strong> &bull; {watchShippingAddress.addressLine1}, {watchShippingAddress.city}, {watchShippingAddress.state} {watchShippingAddress.postalCode}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* STEP 2: SHIPPING & DELIVERY METHOD */}
            <div className={`bg-white border-2 rounded-sm transition-all overflow-hidden ${
              activeStep === 2 ? 'border-indigo-950 shadow-md' : 'border-slate-200 opacity-90'
            }`}>
              {/* Accordion Header */}
              <div
                onClick={() => activeStep > 2 && setActiveStep(2)}
                className={`p-5 flex items-center justify-between ${
                  activeStep === 2 ? 'bg-indigo-950 text-white' : 'bg-slate-50 text-indigo-950'
                } ${activeStep > 2 ? 'cursor-pointer hover:bg-slate-100' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center font-mono font-bold text-xs ${
                    activeStep === 2 ? 'bg-rose-500 text-white' : activeStep > 2 ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'
                  }`}>
                    {activeStep > 2 ? '✓' : '2'}
                  </span>
                  <h2 className="font-extrabold text-sm sm:text-base uppercase tracking-wider font-heading">
                    Shipping &amp; Delivery Method
                  </h2>
                </div>
                {activeStep > 2 && (
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 hover:text-rose-500 flex items-center gap-1">
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </span>
                )}
              </div>

              {/* Accordion Body: Step 2 Form */}
              {activeStep === 2 && (
                <div className="p-6 space-y-5">
                  <div className="space-y-3">
                    {/* Standard Ground Radio */}
                    <label
                      onClick={() => setValue('shippingMethod', 'standard')}
                      className={`flex items-center justify-between p-4 rounded-sm border-2 cursor-pointer transition-all ${
                        watchShippingMethod === 'standard'
                          ? 'border-indigo-950 bg-indigo-950/5 shadow-sm'
                          : 'border-slate-200 hover:border-slate-400 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          value="standard"
                          checked={watchShippingMethod === 'standard'}
                          onChange={() => setValue('shippingMethod', 'standard')}
                          className="w-4 h-4 text-indigo-950 focus:ring-indigo-950"
                        />
                        <div>
                          <span className="font-bold text-xs sm:text-sm text-indigo-950 uppercase tracking-wider block">
                            Standard Ground Courier
                          </span>
                          <span className="text-xs text-slate-500 font-normal">
                            Estimated delivery: 3-5 business days &bull; Tracked courier
                          </span>
                        </div>
                      </div>
                      <span className="font-mono font-extrabold text-sm text-indigo-950">
                        {isFreeShippingUnlocked ? <span className="text-emerald-600 font-bold">FREE</span> : '$15.00'}
                      </span>
                    </label>

                    {/* VIP Express Air Radio */}
                    <label
                      onClick={() => setValue('shippingMethod', 'express')}
                      className={`flex items-center justify-between p-4 rounded-sm border-2 cursor-pointer transition-all ${
                        watchShippingMethod === 'express'
                          ? 'border-indigo-950 bg-indigo-950/5 shadow-sm'
                          : 'border-slate-200 hover:border-slate-400 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          value="express"
                          checked={watchShippingMethod === 'express'}
                          onChange={() => setValue('shippingMethod', 'express')}
                          className="w-4 h-4 text-indigo-950 focus:ring-indigo-950"
                        />
                        <div>
                          <span className="font-bold text-xs sm:text-sm text-indigo-950 uppercase tracking-wider block flex items-center gap-2">
                            <span>VIP Express Air Delivery</span>
                            <span className="bg-rose-500 text-white text-[9px] px-1.5 py-0.5 rounded-sm uppercase">Recommended</span>
                          </span>
                          <span className="text-xs text-slate-500 font-normal">
                            Estimated delivery: 1-2 business days &bull; Priority customs clearance
                          </span>
                        </div>
                      </div>
                      <span className="font-mono font-extrabold text-sm text-indigo-950">
                        {isFreeShippingUnlocked ? <span className="text-emerald-600 font-bold">FREE</span> : '$35.00'}
                      </span>
                    </label>
                  </div>

                  <div className="pt-4 flex justify-between items-center border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setActiveStep(1)}
                      className="text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-indigo-950 flex items-center gap-1 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to Shipping Address</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleProceedToPayment}
                      className="px-8 py-3.5 bg-indigo-950 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-widest rounded-sm transition-all flex items-center gap-2 shadow-md cursor-pointer"
                    >
                      <span>PROCEED TO PAYMENT GATEWAY</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Accordion Summary when Step > 2 */}
              {activeStep > 2 && (
                <div className="p-4 bg-slate-50/80 text-xs text-slate-600 flex items-center justify-between border-t border-slate-200 font-medium">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>
                      Selected Tier: <strong className="text-indigo-950 uppercase">{watchShippingMethod === 'express' ? 'VIP Express Air (1-2 Days)' : 'Standard Ground Courier (3-5 Days)'}</strong>
                    </span>
                  </div>
                  <span className="font-mono font-bold text-indigo-950">
                    {shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}
                  </span>
                </div>
              )}
            </div>

            {/* STEP 3: PAYMENT GATEWAY INTEGRATION */}
            <div className={`bg-white border-2 rounded-sm transition-all overflow-hidden ${
              activeStep === 3 ? 'border-indigo-950 shadow-md' : 'border-slate-200 opacity-90'
            }`}>
              {/* Accordion Header */}
              <div
                className={`p-5 flex items-center justify-between ${
                  activeStep === 3 ? 'bg-indigo-950 text-white' : 'bg-slate-50 text-indigo-950'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center font-mono font-bold text-xs ${
                    activeStep === 3 ? 'bg-rose-500 text-white' : 'bg-slate-300 text-slate-700'
                  }`}>
                    3
                  </span>
                  <h2 className="font-extrabold text-sm sm:text-base uppercase tracking-wider font-heading">
                    Payment Gateway &amp; Atomic Verification
                  </h2>
                </div>
              </div>

              {/* Accordion Body: Step 3 Form */}
              {activeStep === 3 && (
                <div className="p-6 space-y-6">
                  {/* Payment Method Radio Cards */}
                  <div className="space-y-3">
                    {/* Stripe Card Reader */}
                    <div className={`rounded-sm border-2 transition-all ${
                      watchPaymentMethod === 'stripe' ? 'border-indigo-950 bg-indigo-950/5 shadow-sm' : 'border-slate-200 bg-white'
                    }`}>
                      <label
                        onClick={() => setValue('paymentMethod', 'stripe')}
                        className="p-4 flex items-center justify-between cursor-pointer block"
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            value="stripe"
                            checked={watchPaymentMethod === 'stripe'}
                            onChange={() => setValue('paymentMethod', 'stripe')}
                            className="w-4 h-4 text-indigo-950 focus:ring-indigo-950"
                          />
                          <span className="font-bold text-xs sm:text-sm text-indigo-950 uppercase tracking-wider flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-rose-500" />
                            <span>Stripe Credit / Debit Card</span>
                          </span>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-sm uppercase">
                          Instant Lock
                        </span>
                      </label>

                      {/* Simulated Card Input Reader */}
                      {watchPaymentMethod === 'stripe' && (
                        <div className="p-4 pt-0 space-y-3 border-t border-slate-200/60 mt-2 bg-white/80">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                              Card Number (Simulated Elements Reader)
                            </label>
                            <input
                              type="text"
                              {...register('cardNumber')}
                              className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-sm text-indigo-950 font-bold focus:outline-none"
                              readOnly
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                Expiration Date
                              </label>
                              <input
                                type="text"
                                {...register('cardExpiry')}
                                className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-sm text-indigo-950 font-bold focus:outline-none"
                                readOnly
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                Security CVC
                              </label>
                              <input
                                type="text"
                                {...register('cardCvc')}
                                className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-sm text-indigo-950 font-bold focus:outline-none"
                                readOnly
                              />
                            </div>
                          </div>
                          <p className="text-[10px] text-slate-500 flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>PCI-DSS Level 1 compliant tokenization. Your card details never touch our application server.</span>
                          </p>
                        </div>
                      )}
                    </div>

                    {/* PayPal Commerce Platform Radio */}
                    <label
                      onClick={() => setValue('paymentMethod', 'paypal')}
                      className={`p-4 flex items-center justify-between rounded-sm border-2 cursor-pointer transition-all ${
                        watchPaymentMethod === 'paypal' ? 'border-indigo-950 bg-indigo-950/5 shadow-sm' : 'border-slate-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          value="paypal"
                          checked={watchPaymentMethod === 'paypal'}
                          onChange={() => setValue('paymentMethod', 'paypal')}
                          className="w-4 h-4 text-indigo-950 focus:ring-indigo-950"
                        />
                        <span className="font-bold text-xs sm:text-sm text-indigo-950 uppercase tracking-wider flex items-center gap-2">
                          <Wallet className="w-4 h-4 text-indigo-600" />
                          <span>PayPal Commerce Smart Wallet</span>
                        </span>
                      </div>
                      <span className="text-xs font-mono text-slate-400">Fast Wallet Checkout</span>
                    </label>

                    {/* Cash on Delivery Radio */}
                    <label
                      onClick={() => setValue('paymentMethod', 'cod')}
                      className={`p-4 flex items-center justify-between rounded-sm border-2 cursor-pointer transition-all ${
                        watchPaymentMethod === 'cod' ? 'border-indigo-950 bg-indigo-950/5 shadow-sm' : 'border-slate-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          value="cod"
                          checked={watchPaymentMethod === 'cod'}
                          onChange={() => setValue('paymentMethod', 'cod')}
                          className="w-4 h-4 text-indigo-950 focus:ring-indigo-950"
                        />
                        <span className="font-bold text-xs sm:text-sm text-indigo-950 uppercase tracking-wider flex items-center gap-2">
                          <Receipt className="w-4 h-4 text-amber-600" />
                          <span>Cash / Physical Receipt on Delivery (COD)</span>
                        </span>
                      </div>
                      <span className="text-xs font-mono text-slate-400">Pay Courier on Arrival</span>
                    </label>
                  </div>

                  {/* Order Notes / Special Instructions */}
                  <div className="space-y-1.5 pt-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                      Special Delivery Instructions / Gate Code <span className="text-slate-400">(Optional)</span>
                    </label>
                    <textarea
                      {...register('orderNotes')}
                      placeholder="Leave package inside gate / Call on arrival..."
                      rows={2}
                      className="w-full p-3 text-xs bg-slate-50 border border-slate-200 focus:border-indigo-950 rounded-sm focus:outline-none text-indigo-950 font-medium"
                    />
                  </div>

                  <div className="pt-4 flex justify-start items-center border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setActiveStep(2)}
                      className="text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-indigo-950 flex items-center gap-1 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to Delivery Method</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Right Column (5 Cols): Order Summary & Stock Lock Sidebar */}
          <div className="lg:col-span-5 sticky top-24 space-y-6">
            
            {/* 15-Minute Urgency Inventory Lock Banner */}
            <div className="bg-slate-900 text-white p-4 rounded-sm flex items-center justify-between shadow-md border-l-4 border-rose-500 animate-pulse">
              <div className="flex items-center gap-2.5">
                <Clock className="w-5 h-5 text-rose-500 shrink-0" />
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">
                    Atomic Inventory Lock Active
                  </span>
                  <span className="text-xs font-extrabold uppercase tracking-wider">
                    Merch Reserved For Delivery
                  </span>
                </div>
              </div>
              <span className="font-mono text-base font-extrabold text-rose-500 bg-slate-800 px-2.5 py-1 rounded-sm border border-slate-700">
                {formatTime(timeLeft)}
              </span>
            </div>

            {/* Order Summary Box */}
            <div className="bg-white border-2 border-indigo-950 rounded-sm p-6 space-y-6 shadow-sm">
              <h2 className="font-extrabold text-lg text-indigo-950 font-heading uppercase tracking-wider border-b border-slate-200 pb-4 flex items-center justify-between">
                <span>Order Summary</span>
                <span className="text-xs font-mono font-normal text-slate-400">
                  {items.reduce((s, i) => s + i.quantity, 0)} Items
                </span>
              </h2>

              {/* Items List Preview */}
              <div className="max-h-60 overflow-y-auto space-y-3 divide-y divide-slate-100 pr-1">
                {items.map((item) => (
                  <div key={item.id} className="pt-3 first:pt-0 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-12 h-14 object-cover rounded-sm bg-slate-100 border border-slate-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="font-bold text-indigo-950 truncate">{item.name}</h4>
                        <span className="text-[10px] font-mono text-slate-400 block">
                          SKU: {item.sku} &bull; Qty: {item.quantity}
                        </span>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-indigo-950 shrink-0">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Financial Calculation Table */}
              <div className="space-y-2.5 pt-4 border-t border-slate-200 text-xs font-medium text-slate-600">
                <div className="flex items-center justify-between">
                  <span>Gross Subtotal</span>
                  <span className="font-mono font-bold text-indigo-950">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span>Shipping Tier ({watchShippingMethod === 'express' ? 'VIP Air' : 'Standard Ground'})</span>
                  <span className="font-mono font-bold text-indigo-950">
                    {shippingFee === 0 ? <span className="text-emerald-600 font-bold uppercase">FREE</span> : `$${shippingFee.toFixed(2)}`}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span>Estimated Tax (8.5%)</span>
                  <span className="font-mono font-bold text-indigo-950">
                    ${estimatedTax.toFixed(2)}
                  </span>
                </div>

                {/* Total Divider */}
                <div className="border-t border-slate-200 pt-3 flex items-baseline justify-between text-indigo-950">
                  <span className="font-extrabold text-sm uppercase tracking-wider font-heading">
                    Total Due Now
                  </span>
                  <span className="font-mono font-extrabold text-2xl tracking-tight text-rose-600">
                    ${totalAmountDue.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Primary Conversion Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || activeStep < 3}
                className={`w-full py-4 px-6 rounded-sm font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer ${
                  isSubmitting || activeStep < 3
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                    : 'bg-indigo-950 hover:bg-rose-500 text-white active:scale-98'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>ALLOCATING STOCK &amp; PROCESSING...</span>
                  </>
                ) : activeStep < 3 ? (
                  <span>COMPLETE STEP {activeStep} TO PAY</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>COMPLETE ACQUISITION &bull; ${totalAmountDue.toFixed(2)}</span>
                  </>
                )}
              </button>

              {/* Trust Badges */}
              <div className="pt-3 border-t border-slate-100 space-y-1.5 text-[11px] text-slate-500 text-center">
                <p className="flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Atomic Row-Locking &bull; Zero Overselling Guarantee</span>
                </p>
                <p className="text-[10px] text-slate-400">
                  By completing this acquisition, you agree to NEXUS Studio terms of release.
                </p>
              </div>

            </div>
          </div>

        </div>
      </form>
    </div>
  );
}
