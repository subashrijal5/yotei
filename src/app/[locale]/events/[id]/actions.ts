"use server"

import { tursoClient } from "@/lib/database";
import { Response } from "@/lib/type";
import { EventStatus } from "@/schemas/event";

type SaveAvailabilityRequest = {
  eventId: number;
  userId: number;
  displayName: string;
  responses: {
    date: Date;
    time: string;
    status: EventStatus;
  }[];
}

type SaveAvailabilityResponse = {
  id: number;
  userId: number;
  displayName: string;
  responses: {
    date: Date;
    time: string;
    status: EventStatus;
  }[];
}

export async function saveAvailability(
  request: SaveAvailabilityRequest
): Promise<Response<SaveAvailabilityResponse>> {
  try {
    const { eventId, userId, displayName, responses } = request;

    // Get available dates for the event to match with availableDateId
    const datesQuery = await tursoClient().execute({
      sql: `SELECT id, date, time FROM availableDates WHERE eventId = ?`,
      args: [eventId],
    });

    // Delete existing responses for this user and event
    await tursoClient().execute({
      sql: `DELETE FROM responses WHERE eventId = ? AND userId = ?`,
      args: [eventId, userId],
    });

    // Update or insert user's display name
    await tursoClient().execute({
      sql: `INSERT INTO users (id, displayName) VALUES (?, ?)
            ON CONFLICT(displayName) DO UPDATE SET userId = ?`,
      args: [userId, displayName, displayName],
    });

    // Insert new responses
    await Promise.all(
      responses.map(async (response) => {
        // Find the matching availableDateId
        const availableDate = datesQuery.rows.find(
          row => 
            new Date(row.date as string).toDateString() === response.date.toDateString() &&
            row.time === response.time
        );

        if (!availableDate) {
          throw new Error(`Invalid date/time: ${response.date} ${response.time}`);
        }

        await tursoClient().execute({
          sql: `INSERT INTO responses (eventId, userId, availableDateId, status, displayName) 
                VALUES (?, ?, ?, ?, ?)`,
          args: [eventId, userId, availableDate.id, response.status, displayName],
        });
      })
    );

    return {
      success: true,
      message: "Availability saved successfully",
      data: {
        id: eventId,
        userId,
        displayName,
        responses,
      },
    };
  } catch (error) {
    console.error("Error saving availability:", error);
    return {
      success: false,
      message: "Failed to save availability",
      errors: [(error as Error).message],
    };
  }
}