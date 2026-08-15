import { z } from "zod";
import { EVENT_TYPES } from "@/database/models/event.model";

export const createEventSchema = z
  .object({
    title: z.string().min(3).max(200),
    description: z.string().min(20).max(10_000),
    type: z.enum(EVENT_TYPES),
    startAt: z.coerce.date(),
    endAt: z.coerce.date(),
    location: z.string().min(1).max(300),
    isOnline: z.boolean().default(true),
    capacity: z.number().int().positive().nullable().optional(),
    tags: z.array(z.string().min(1)).max(20).default([]),
    category: z.string().max(100).nullable().optional(),
  })
  .refine((data) => data.endAt > data.startAt, {
    message: "endAt must be after startAt",
    path: ["endAt"],
  });

export type CreateEventDto = z.infer<typeof createEventSchema>;

export const updateEventSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  description: z.string().min(20).max(10_000).optional(),
  type: z.enum(EVENT_TYPES).optional(),
  startAt: z.coerce.date().optional(),
  endAt: z.coerce.date().optional(),
  location: z.string().min(1).max(300).optional(),
  isOnline: z.boolean().optional(),
  capacity: z.number().int().positive().nullable().optional(),
  tags: z.array(z.string().min(1)).max(20).optional(),
  category: z.string().max(100).nullable().optional(),
});

export type UpdateEventDto = z.infer<typeof updateEventSchema>;

export const eventSearchQuerySchema = z.object({
  q: z.string().trim().max(200).optional(),
  type: z.enum(EVENT_TYPES).optional(),
  category: z.string().max(100).optional(),
  featured: z.coerce.boolean().optional(),
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type EventSearchQuery = z.infer<typeof eventSearchQuerySchema>;
