"use server"

import { tursoClient } from "@/lib/database";
import { Response } from "@/lib/type";
import { Event, EventRequest, eventRequestSchema } from "@/schemas/event";

export async function createEvent(requestData: EventRequest): Promise<Response<Event>> {

    try {
        const safeResult = await eventRequestSchema.parseAsync(requestData);
        console.log("🚀 ~ file: actions.ts:11 ~ safeResult:", safeResult)
        let userId = null;
        let result;
        if (safeResult.lineId) {
            const { id } = await firstOrCreateUser(safeResult.displayName!, safeResult.lineId);
            // save in db
            result = await tursoClient().execute({
                sql: `INSERT INTO events (title, description, location, userId) 
                VALUES (?, ?, ?, ?) RETURNING id`,
                args: [safeResult.title, safeResult.description!, safeResult.location!, id],

            });
        } else {
            // save in db
            result = await tursoClient().execute({
                sql: `INSERT INTO events (title, description, location) 
                VALUES (?, ?, ?) RETURNING id`,
                args: [safeResult.title, safeResult.description!, safeResult.location!],

            });
        }


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


export async function firstOrCreateUser(displayName: string, lineId?: string): Promise<{ id: number; displayName: string }> {
    let user;
    if (lineId) {
        console.log("🚀 ~ file: actions.ts:61 ~ lineId:", lineId, displayName)
        user = await tursoClient().execute({
            sql: `SELECT id, displayName FROM users WHERE lineId = ?`,
            args: [lineId],
        });
        if (user.rows.length === 0) {
            user = await tursoClient().execute({
                sql: `INSERT INTO users (lineId, displayName) VALUES (?, ?) RETURNING id, displayName`,
                args: [lineId, displayName],
            });
        }
    } else {
        user = await tursoClient().execute({
            sql: `INSERT INTO users (displayName) VALUES (?) RETURNING id, displayName`,
            args: [displayName],
        });
    }

    return user.rows[0] as unknown as { id: number; displayName: string };
}