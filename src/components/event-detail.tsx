"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, MapPin, Share2, Users, Check, X, CircleHelp } from "lucide-react";
import { AvailabilityForm } from "@/components/availability-form";
import { Event, EventStatus } from "@/schemas/event";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { saveAvailability } from "@/app/[locale]/events/[id]/actions";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";
import { useLiff } from "./LiffProvider";

type Props = {
  event: Event;
};

export function EventDetail({ event }: Props) {
  const t = useTranslations('EventDetail');
  const [showAvailabilityForm, setShowAvailabilityForm] = useState(false);
  const { toast } = useToast();
  const {profile}= useLiff();
  

  const availableDates = event.availableDates;

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: t('linkCopied'),
        description: t('linkCopiedDesc'),
      });
    } catch (error) {
      toast({
        title: t('copyError'),
        description: t('copyErrorDesc'),
        variant: "destructive",
      });
    }
  };

  const handleSubmitAvailability = async (
    availabilityResponses: { date: Date; time: string; status: EventStatus }[],
    displayName: string
  ) => {
    try {
      // Close form immediately for better UX
      setShowAvailabilityForm(false);

      const result = await saveAvailability({
        eventId: event.id,
        lineId: profile?.userId,
        displayName,
        responses: availabilityResponses,
      });

      if (result.success) {
        toast({
          title: t('availabilitySaved'),
          description: t('availabilitySavedDesc'),
        });
      } else {
        toast({
          title: t('saveError'),
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting availability:", error);
      toast({
        title: "Error",
        description: t('unexpectedError'),
        variant: "destructive",
      });
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

  const uniqueUsers = new Map<string, { dateId: number; displayName: string }>();
  
  availableDates.forEach((date) => {
    date.responses.forEach((response) => {
      uniqueUsers.set(response.displayName, {
        dateId: response.availableDateId,
        displayName: response.displayName,
      });
    });
  });
  const uniqueUsersArray = Array.from(uniqueUsers.values());

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
            <span>{t('proposedDates', { count: availableDates.length })}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>{t('responses', { count: availableDates.length })}</span>
          </div>
        </div>

        {showAvailabilityForm ? (
          <div className="border rounded-lg p-4">
            <AvailabilityForm
              dates={availableDates.map(date => ({ date: date.date, time: date.time! }))}
              onSubmit={handleSubmitAvailability}
              onCancel={() => setShowAvailabilityForm(false)}
            />
          </div>
        ) : (
          <>
            <div className="border rounded-lg p-4 overflow-x-auto">
              <h3 className="font-semibold mb-4">{t('participantAvailability')}</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-32">{t('date')}</TableHead>
                    {uniqueUsersArray.length > 0 && uniqueUsersArray.map((user) => (
                      <TableHead key={user.displayName}>{user.displayName}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {availableDates.map((date) => (
                    <TableRow key={date.id}>
                      <TableCell className="font-medium">{date.date.toDateString()}</TableCell>
                      {uniqueUsersArray.map((user) => {
                        const response = date.responses.find((r) => r.displayName === user.displayName);
                        return (
                          <TableCell key={user.displayName}>
                            {response ? getStatusIcon(response.status) : "-"}
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
              {t('addAvailability')}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
