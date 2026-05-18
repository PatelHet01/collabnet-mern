'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { requireProfile } from '@/lib/auth';
import { rupeesToPaise } from '@/lib/format';

export async function sendMessage(campaignId, body) {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { error } = await supabase.from('messages').insert({
    campaign_id: campaignId || null,
    sender_id: profile.id,
    body,
  });

  if (error) return { error: error.message };
  revalidatePath('/dashboard/messages');
  return { ok: true };
}

export async function toggleShortlist(creatorId) {
  const profile = await requireProfile();
  if (profile.role !== 'brand') return { error: 'Brands only' };

  const supabase = await createClient();
  const { data: brand } = await supabase.from('brands').select('id').eq('profile_id', profile.id).single();

  const { data: existing } = await supabase
    .from('brand_shortlists')
    .select('id')
    .eq('brand_id', brand.id)
    .eq('creator_id', creatorId)
    .maybeSingle();

  if (existing) {
    await supabase.from('brand_shortlists').delete().eq('id', existing.id);
  } else {
    await supabase.from('brand_shortlists').insert({ brand_id: brand.id, creator_id: creatorId });
  }

  revalidatePath('/dashboard/shortlist');
  revalidatePath('/dashboard/match');
  return { ok: true };
}

export async function addToRoster(creatorId) {
  const profile = await requireProfile();
  if (profile.role !== 'agency') return { error: 'Agencies only' };

  const supabase = await createClient();
  const { data: agency } = await supabase.from('agencies').select('id').eq('profile_id', profile.id).single();

  const { error } = await supabase.from('agency_creators').insert({
    agency_id: agency.id,
    creator_id: creatorId,
  });

  if (error) return { error: error.message };
  revalidatePath('/dashboard/roster');
  return { ok: true };
}

export async function createPayout(creatorId, amountRupees, campaignId) {
  const supabase = await createClient();
  const { error } = await supabase.from('payouts').insert({
    creator_id: creatorId,
    campaign_id: campaignId,
    amount_paise: rupeesToPaise(amountRupees),
    status: 'pending',
  });
  if (error) return { error: error.message };
  return { ok: true };
}

export async function markNotificationRead(id) {
  const supabase = await createClient();
  await supabase.from('notifications').update({ read_at: new Date().toISOString() }).eq('id', id);
  revalidatePath('/dashboard/notifications');
  return { ok: true };
}
