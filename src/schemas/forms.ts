import { z } from "zod";

export const emailSchema = z.string().trim().email("Enter a valid email address.");

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Enter your name."),
  email: emailSchema,
  password: z.string().min(8, "Use at least 8 characters."),
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z.object({
  token: z.string().min(10),
  password: z.string().min(8, "Use at least 8 characters."),
});

export const contactSchema = z.object({
  name: z.string().trim().min(2),
  email: emailSchema,
  subject: z.string().trim().min(3),
  message: z.string().trim().min(10).max(2000),
});

export const newsletterSchema = z.object({
  email: emailSchema,
  consent: z.boolean().refine((value) => value, "Consent is required to subscribe."),
});

export const checkoutSchema = z.object({
  email: emailSchema,
  phone: z.string().trim().min(8, "Enter a phone number we can reach."),
  purchaserName: z.string().trim().min(2),
  isGift: z.boolean(),
  recipientName: z.string().trim().min(2),
  line1: z.string().trim().min(4),
  line2: z.string().optional(),
  city: z.string().trim().min(2),
  region: z.string().trim().min(2),
  postalCode: z.string().optional(),
  zoneId: z.string().min(1),
  deliveryDate: z.string().min(8),
  deliveryWindow: z.string().min(1),
  deliveryInstructions: z.string().max(400).optional(),
  giftMessage: z.string().max(280).optional(),
  substitutionPolicy: z.enum(["APPROVED_SUBSTITUTES", "CONTACT_CUSTOMER", "CANCEL_IF_UNAVAILABLE"]),
  promoCode: z.string().optional(),
  createAccount: z.boolean().optional(),
});

export const reviewSchema = z.object({
  productId: z.string(),
  displayName: z.string().trim().min(2).max(40),
  rating: z.number().int().min(1).max(5),
  body: z.string().trim().min(10).max(1000),
});

export const addressSchema = z.object({
  label: z.string().min(1),
  fullName: z.string().min(2),
  phone: z.string().optional(),
  line1: z.string().min(4),
  line2: z.string().optional(),
  city: z.string().min(2),
  region: z.string().min(2),
  postalCode: z.string().optional(),
});

export const productAdminSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  shortDescription: z.string().min(8),
  description: z.string().min(16),
  categoryId: z.string(),
  pricePesewas: z.number().int().positive(),
  compareAtPesewas: z.number().int().positive().optional().nullable(),
  stockQuantity: z.number().int().min(0),
  availability: z.enum(["AVAILABLE", "LOW_STOCK", "UNAVAILABLE", "MADE_TO_ORDER", "SEASONAL", "PREORDER"]),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  isBestseller: z.boolean(),
  careInstructions: z.string().optional(),
});
