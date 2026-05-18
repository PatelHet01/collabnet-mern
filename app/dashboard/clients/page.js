import { requireRole } from '@/lib/auth';
import { PageHeader } from '@/components/dashboard/page-header';
import { Card, CardContent } from '@/components/ui/card';

export default async function ClientsPage() {
  await requireRole('agency');

  return (
    <>
      <PageHeader title="Clients" subtitle="Brands you work with" />
      <Card>
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          Client tracking for agencies lands in phase 2.
        </CardContent>
      </Card>
    </>
  );
}
