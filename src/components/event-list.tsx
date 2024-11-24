"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, MapPin, Users } from "lucide-react";

// TODO: Replace with actual data fetching
const mockEvents = [
  {
    id: "1",
    title: "🍻 Friday Night Out",
    description: "Let's grab some drinks!",
    location: "Shibuya",
    dates: [new Date("2024-03-20"), new Date("2024-03-21")],
    responses: 3,
  },
  {
    id: "2",
    title: "🏊‍♂️ Beach Day",
    description: "Summer beach trip",
    location: "Enoshima",
    dates: [new Date("2024-03-25")],
    responses: 5,
  },
];

export function EventList() {
  return (
    <div className="space-y-4">
      {mockEvents.map((event) => (
        <Card key={event.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">{event.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">{event.description}</p>
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="h-4 w-4" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <CalendarDays className="h-4 w-4" />
                <span>{event.dates.length} proposed dates</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Users className="h-4 w-4" />
                <span>{event.responses} responses</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}