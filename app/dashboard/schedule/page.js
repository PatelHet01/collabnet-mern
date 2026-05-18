import { requireRole } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/dashboard/page-header';
import { ScheduleForm } from '@/components/brand/schedule-form';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default async function SchedulePage() {
  const profile = await requireRole('brand');
  const supabase = await createClient();
  const { data: brand } = await supabase.from('brands').select('id').eq('profile_id', profile.id).single();

  const { data: items } = await supabase
    .from('content_schedules')
    .select('*')
    .eq('brand_id', brand?.id)
    .order('scheduled_at', { ascending: true });

  return (
    <>
      <PageHeader title="Content scheduler" subtitle="Plan posts across Instagram, YouTube, and more" />
      <div className="grid gap-8 lg:grid-cols-3">
        <Card className="border-border/60 bg-card/90 lg:col-span-2">
          <CardContent className="p-0">
            {!items?.length ? (
              <p className="p-8 text-sm text-muted-foreground">No scheduled content yet.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="p-4 font-medium">Title</th>
                    <th className="p-4 font-medium">Platform</th>
                    <th className="p-4 font-medium">When</th>
                    <th className="p-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((row) => (
                    <tr key={row.id} className="border-b last:border-0">
                      <td className="p-4 font-medium">{row.title}</td>
                      <td className="p-4 capitalize">{row.platform}</td>
                      <td className="p-4">
                        {new Date(row.scheduled_at).toLocaleString('en-IN', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}
                      </td>
                      <td className="p-4">
                        <Badge>{row.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
        <ScheduleForm />
      </div>
    </>
  );
}
