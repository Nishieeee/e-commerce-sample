import { z } from 'zod';

export const shippingAddressSchema = z.object({
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name exceeds maximum length'),
  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name exceeds maximum length'),
  email: z
    .string()
    .email('Please provide a valid VIP email address'),
  phone: z
    .string()
    .min(8, 'Phone number must be at least 8 digits')
    .max(20, 'Phone number exceeds maximum length'),
  addressLine1: z
    .string()
    .min(5, 'Street address must be at least 5 characters'),
  addressLine2: z.string().optional(),
  city: z
    .string()
    .min(2, 'City must be at least 2 characters'),
  state: z
    .string()
    .min(2, 'State / Province must be at least 2 characters'),
  postalCode: z
    .string()
    .min(4, 'Postal code must be at least 4 characters'),
  country: z.string().default('US'),
  saveAddress: z.boolean().optional().default(true),
});

export const checkoutFormSchema = z.object({
  shippingAddress: shippingAddressSchema,
  billingSameAsShipping: z.boolean().default(true),
  billingAddress: shippingAddressSchema.optional(),
  shippingMethod: z.enum(['standard', 'express']).default('standard'),
  paymentMethod: z.enum(['stripe', 'paypal', 'cod']).default('stripe'),
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvc: z.string().optional(),
  orderNotes: z.string().optional(),
});

export type ShippingAddressValues = z.infer<typeof shippingAddressSchema>;
export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;
