import { z } from 'zod';

export const travelerSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(5),
  nationality: z.string().min(2)
});

export const addOnsSchema = z.object({
  addOnIds: z.array(z.string()).default([])
});

export const flightSelectionSchema = z.object({
  offerId: z.string(),
  provider: z.string().optional(),
  price: z.number(),
  currency: z.string().length(3),
  seatIds: z.array(z.string()).default([]),
  seatTotal: z.number().optional(),
  segments: z.any().optional(),
  ticketing: z.any().optional(),
  recordLocator: z.string().optional()
});

export const bookingReviewSchema = z.object({
  packageId: z.string(),
  travelerCount: z.number().min(1),
  currency: z.string().length(3),
  promoCode: z.string().optional()
});

export type TravelerInput = z.infer<typeof travelerSchema>;
