"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Event } from "@/schemas/event";
import { CalendarDays, MapPin, Users, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  events: Event[];
};

export function EventList({ events }: Props) {
  const router = useRouter();

  const handleEventClick = (eventId: number) => {
    router.push(`/events/${eventId}`);
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <Card
          key={event.id}
          className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
          onClick={() => handleEventClick(event.id)}
        >
          <CardContent className="p-4">
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                  {event.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {event.description}
                </p>
              </div>
              
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="line-clamp-1">{event.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-primary" />
                  <span>{event.deadline ? new Date(event.deadline).toLocaleDateString() : 'No deadline'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <span>0 participants</span>
                </div>
              </div>
              
              <div className="flex justify-end">
                <ArrowRight className="h-5 w-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}