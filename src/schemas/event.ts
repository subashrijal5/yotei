import { z } from "zod";

export const eventAvailableDateSchema = z.object({
    id: z.number(),
    eventId: z.number(),
    date: z.date(),
    time: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export type EventAvailableDate = z.infer<typeof eventAvailableDateSchema>;

export const eventSchema = z.object({
    id: z.number(),
    title: z.string(),
    userId: z.number().nullable().optional(),
    description: z.string().optional(),
    location: z.string().optional(),
    deadline: z.date().optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
    availableDates: z.array(eventAvailableDateSchema)
});

export type Event = z.infer<typeof eventSchema>;


export const eventRequestSchema = eventSchema.pick({
    title: true,
    description: true,
    location: true,
    deadline: true,
    userId: true
}).extend({
    title: z.string().min(2, {
        message: "Title must be at least 2 characters.",
    }),
    dates: z.array(eventAvailableDateSchema.pick({
        date: true,
        time: true,
    })).min(1, {
        message: "Please select at least one date.",
    }),
});

export type EventRequest = z.infer<typeof eventRequestSchema>;

export enum EventStatus {
    YEA = "yea",
    NO = "no",
    MAYBE = "maybe",
}

export const eventResponseSchema = z.object({
    id: z.number(),
    eventId: z.number(),
    availableDateId: z.number(),
    status: z.nativeEnum(EventStatus),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export type EventResponse = z.infer<typeof eventResponseSchema>;