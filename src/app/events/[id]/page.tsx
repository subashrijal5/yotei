import { tursoClient } from "@/lib/database";
import { EventStatus } from "@/schemas/event";
import { EventDetail } from "@/components/event-detail";
import { notFound } from "next/navigation";

type Props = {
  params: {
    id: string;
  };
};

export default async function EventPage({ params }: Props) {
  const { id } = params;
  console.log("🚀 ~ file: page.tsx:14 ~ id:", id)
  
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
        SELECT er.id, er.status, er.availableDateId, u.displayName as name
        FROM responses er
        JOIN users u ON er.userId = u.id
        WHERE er.eventId = ?
      `,
      args: [parseInt(id)],
    });

    // Process the data
    const dates = datesQuery.rows.map(row => new Date(row.date as string));
    const responses: { [key: string]: { 
      id: number;
      name: string;
      availableDates: { date: Date; status: EventStatus }[];
    }} = {};

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
          status: row.status as EventStatus,
        });
      }
    });

    const event = {
      id: eventRow.id as number,
      title: eventRow.title as string,
      description: eventRow.description as string,
      location: eventRow.location as string,
      dates,
      responses: Object.values(responses),
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