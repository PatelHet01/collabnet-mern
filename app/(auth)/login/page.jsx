'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { demoByRole } from '@/lib/demo-accounts';
import { AuthLayout } from '@/components/auth/auth-layout';
import { RoleSelect } from '@/components/auth/role-select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState('brand');
  const [email, setEmail] = useState(demoByRole.brand.email);
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);

  function onRoleChange(r) {
    setRole(r);
    if (demoByRole[r]) {
      setEmail(demoByRole[r].email);
      setPassword(demoByRole[r].password);
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single();

    if (profile?.role !== role) {
      await supabase.auth.signOut();
      toast.error(`This account is a ${profile?.role}, not ${role}.`);
      return;
    }

    router.push('/dashboard');
    router.refresh();
  }

  return (
    <AuthLayout
      roleAccent={role}
      title="Welcome back"
      subtitle="Pick your role, sign in, and jump into your workspace."
    >
      <Card className="border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="font-display text-2xl lg:hidden">Log in</CardTitle>
          <CardDescription>Demo accounts auto-fill when you change role</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <RoleSelect value={role} onChange={onRoleChange} includeAdmin />
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <PasswordInput
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in…' : 'Log in'}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            New here?{' '}
            <Link href="/register" className="font-medium underline">
              Create account
            </Link>
            {' · '}
            <Link href="/" className="underline">
              Home
            </Link>
          </p>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
