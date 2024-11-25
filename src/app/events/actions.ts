"use server"

import { tursoClient } from "@/lib/database";
import { Event, EventRequest, eventRequestSchema } from "@/schemas/event";

type ErrorResponse = {
    success: false;
    message: string;
    errors: string[];
}

type SuccessResponse = {
    success: true;
    message: string;
    data: Event;
}
export type Response = ErrorResponse | SuccessResponse

export async function createEvent(requestData: EventRequest): Promise<Response> {

    try {
        const safeResult = await eventRequestSchema.parseAsync(requestData);
        
        // save in db
        const result = await tursoClient().execute({
            sql: `INSERT INTO events (title, description, location) 
            VALUES (?, ?, ?) RETURNING id`,
            args: [safeResult.title, safeResult.description!, safeResult.location!],
            
        });
        
        const eventId = result.rows[0].id;
  
        await Promise.all(
            safeResult.dates.map(async (date) => {
                await tursoClient().execute({
                    sql: `INSERT INTO available_dates (date, time, event_id) 
                    VALUES (?, ?, ?)`,
                    args: [date.date.toISOString(), date.time, eventId]
                });
            })
        );

        return {
            success: true,
            message: "Event created successfully",
            data: {
                ...safeResult,
                id: eventId as number,
                createdAt: new Date(),
                updatedAt: new Date(),
                userId: safeResult.userId,
                availableDates: []
            },
        };

    } catch (error) {
        console.error('Error creating event:', error);
        return {
            success: false,
            message: "Failed to create event",
            errors: error instanceof Error ? [error.message] : ['Unknown error occurred'],
        };
    }
}