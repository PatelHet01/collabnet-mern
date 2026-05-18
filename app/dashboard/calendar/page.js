import { requireRole } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/dashboard/page-header';
import { BrandCalendar } from '@/components/brand/calendar-view';
import { CalendarForm } from '@/components/brand/calendar-form';

export default async function CalendarPage() {
  const profile = await requireRole('brand');
  const supabase = await createClient();
  const { data: brand } = await supabase.from('brands').select('id').eq('profile_id', profile.id).single();

  const start = new Date();
  start.setDate(1);
  const end = new Date(start.getFullYear(), start.getMonth() + 2, 0);

  const { data: events } = await supabase
    .from('calendar_events')
    .select('*')
    .eq('brand_id', brand?.id)
    .gte('event_date', start.toISOString().slice(0, 10))
    .lte('event_date', end.toISOString().slice(0, 10))
    .order('event_date');

  return (
    <>
      <PageHeader title="Campaign calendar" subtitle="Daily view of launches, reviews, and deadlines" />
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <BrandCalendar events={events || []} />
        </div>
        <CalendarForm />
      </div>
    </>
  );
}
