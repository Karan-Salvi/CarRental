import { z } from 'zod';

const CarTypeSchema = z.enum(['Sedan', 'SUV', 'Hatchback', 'Luxury', 'Sports']);
const BookingStatusSchema = z.enum(['pending', 'accepted', 'rejected', 'completed', 'cancelled']);

export const CarSchema = z.object({
  id: z.string(),
  make: z.string(),
  model: z.string(),
  year: z.number(),
  type: CarTypeSchema,
  pricePerDay: z.number(),
  location: z.string(),
  availability: z.boolean(),
  features: z.array(z.string()),
  images: z.array(z.string()),
  description: z.string(),
});

export type Car = z.infer<typeof CarSchema>;


const dateTransformer = z.preprocess((arg) => {
  if (typeof arg == "string" || arg instanceof Date) return new Date(arg);
}, z.date());

export const BookingSchema = z.object({
  id: z.string(),
  carId: z.string(),
  userId: z.string(),
  startDate: dateTransformer,
  endDate: dateTransformer,
  totalPrice: z.number(),
  status: BookingStatusSchema,
});

export type Booking = z.infer<typeof BookingSchema>;
