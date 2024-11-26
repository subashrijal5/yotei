import { tursoClient } from "@/lib/database";
import { Event, EventAvailableDate, EventStatus } from "@/schemas/event";
import { EventDetail } from "@/components/event-detail";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EventPage({params}: Props) {
  const {  id } = await params;
  
  try {
    // Fetch event details
    const eventQuery = await tursoClient().execute({
      sql: `SELECT * FROM events WHERE id = ?`,
      args: [parseInt(id)],
    });

    if (eventQuery.rows.length === 0) {
      notFound();
    }

    const eventRow = eventQuery.rows[0];

    // Fetch available dates
    const datesQuery = await tursoClient().execute({
      sql: `SELECT * FROM availableDates WHERE eventId = ?`,
      args: [parseInt(id)],
    });

    // Fetch responses
    const responsesQuery = await tursoClient().execute({
      sql: `
        SELECT er.id, er.status, er.availableDateId, u.displayName
        FROM responses er
        JOIN users u ON er.userId = u.id
        WHERE er.eventId = ?
      `,
      args: [parseInt(id)],
    });

    // Process the data
    // const dates = datesQuery.rows.map(row => new Date(row.date as string));
    const responses: { [key: string]: { 
      id: number;
      name: string;
      availableDates: EventAvailableDate[];
    }} = {}

    responsesQuery.rows.forEach((row) => {
      const name = row.name as string;
      if (!responses[name]) {
        responses[name] = {
          id: row.id as number,
          name,
          availableDates: [],
        };
      }
      
      const date = datesQuery.rows.find(d => d.id === row.availableDateId);
      if (date) {
        responses[name].availableDates.push({
          date: new Date(date.date as string),
          time: date.time as string,
          eventId: eventRow.id as number,
          id: row.id as number,
          responses: [],
          
        });
      }
    });

    const event: Event = {
      id: eventRow.id as number,
      title: eventRow.title as string,
      description: eventRow.description as string || undefined,
      location: eventRow.location as string || undefined,
      deadline: eventRow.deadline ? new Date(eventRow.deadline as string) : undefined,
      userId: eventRow.userId as number || null,
      createdAt: new Date(eventRow.createdAt as string),
      updatedAt: new Date(eventRow.updatedAt as string),
      availableDates: datesQuery.rows.map((row) => ({
        id: row.id as number,
        eventId: eventRow.id as number,
        date: new Date(row.date as string),
        time: row.time as string,
        createdAt: new Date(row.createdAt as string),
        updatedAt: new Date(row.updatedAt as string),
        responses: responsesQuery.rows.filter(r => r.availableDateId === row.id).map(r => ({
          id: r.id as number,
          displayName: r.displayName as string,
          eventId: eventRow.id as number,
          status: r.status as EventStatus,
          availableDateId: r.availableDateId as number,
          createdAt: new Date(r.createdAt as string),
          updatedAt: new Date(r.updatedAt as string),
        }))

      })),
    };

    return (
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <EventDetail event={event} />
      </main>
    );
  } catch (error) {
    console.error("Error fetching event data:", error);
    notFound();
  }
}