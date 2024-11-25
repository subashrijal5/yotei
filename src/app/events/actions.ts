"use server"

import { tursoClient } from "@/lib/database";
import {  Response } from "@/lib/type";
import { Event, EventRequest, eventRequestSchema } from "@/schemas/event";




export async function createEvent(requestData: EventRequest): Promise<Response<Event>> {

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
                    sql: `INSERT INTO availableDates (date, time, eventId) 
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