import { createAdminClient } from '@/lib/supabase/admin';
import { ensureInAppConversationSchema } from '@/lib/db/ensureInAppConversationSchema';
import LandlordInquiry from '@/lib/db/entities/LandlordInquiry';
import { type ConversationMessage, toConversationMessage } from '@/lib/conversations/messages';

export type LandlordConversationSnapshot = {
  conversationId: string;
  messages: ConversationMessage[];
  status: string;
};

function buildLandlordIntroMessages(inquiry: LandlordInquiry) {
  const locationLabel = [inquiry.streetAddress, inquiry.region].filter(Boolean).join(', ');
  const sizeLabel = inquiry.squareFootage || 'the available square footage';
  const detailsLine = inquiry.details
    ? `I’ve also noted: ${inquiry.details}`
    : 'If there is anything important about access, ceiling height, power, or security, send it here.';

  return [
    {
      role: 'user' as const,
      content: `I have a property at ${locationLabel} and want Spacedey to review it for storage use.`,
    },
    {
      role: 'assistant' as const,
      content: `Thanks ${inquiry.firstName}, I’ve logged your property at ${locationLabel} for the partnerships team and started a review for ${sizeLabel}.`,
    },
    {
      role: 'assistant' as const,
      content: `${detailsLine}\n\nYou can reply here with exact availability, access notes, photos, floor plan context, or the best callback window.`,
    },
  ];
}

function buildLandlordReply(botReplyCount: number, message: string) {
  const normalizedMessage = message.toLowerCase();
  if (
    normalizedMessage.includes('photo') ||
    normalizedMessage.includes('image') ||
    normalizedMessage.includes('plan')
  ) {
    return 'Perfect. I’ve marked this as additional property context. If there’s a preferred call window or access detail, send that too and I’ll keep it with the enquiry.';
  }

  if (botReplyCount <= 1) {
    return 'Thanks. I’ve attached that update to your landlord enquiry and flagged it for the partnerships team.';
  }

  return 'Understood. I’ve added your latest landlord note and kept the enquiry active for review.';
}

export async function initializeLandlordConversation(
  inquiryId: string
): Promise<LandlordConversationSnapshot> {
  await ensureInAppConversationSchema();
  const supabase = createAdminClient();

  const { data: inquiry, error: inquiryError } = await supabase
    .from('landlord_inquiries')
    .select('*')
    .eq('id', inquiryId)
    .maybeSingle();

  if (inquiryError) {
    throw inquiryError;
  }

  if (!inquiry) {
    throw new Error('Landlord enquiry not found.');
  }

  const now = new Date().toISOString();
  const messages = buildLandlordIntroMessages(inquiry as unknown as LandlordInquiry);
  const chatThreadId = inquiry.chatThreadId || crypto.randomUUID();

  await supabase
    .from('landlord_inquiries')
    .update({
      chatThreadId,
      status: 'contacted',
      botReplyCount: 2,
      lastOutboundAt: now,
    })
    .eq('id', inquiry.id);

  const { data: savedMessages, error: messageError } = await supabase
    .from('landlord_messages')
    .insert(
      messages.map((message) => ({
        inquiryId: inquiry.id,
        role: message.role,
        content: message.content,
      }))
    )
    .select('*');

  if (messageError) {
    throw messageError;
  }

  return {
    conversationId: chatThreadId,
    messages: (savedMessages ?? []).map((message) => toConversationMessage(message)),
    status: 'contacted',
  };
}

export async function appendLandlordConversationMessage(args: {
  conversationId: string;
  message: string;
}): Promise<LandlordConversationSnapshot> {
  await ensureInAppConversationSchema();
  const supabase = createAdminClient();

  const { data: inquiry, error: inquiryError } = await supabase
    .from('landlord_inquiries')
    .select('*')
    .eq('chatThreadId', args.conversationId)
    .maybeSingle();

  if (inquiryError) {
    throw inquiryError;
  }

  if (!inquiry) {
    throw new Error('Landlord conversation not found.');
  }

  const now = new Date().toISOString();
  const botReplyCount = inquiry.botReplyCount + 1;
  const status = botReplyCount > 2 ? 'triaging' : 'responded';

  await supabase.from('landlord_messages').insert([
    {
      inquiryId: inquiry.id,
      role: 'user',
      content: args.message,
    },
    {
      inquiryId: inquiry.id,
      role: 'assistant',
      content: buildLandlordReply(inquiry.botReplyCount, args.message),
    },
  ]);

  await supabase
    .from('landlord_inquiries')
    .update({
      lastInboundMessage: args.message,
      lastInboundAt: now,
      lastOutboundAt: now,
      botReplyCount,
      status,
    })
    .eq('id', inquiry.id);

  const { data: allMessages, error: messagesError } = await supabase
    .from('landlord_messages')
    .select('*')
    .eq('inquiryId', inquiry.id)
    .order('createdAt', { ascending: true });

  if (messagesError) {
    throw messagesError;
  }

  return {
    conversationId: inquiry.chatThreadId || args.conversationId,
    messages: (allMessages ?? []).map((message) => toConversationMessage(message)),
    status,
  };
}
