'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { requireProfile } from '@/lib/auth';
import { rupeesToPaise } from '@/lib/format';

export async function savePricing(formData) {
  const profile = await requireProfile();
  if (profile.role !== 'creator') return { error: 'Creators only' };

  const supabase = await createClient();
  const { data: creator } = await supabase.from('creators').select('id').eq('profile_id', profile.id).single();

  const rows = [
    { content_type: 'instagram_reel', price_paise: rupeesToPaise(formData.get('reel')) },
    { content_type: 'instagram_story', price_paise: rupeesToPaise(formData.get('story')) },
    { content_type: 'youtube_video', price_paise: rupeesToPaise(formData.get('youtube')) },
    { content_type: 'ugc_bundle', price_paise: rupeesToPaise(formData.get('ugc')) },
  ];

  for (const row of rows) {
    if (!row.price_paise) continue;
    await supabase.from('creator_pricing').upsert(
      { creator_id: creator.id, ...row, description: formData.get('notes') },
      { onConflict: 'creator_id,content_type' }
    );
  }

  revalidatePath('/dashboard/pricing');
  revalidatePath('/dashboard/match');
  return { ok: true };
}
