"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, MapPin, Share2, Users, Check, X, CircleHelp } from "lucide-react";
import { AvailabilityForm } from "@/components/availability-form";
import { EventStatus } from "@/schemas/event";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { saveAvailability } from "@/app/events/[id]/actions";

type EventResponse = {
  id: number;
  name: string;
  availableDates: {
    date: Date;
    status: EventStatus;
  }[];
};

type EventDetails = {
  id: number;
  title: string;
  description: string;
  location: string;
  dates: Date[];
  responses: EventResponse[];
};

type Props = {
  event: EventDetails;
};

export function EventDetail({ event }: Props) {
  const [showAvailabilityForm, setShowAvailabilityForm] = useState(false);

  const handleShare = async () => {
    try {
      await navigator.share({
        title: event.title,
        text: "Please check your availability for this event!",
        url: window.location.href,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleSubmitAvailability = async (responses: { date: Date; status: EventStatus }[]) => {
    try {
      // TODO: Get actual userId from auth
      const userId = 1; // Temporary userId for testing

      const result = await saveAvailability({
        eventId: event.id,
        userId,
        responses: responses.map(r => ({
          date: r.date,
          status: r.status,
        })),
      });

      if (result.success) {
        // TODO: Add toast notification
        console.log("Availability saved successfully");
        setShowAvailabilityForm(false);
        // TODO: Refresh the page to show updated responses
        window.location.reload();
      } else {
        // TODO: Add error toast notification
        console.error("Failed to save availability:", result.message);
      }
    } catch (error) {
      console.error("Error submitting availability:", error);
    }
  };

  const getStatusIcon = (status: EventStatus) => {
    switch (status) {
      case EventStatus.YEA:
        return <Check className="h-4 w-4 text-green-500" />;
      case EventStatus.NO:
        return <X className="h-4 w-4 text-red-500" />;
      case EventStatus.MAYBE:
        return <CircleHelp className="h-4 w-4 text-yellow-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{event.title}</CardTitle>
          <Button variant="outline" size="icon" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-muted-foreground">{event.description}</p>
        
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center space-x-2">
            <CalendarDays className="h-4 w-4" />
            <span>{event.dates.length} proposed dates</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>{event.responses.length} responses</span>
          </div>
        </div>

        {showAvailabilityForm ? (
          <div className="border rounded-lg p-4">
            <AvailabilityForm
              dates={event.dates}
              onSubmit={handleSubmitAvailability}
              onCancel={() => setShowAvailabilityForm(false)}
            />
          </div>
        ) : (
          <>
            <div className="border rounded-lg p-4 overflow-x-auto">
              <h3 className="font-semibold mb-4">Participant Availability</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-32">Date</TableHead>
                    {event.responses.map((response) => (
                      <TableHead key={response.id}>{response.name}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {event.dates.map((date) => (
                    <TableRow key={date.toISOString()}>
                      <TableCell className="font-medium">
                        {date.toLocaleDateString()}
                      </TableCell>
                      {event.responses.map((response) => {
                        const availability = response.availableDates.find(
                          (a) => a.date.toDateString() === date.toDateString()
                        );
                        return (
                          <TableCell key={response.id} className="text-center">
                            {availability ? getStatusIcon(availability.status) : "-"}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <Button 
              onClick={() => setShowAvailabilityForm(true)} 
              className="w-full bg-[#00B900] hover:bg-[#009900]"
            >
              Add Your Availability
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
