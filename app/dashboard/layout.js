import { requireProfile } from '@/lib/auth';
import { DashboardShell } from '@/components/dashboard/shell';

export default async function DashboardLayout({ children }) {
  const profile = await requireProfile();

  return <DashboardShell profile={profile}>{children}</DashboardShell>;
}
