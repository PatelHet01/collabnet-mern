'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { requireProfile } from '@/lib/auth';
import { rupeesToPaise } from '@/lib/format';

async function brandId(supabase, profileId) {
  const { data } = await supabase.from('brands').select('id').eq('profile_id', profileId).single();
  return data?.id;
}

export async function addCalendarEvent(formData) {
  const profile = await requireProfile();
  if (profile.role !== 'brand') return { error: 'Brands only' };
  const supabase = await createClient();
  const bid = await brandId(supabase, profile.id);

  const { error } = await supabase.from('calendar_events').insert({
    brand_id: bid,
    title: formData.get('title'),
    description: formData.get('description'),
    event_date: formData.get('event_date'),
    event_type: formData.get('event_type') || 'general',
    campaign_id: formData.get('campaign_id') || null,
  });
  if (error) return { error: error.message };
  revalidatePath('/dashboard/calendar');
  return { ok: true };
}

export async function addContentSchedule(formData) {
  const profile = await requireProfile();
  if (profile.role !== 'brand') return { error: 'Brands only' };
  const supabase = await createClient();
  const bid = await brandId(supabase, profile.id);

  const { error } = await supabase.from('content_schedules').insert({
    brand_id: bid,
    title: formData.get('title'),
    platform: formData.get('platform'),
    scheduled_at: formData.get('scheduled_at'),
    notes: formData.get('notes'),
    campaign_id: formData.get('campaign_id') || null,
    status: 'scheduled',
  });
  if (error) return { error: error.message };
  revalidatePath('/dashboard/schedule');
  return { ok: true };
}

export async function addSocialMetric(formData) {
  const profile = await requireProfile();
  if (profile.role !== 'brand') return { error: 'Brands only' };
  const supabase = await createClient();

  const { error } = await supabase.from('social_metrics').insert({
    campaign_id: formData.get('campaign_id'),
    creator_id: formData.get('creator_id') || null,
    platform: formData.get('platform'),
    views: parseInt(formData.get('views') || '0', 10),
    clicks: parseInt(formData.get('clicks') || '0', 10),
    conversions: parseInt(formData.get('conversions') || '0', 10),
    spend_paise: rupeesToPaise(formData.get('spend')),
    recorded_at: formData.get('recorded_at') || new Date().toISOString().slice(0, 10),
  });
  if (error) return { error: error.message };
  revalidatePath('/dashboard/analytics');
  return { ok: true };
}

export async function getOrCreateThread(creatorId, campaignId) {
  const profile = await requireProfile();
  const supabase = await createClient();

  let brandIdVal, creatorIdVal = creatorId;

  if (profile.role === 'brand') {
    brandIdVal = await brandId(supabase, profile.id);
  } else if (profile.role === 'creator') {
    const { data: c } = await supabase.from('creators').select('id').eq('profile_id', profile.id).single();
    creatorIdVal = c?.id;
    const { data: camp } = await supabase.from('campaigns').select('brand_id').eq('id', campaignId).single();
    brandIdVal = camp?.brand_id;
  } else {
    return { error: 'Invalid role' };
  }

  const { data: existing } = await supabase
    .from('chat_threads')
    .select('id')
    .eq('brand_id', brandIdVal)
    .eq('creator_id', creatorIdVal)
    .eq('campaign_id', campaignId || null)
    .maybeSingle();

  if (existing) return { threadId: existing.id };

  const { data, error } = await supabase
    .from('chat_threads')
    .insert({ brand_id: brandIdVal, creator_id: creatorIdVal, campaign_id: campaignId || null })
    .select('id')
    .single();

  if (error) return { error: error.message };
  return { threadId: data.id };
}

export async function sendThreadMessage(threadId, body) {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { error } = await supabase.from('messages').insert({
    thread_id: threadId,
    sender_id: profile.id,
    body,
  });
  if (error) return { error: error.message };
  return { ok: true };
}
