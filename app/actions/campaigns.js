'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { requireProfile } from '@/lib/auth';

async function getBrandId(supabase, profileId) {
  const { data } = await supabase.from('brands').select('id').eq('profile_id', profileId).single();
  return data?.id;
}

async function getCreatorId(supabase, profileId) {
  const { data } = await supabase.from('creators').select('id').eq('profile_id', profileId).single();
  return data?.id;
}

export async function createCampaign(formData) {
  const profile = await requireProfile();
  if (profile.role !== 'brand') return { error: 'Brands only' };

  const supabase = await createClient();
  const brandId = await getBrandId(supabase, profile.id);
  if (!brandId) return { error: 'Brand profile missing' };

  const budget = Math.round(parseFloat(formData.get('budget') || '0') * 100);

  const { error } = await supabase.from('campaigns').insert({
    brand_id: brandId,
    title: formData.get('title'),
    brief: formData.get('brief'),
    budget_cents: budget,
    status: formData.get('publish') === 'on' ? 'open' : 'draft',
  });

  if (error) return { error: error.message };
  revalidatePath('/dashboard/campaigns');
  return { ok: true };
}

export async function updateCampaignStatus(campaignId, status) {
  const profile = await requireProfile();
  if (profile.role !== 'brand') return { error: 'Brands only' };

  const supabase = await createClient();
  const brandId = await getBrandId(supabase, profile.id);

  const { error } = await supabase
    .from('campaigns')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', campaignId)
    .eq('brand_id', brandId);

  if (error) return { error: error.message };
  revalidatePath('/dashboard/campaigns');
  return { ok: true };
}

export async function applyToCampaign(campaignId, pitch, rate) {
  const profile = await requireProfile();
  if (profile.role !== 'creator') return { error: 'Creators only' };

  const supabase = await createClient();
  const creatorId = await getCreatorId(supabase, profile.id);
  if (!creatorId) return { error: 'Creator profile missing' };

  const { error } = await supabase.from('campaign_applications').insert({
    campaign_id: campaignId,
    creator_id: creatorId,
    pitch,
    proposed_rate_cents: Math.round(parseFloat(rate || '0') * 100),
  });

  if (error) return { error: error.message };
  revalidatePath('/dashboard/collabs');
  revalidatePath('/dashboard/discover');
  return { ok: true };
}

export async function reviewApplication(applicationId, status) {
  const profile = await requireProfile();
  if (profile.role !== 'brand') return { error: 'Brands only' };

  const supabase = await createClient();

  const { error } = await supabase
    .from('campaign_applications')
    .update({ status })
    .eq('id', applicationId);

  if (error) return { error: error.message };

  if (status === 'accepted') {
    const { data: app } = await supabase
      .from('campaign_applications')
      .select('campaign_id, creator_id, proposed_rate_cents')
      .eq('id', applicationId)
      .single();

    if (app) {
      await supabase.from('campaigns').update({ status: 'in_progress' }).eq('id', app.campaign_id);
      await supabase.from('payouts').insert({
        creator_id: app.creator_id,
        campaign_id: app.campaign_id,
        amount_paise: app.proposed_rate_cents || 0,
        status: 'pending',
      });

      const { data: camp } = await supabase.from('campaigns').select('brand_id').eq('id', app.campaign_id).single();
      if (camp?.brand_id) {
        await supabase.from('chat_threads').upsert(
          {
            brand_id: camp.brand_id,
            creator_id: app.creator_id,
            campaign_id: app.campaign_id,
          },
          { onConflict: 'brand_id,creator_id,campaign_id', ignoreDuplicates: true }
        );
      }
      await supabase.from('notifications').insert({
        user_id: (
          await supabase.from('creators').select('profile_id').eq('id', app.creator_id).single()
        ).data?.profile_id,
        title: 'Application accepted',
        body: 'Your collab was approved. Payout is queued in INR.',
      });
    }
  }

  revalidatePath('/dashboard/campaigns');
  return { ok: true };
}
