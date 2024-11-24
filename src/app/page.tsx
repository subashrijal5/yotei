import { CreateEventButton } from '@/components/create-event-button';
import { EventList } from '@/components/event-list';
import { CalendarDays } from 'lucide-react';

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-6 max-w-2xl">
      <div className="flex items-center justify-center mb-8 space-x-2">
        <CalendarDays className="h-8 w-8 text-[#00B900]" />
        <h1 className="text-2xl font-bold">Line Event Scheduler</h1>
      </div>
      
      <CreateEventButton />
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Your Events</h2>
        <EventList />
      </div>
    </main>
  );
}