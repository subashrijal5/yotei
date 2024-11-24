"use client";

import { CreateEventForm } from '@/components/create-event-form';
import { EventList } from '@/components/event-list';
import { CalendarDays } from 'lucide-react';

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-center mb-8 space-x-2">
        <CalendarDays className="h-8 w-8 text-[#00B900]" />
        <h1 className="text-2xl font-bold">Line Event Scheduler</h1>
      </div>
      
      <div className="max-w-5xl mx-auto">
        <div className="mb-12 bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-6">Create New Event</h2>
          <CreateEventForm />
        </div>
        
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Your Events</h2>
          <EventList />
        </div>
      </div>
    </main>
  );
}