import { CreateEventForm } from '@/components/create-event-form';
import { EventList } from '@/components/event-list';
import { tursoClient } from '@/lib/database';
import { Event } from '@/schemas/event';
import { getLocale, getTranslations } from 'next-intl/server';


export default async function Home() {
  const locale = await getLocale();
  const t = await getTranslations('Homepage');
  const query = await tursoClient().execute({
    sql: `SELECT * FROM events ORDER BY createdAt DESC`,
    args: [],
  });

  const events: Event[] = query.rows.map((row) => ({
    id: row.id as number,
    title: row.title as string,
    description: row.description as string,
    location: row.location as string,
    deadline: row.deadline ? new Date(row.deadline as string) : undefined,
    createdAt: new Date(row.createdAt as string),
    updatedAt: new Date(row.updatedAt as string),
    availableDates: [],
  }));

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-12 bg-white dark:bg-gray-900 rounded-lg shadow-sm border dark:border-gray-800 p-6">
        <h2 className="text-xl font-semibold mb-6">{t('createEvent')}</h2>
        <CreateEventForm />
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">{t('yourEvents')}</h2>
        <EventList events={events} locale={locale} />
      </div>
    </div>
  );
}