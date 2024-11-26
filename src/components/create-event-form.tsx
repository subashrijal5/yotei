"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { EventRequest, eventRequestSchema } from "@/schemas/event";
import { Textarea } from "./ui/textarea";
import { TimePicker } from "@/components/ui/time-picker";
import { X } from "lucide-react";
import { createEvent } from "@/app/[locale]/events/actions";
import { useToast } from "@/hooks/use-toast";
import { useLiff } from "./LiffProvider";


export function CreateEventForm() {
  const t = useTranslations('CreateEventForm');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {profile}= useLiff();
  const form = useForm<EventRequest>({
    resolver: zodResolver(eventRequestSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      dates: [],
    },
  });

  const { toast } = useToast();

  const [selectedDates, setSelectedDates] = useState<Array<{ date: Date; time: string }>>([]);

  useEffect(() => {
    const formattedDates = selectedDates.map(({ date, time }) => ({
      date,
      time,
    }));
    form.setValue("dates", formattedDates);
  }, [selectedDates, form]);

  const handleDateSelect = (date: Date) => {
    const dateString = date.toDateString();
    setSelectedDates(prev => {
      const existingIndex = prev.findIndex(d => d.date.toDateString() === dateString);
      if (existingIndex >= 0) {
        // Remove the date if it exists
        return prev.filter((_, i) => i !== existingIndex);
      }
      // Add the date if it doesn't exist
      return [...prev, { date, time: "19:00" }];
    });
  };

  const handleCalendarSelect = (dates: Date[] | undefined) => {
    if (!dates) {
      setSelectedDates([]);
      return;
    }

    const newDateStrings = new Set(dates.map(d => d.toDateString()));
    const currentDateStrings = new Set(selectedDates.map(d => d.date.toDateString()));

    // Find dates that were toggled
    for (const date of dates) {
      const dateString = date.toDateString();
      if (!currentDateStrings.has(dateString)) {
        handleDateSelect(date);
        return;
      }
    }

    for (const { date } of selectedDates) {
      const dateString = date.toDateString();
      if (!newDateStrings.has(dateString)) {
        handleDateSelect(date);
        return;
      }
    }
  };

  const handleTimeChange = (dateIndex: number, newTime: string) => {
    const newDates = [...selectedDates];
    newDates[dateIndex].time = newTime;
    setSelectedDates(newDates);
  };

  const removeDate = (dateIndex: number) => {
    setSelectedDates(selectedDates.filter((_, i) => i !== dateIndex));
  };

  const onSubmit = async (data: EventRequest) => {
    setIsSubmitting(true);
    try {
      const response = await createEvent({
        ...data,
        lineId: profile?.userId,
        displayName: profile?.displayName
      });
      
      if (!response.success) {
        response.errors?.forEach((error) => {
          // if validation error, show error message to each field
        });
        return;
      }

      toast({
        title: "Success",
        description: t('success'),
      });

      // Reset form
      form.reset();
      setSelectedDates([]);
    } catch (error) {
      toast({
        title: "Error",
        description: t('error'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="lg:grid lg:grid-cols-[1fr,420px] gap-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('title')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('titlePlaceholder')} {...field} className="max-w-md" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('description')}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t('descriptionPlaceholder')}
                      className="max-w-md h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('location')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('locationPlaceholder')} {...field} className="max-w-md" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="lg:mt-0 mt-4">
            <FormField
              control={form.control}
              name="dates"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('datesAndTimes')}</FormLabel>
                  <FormControl>
                    <div className="rounded-lg border bg-card">
                      <div className="p-3">
                        <div className="flex justify-center pb-3">
                          <Calendar
                            mode="multiple"
                            selected={selectedDates.map((d) => d.date)}
                            onSelect={handleCalendarSelect}
                            disabled={(date) => date < new Date()}
                            className="select-none"
                            classNames={{
                              months: "flex flex-col sm:flex-row space-y-3 sm:space-x-4 sm:space-y-0",
                              month: "space-y-3",
                              caption: "flex justify-center pt-1 relative items-center",
                              caption_label: "text-sm font-medium",
                              nav: "space-x-1 flex items-center",
                              nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                              nav_button_previous: "absolute left-1",
                              nav_button_next: "absolute right-1",
                              table: "w-full border-collapse space-y-1",
                              head_row: "flex justify-between",
                              head_cell: "text-muted-foreground font-normal text-xs w-8",
                              row: "flex w-full mt-1",
                              cell: "h-8 w-8 text-center text-sm relative p-0 [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                              day: "h-8 w-8 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                              day_selected: "bg-[#00B900] text-primary-foreground hover:bg-[#00B900] hover:text-primary-foreground focus:bg-[#00B900] focus:text-primary-foreground",
                              day_today: "bg-accent text-accent-foreground",
                              day_outside: "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
                              day_disabled: "text-muted-foreground opacity-50",
                              day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                              day_hidden: "invisible",
                            }}
                          />
                        </div>
                        
                        <div className="space-y-2 pt-2 border-t">
                          <div className="flex items-center justify-between">
                            <div className="text-sm font-medium">{t('selectedDates')}</div>
                            <div className="text-xs text-muted-foreground">
                              {t('datesSelected', { count: selectedDates.length })}
                            </div>
                          </div>
                          <div className="relative">
                            {selectedDates.length === 0 ? (
                              <div className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-2">
                                {t('noDatesSelected')}
                              </div>
                            ) : (
                              <div className="space-y-1 max-h-[140px] overflow-y-auto pr-1">
                                {selectedDates.map((dateObj, dateIndex) => (
                                  <div
                                    key={dateObj.date.toISOString()}
                                    className="flex items-center justify-between gap-2 rounded-lg bg-muted/50 p-1.5 pr-1"
                                  >
                                    <div className="font-medium text-sm">
                                      {format(dateObj.date, "MMM d (EEE)")}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <TimePicker
                                        value={dateObj.time}
                                        onChange={(newTime) => handleTimeChange(dateIndex, newTime)}
                                      />
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 hover:bg-destructive hover:text-destructive-foreground"
                                        onClick={() => removeDate(dateIndex)}
                                      >
                                        <X className="h-3.5 w-3.5" />
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full max-w-md bg-[#00B900] hover:bg-[#009900]"
          disabled={isSubmitting}
        >
          {isSubmitting ? t('creating') : t('createEvent')}
        </Button>
      </form>
    </Form>
  );
}