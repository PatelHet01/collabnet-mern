import { requireRole } from '@/lib/auth';
import { PageHeader } from '@/components/dashboard/page-header';
import { NewCampaignForm } from '@/components/campaigns/new-campaign-form';

export default async function NewCampaignPage() {
  await requireRole('brand');

  return (
    <>
      <PageHeader title="New campaign" subtitle="Set up a brief and budget" />
      <NewCampaignForm />
    </>
  );
}
