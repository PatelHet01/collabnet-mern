import { requireProfile } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/dashboard/page-header';
import { ChatInbox } from '@/components/chat/chat-inbox';

export default async function MessagesPage() {
  const profile = await requireProfile();
  const supabase = await createClient();

  let threads = [];

  if (profile.role === 'brand') {
    const { data: brand } = await supabase.from('brands').select('id').eq('profile_id', profile.id).single();
    const { data } = await supabase
      .from('chat_threads')
      .select('id, campaign_id, creators(id, profiles(name)), campaigns(title)')
      .eq('brand_id', brand?.id)
      .order('created_at', { ascending: false });
    threads = (data || []).map((t) => ({
      id: t.id,
      partnerName: t.creators?.profiles?.name,
      partnerId: t.creators?.id,
      subtitle: t.campaigns?.title || 'Direct message',
    }));
  } else if (profile.role === 'creator') {
    const { data: creator } = await supabase.from('creators').select('id').eq('profile_id', profile.id).single();
    const { data } = await supabase
      .from('chat_threads')
      .select('id, campaign_id, brands(company_name), campaigns(title)')
      .eq('creator_id', creator?.id)
      .order('created_at', { ascending: false });
    threads = (data || []).map((t) => ({
      id: t.id,
      partnerName: t.brands?.company_name,
      partnerId: null,
      subtitle: t.campaigns?.title || 'Brand chat',
    }));
  }

  return (
    <>
      <PageHeader title="Messages" subtitle="Realtime chat between brands and creators" />
      <ChatInbox threads={threads} currentUserId={profile.id} role={profile.role} />
    </>
  );
}
