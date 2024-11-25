"use server"
import { tursoClient } from "@/lib/database";
import { Response } from "@/lib/type";

type SaveAvailabilityRequest = {
    eventId: number;
    userId: number;
    responses: {
      date: Date;
      status: string;
    }[];
  }
  
  export async function saveAvailability<T>(request: SaveAvailabilityRequest): Promise<Response<SaveAvailabilityRequest>> {
    try {
      const { eventId, userId, responses } = request;
  
      // Get available dates for the event to match with availableDateId
      const datesQuery = await tursoClient().execute({
        sql: `SELECT id, date FROM availableDates WHERE eventId = ?`,
        args: [eventId],
      });
  
      // Delete existing responses for this user and event
      await tursoClient().execute({
        sql: `DELETE FROM responses WHERE eventId = ? AND userId = ?`,
        args: [eventId, userId],
      });
  
      // Insert new responses
      await Promise.all(
        responses.map(async (response) => {
          // Find the matching availableDateId
          const availableDate = datesQuery.rows.find(
            row => new Date(row.date as string).toDateString() === response.date.toDateString()
          );
  
          if (!availableDate) {
            throw new Error(`Invalid date: ${response.date}`);
          }
  
          await tursoClient().execute({
            sql: `INSERT INTO responses (eventId, userId, availableDateId, status) 
                  VALUES (?, ?, ?, ?)`,
            args: [eventId, userId, availableDate.id, response.status],
          });
        })
      );
  
      return {
        success: true,
        message: "Availability saved successfully",
        data: {
          id: eventId,
          userId,
          responses,
        } as any,
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