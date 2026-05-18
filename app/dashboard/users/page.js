import { requireRole } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/dashboard/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default async function UsersPage() {
  await requireRole('admin');
  const supabase = await createClient();

  const { data: users } = await supabase
    .from('profiles')
    .select('id, name, role, is_active, created_at')
    .order('created_at', { ascending: false });

  return (
    <>
      <PageHeader title="Users" subtitle="Everyone on the platform" />
      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Role</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((u) => (
                <tr key={u.id} className="border-b last:border-0">
                  <td className="p-4">{u.name}</td>
                  <td className="p-4 capitalize">{u.role}</td>
                  <td className="p-4">
                    <Badge variant={u.is_active ? 'solid' : 'default'}>
                      {u.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </>
  );
}
