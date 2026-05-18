import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function getProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile) return null;
  return { ...profile, email: user.email };
}

export async function requireProfile() {
  const profile = await getProfile();
  if (!profile) redirect('/login');
  return profile;
}

export async function requireRole(...roles) {
  const profile = await requireProfile();
  if (!roles.includes(profile.role)) redirect('/dashboard');
  return profile;
}
