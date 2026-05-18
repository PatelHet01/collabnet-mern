'use client';

import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { AuthLayout } from '@/components/auth/auth-layout';
import { RoleSelect } from '@/components/auth/role-select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [role, setRole] = useState('brand');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = searchParams.get('role');
    if (q && ['brand', 'creator', 'agency'].includes(q)) setRole(q);
  }, [searchParams]);

  const extraLabel = role === 'brand' ? 'Company name' : role === 'agency' ? 'Agency name' : null;

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.target);
    const supabase = createClient();

    const meta = { name: fd.get('name'), role };
    if (role === 'brand') meta.company_name = fd.get('extra');
    if (role === 'agency') meta.agency_name = fd.get('extra');

    const { error } = await supabase.auth.signUp({
      email: fd.get('email'),
      password: fd.get('password'),
      options: { data: meta },
    });

    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success('Account created');
    router.push('/dashboard');
    router.refresh();
  }

  return (
    <AuthLayout
      roleAccent={role}
      title="Join CollabNet"
      subtitle="Register as a brand, creator, or agency. Campaign budgets are in INR."
    >
      <Card className="border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="font-display text-2xl lg:hidden">Register</CardTitle>
          <CardDescription>Takes under a minute</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <RoleSelect value={role} onChange={setRole} />
            <div className="space-y-2">
              <Label htmlFor="name">Your name</Label>
              <Input id="name" name="name" required />
            </div>
            {extraLabel && (
              <div className="space-y-2">
                <Label htmlFor="extra">{extraLabel}</Label>
                <Input id="extra" name="extra" required />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <PasswordInput id="password" name="password" minLength={6} required />
            </div>
            <Button type="submit" className="w-full rounded-full" disabled={loading}>
              {loading ? 'Creating…' : 'Create account'}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Have an account?{' '}
            <Link href="/login" className="font-medium underline">
              Log in
            </Link>
          </p>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading…</div>}>
      <RegisterForm />
    </Suspense>
  );
}
