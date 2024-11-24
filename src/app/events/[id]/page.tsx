"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarDays, MapPin, Share2, Users } from "lucide-react";

// TODO: Replace with actual data fetching
const mockEvent = {
  id: "1",
  title: "🍻 Friday Night Out",
  description: "Let's grab some drinks!",
  location: "Shibuya",
  dates: [new Date("2024-03-20"), new Date("2024-03-21")],
  responses: [
    { name: "Tanaka", availableDates: [new Date("2024-03-20")] },
    { name: "Yamada", availableDates: [new Date("2024-03-21")] },
    { name: "Suzuki", availableDates: [new Date("2024-03-20"), new Date("2024-03-21")] },
  ],
};

export default function EventPage() {
  const params = useParams();
  const { id } = params;

  const handleShare = async () => {
    try {
      await navigator.share({
        title: mockEvent.title,
        text: "Please check your availability for this event!",
        url: window.location.href,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <main className="container mx-auto px-4 py-6 max-w-2xl">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">{mockEvent.title}</CardTitle>
            <Button variant="outline" size="icon" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">{mockEvent.description}</p>
          
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>{mockEvent.location}</span>
            </div>
            <div className="flex items-center space-x-2">
              <CalendarDays className="h-4 w-4" />
              <span>{mockEvent.dates.length} proposed dates</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>{mockEvent.responses.length} responses</span>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-4">Proposed Dates</h3>
            <Calendar
              mode="multiple"
              selected={mockEvent.dates}
              className="rounded-md border"
              disabled
            />
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-4">Responses</h3>
            <div className="space-y-2">
              {mockEvent.responses.map((response, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span>{response.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {response.availableDates.length} dates available
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Button className="w-full bg-[#00B900] hover:bg-[#009900]">
            Add Your Availability
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}